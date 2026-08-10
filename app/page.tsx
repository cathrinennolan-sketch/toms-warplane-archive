'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getPhotos } from '@/lib/firestore';
import { Photo } from '@/lib/types';

export default function HomePage() {
  const [featuredPhotos, setFeaturedPhotos] = useState<Photo[]>([]);
  const [currentHero, setCurrentHero] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPhotos({}, 6).then(({ photos }) => {
      setFeaturedPhotos(photos);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Rotate hero image every 6 seconds
  useEffect(() => {
    if (featuredPhotos.length < 2) return;
    const interval = setInterval(() => {
      setCurrentHero(prev => (prev + 1) % featuredPhotos.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featuredPhotos.length]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  }, [searchQuery]);

  const heroPhoto = featuredPhotos[currentHero];

  return (
    <div className="home-page-container">
      {/* ── Senoia-style Digital Archive Banner ─────────────────── */}
      <section className="archive-hero-banner">
        {/* Background photo preview if available */}
        {heroPhoto?.thumbnailUrl && (
          <div className="hero-bg-photo">
            <Image
              src={heroPhoto.thumbnailUrl}
              alt={heroPhoto.title}
              fill
              style={{ objectFit: 'cover', opacity: 0.2 }}
              priority
            />
          </div>
        )}

        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">🏛️</span>
            <span>DIGITAL ARCHIVES & SPECIAL COLLECTIONS</span>
          </div>

          <h1 className="hero-title">
            Explore WWII Aviation History
          </h1>

          <p className="hero-subtitle">
            A comprehensive repository of wartime aircraft photography, pilot biographies, unit records, and primary historical documents.
          </p>

          {/* Archive Search Bar */}
          <form onSubmit={handleSearch} className="archive-search-box">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by aircraft serial number, pilot name, unit, or date…"
              className="search-field"
            />
            <button type="submit" className="search-btn">
              Search Database
            </button>
          </form>

          {/* Quick Filter Tags */}
          <div className="quick-tags">
            <span className="tags-label">Popular Searches:</span>
            <Link href="/search?q=B-17" className="tag-link">B-17 Fortress</Link>
            <Link href="/search?q=P-51" className="tag-link">P-51 Mustang</Link>
            <Link href="/search?q=8th+Air+Force" className="tag-link">8th Air Force</Link>
            <Link href="/search?q=Serial" className="tag-link">Serial Numbers</Link>
          </div>

          {/* Stats Bar */}
          <div className="hero-stats-row">
            <div className="stat-pill">
              <span className="stat-num">3,000+</span>
              <span className="stat-lbl">Wartime Photos</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-pill">
              <span className="stat-num">400+</span>
              <span className="stat-lbl">Aircraft Cataloged</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-pill">
              <span className="stat-num">1939–1945</span>
              <span className="stat-lbl">Historical Era</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Curated Digital Collections ─────────────────────────── */}
      <section className="collections-section">
        <div className="container">
          <div className="section-header">
            <p className="section-kicker">DISCOVERY TOOLS & COLLECTIONS</p>
            <h2 className="section-title">Explore Archives & Records</h2>
          </div>

          <div className="collections-grid">
            <Link href="/gallery" className="collection-card-link">
              <div className="collection-card">
                <div className="card-badge">PHOTOGRAPHY</div>
                <div className="card-icon-box">📷</div>
                <h3 className="card-title">Wartime Aircraft Gallery</h3>
                <p className="card-desc">
                  High-resolution photo archive with detailed plane serial numbers, crew rosters, and contextual explanations.
                </p>
                <div className="card-action">
                  <span>Browse Photographs →</span>
                </div>
              </div>
            </Link>

            <Link href="/persons" className="collection-card-link">
              <div className="collection-card">
                <div className="card-badge">BIOGRAPHIES</div>
                <div className="card-icon-box">🧑‍✈️</div>
                <h3 className="card-title">Historic Airmen & Pilots</h3>
                <p className="card-desc">
                  Biographical profiles of wartime pilots and crew members, cross-referenced with postwar photos and records.
                </p>
                <div className="card-action">
                  <span>Explore Biographies →</span>
                </div>
              </div>
            </Link>

            <Link href="/documents" className="collection-card-link">
              <div className="collection-card">
                <div className="card-badge">DOCUMENTS</div>
                <div className="card-icon-box">📄</div>
                <h3 className="card-title">Primary Source Documents</h3>
                <p className="card-desc">
                  PDF scans of flight manuals, printed orders, certificates, maps, and official military documentation.
                </p>
                <div className="card-action">
                  <span>View Documents →</span>
                </div>
              </div>
            </Link>

            <Link href="/search" className="collection-card-link">
              <div className="collection-card">
                <div className="card-badge">RESEARCH</div>
                <div className="card-icon-box">🔍</div>
                <h3 className="card-title">Advanced Search & Filtering</h3>
                <p className="card-desc">
                  Query the archive by plane serial number, military unit, pilot name, or specific historical date ranges.
                </p>
                <div className="card-action">
                  <span>Open Research Tool →</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Recent Acquisitions Preview ─────────────────────────── */}
      {featuredPhotos.length > 0 && (
        <section className="acquisitions-section">
          <div className="container">
            <div className="acquisitions-header">
              <div>
                <p className="section-kicker">RECENT ACQUISITIONS</p>
                <h2 className="section-title">Latest Digital Additions</h2>
              </div>
              <Link href="/gallery" className="btn btn-secondary">View Full Gallery</Link>
            </div>

            <div className="photo-grid">
              {featuredPhotos.slice(0, 3).map(photo => (
                <Link key={photo.id} href={`/photo/${photo.id}`} style={{ textDecoration: 'none' }}>
                  <div className="card archive-item-card">
                    <div className="card-img-wrap">
                      {photo.thumbnailUrl ? (
                        <Image src={photo.thumbnailUrl} alt={photo.title} fill style={{ objectFit: 'cover' }} />
                      ) : (
                        <div className="placeholder-box">✈️</div>
                      )}
                    </div>
                    <div className="card-body">
                      <h3 className="item-title">{photo.title}</h3>
                      <div className="item-meta">
                        {photo.year && <span className="badge badge-navy">{photo.year}</span>}
                        {photo.planeType && <span className="meta-text">{photo.planeType}</span>}
                        {photo.planeSerial && <span className="serial-number">{photo.planeSerial}</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Archival Mission Statement ───────────────────────────── */}
      <section className="mission-section">
        <div className="container-narrow">
          <div className="mission-box">
            <p className="section-kicker">ABOUT THE DIGITAL ARCHIVE</p>
            <h2 className="mission-title">Preserving History, One Record at a Time</h2>
            <p className="mission-desc">
              Tom&apos;s Warplane Archive is dedicated to securing, preserving, and providing public access to WWII aviation history.
              Every photograph is documented with exact serial numbers, photographer credits, and unit history to assist researchers and historians worldwide.
            </p>
            <div className="mission-actions">
              <Link href="/gallery" className="btn btn-primary">Browse All Collections</Link>
              <Link href="/admin" className="btn btn-secondary">Admin Access</Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .home-page-container {
          display: flex;
          flex-direction: column;
        }

        .archive-hero-banner {
          position: relative;
          background: linear-gradient(135deg, #E6EAEE 0%, #C4CBD7 100%);
          padding: 64px 24px;
          border-bottom: 1px solid #C0C7D4;
          overflow: hidden;
        }
        .hero-bg-photo {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 860px;
          margin: 0 auto;
          text-align: center;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background-color: #FFFFFF;
          border: 1px solid #C4CBD6;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: #3D4552;
          margin-bottom: 24px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.03);
        }
        .badge-icon {
          font-size: 0.9rem;
        }

        .hero-title {
          font-family: var(--font-heading);
          font-size: clamp(2.2rem, 5vw, 3.8rem);
          font-weight: 700;
          color: #121417;
          line-height: 1.15;
          margin-bottom: 18px;
          letter-spacing: -0.02em;
        }

        .hero-subtitle {
          font-size: clamp(1rem, 2vw, 1.15rem);
          color: #343A45;
          line-height: 1.7;
          max-width: 680px;
          margin: 0 auto 36px;
        }

        .archive-search-box {
          display: flex;
          max-width: 620px;
          margin: 0 auto 20px;
          background-color: #FFFFFF;
          border: 1px solid #A8B1C0;
          border-radius: var(--radius-md);
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
          overflow: hidden;
        }
        .search-field {
          flex: 1;
          padding: 16px 20px;
          border: none;
          font-family: var(--font-body);
          font-size: 0.95rem;
          color: #121417;
          outline: none;
        }
        .search-btn {
          padding: 16px 28px;
          background-color: #121417;
          color: #FFFFFF;
          border: none;
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 0.9375rem;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .search-btn:hover {
          background-color: #2D333C;
        }

        .quick-tags {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 40px;
        }
        .tags-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: #5C6470;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .tag-link {
          font-size: 0.8125rem;
          color: #121417;
          background-color: rgba(255,255,255,0.7);
          padding: 4px 10px;
          border-radius: var(--radius-full);
          border: 1px solid #C4CBD6;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .tag-link:hover {
          background-color: #FFFFFF;
          border-color: #121417;
        }

        .hero-stats-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 32px;
          flex-wrap: wrap;
          padding-top: 24px;
          border-top: 1px solid rgba(18,20,23,0.12);
        }
        .stat-pill {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .stat-num {
          font-family: var(--font-heading);
          font-size: 1.8rem;
          font-weight: 700;
          color: #121417;
          line-height: 1;
        }
        .stat-lbl {
          font-size: 0.75rem;
          font-weight: 600;
          color: #4F5866;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-top: 4px;
        }
        .stat-divider {
          width: 1px;
          height: 28px;
          background-color: rgba(18,20,23,0.15);
        }
        @media (max-width: 640px) {
          .stat-divider { display: none; }
        }

        .collections-section {
          padding: 64px 0;
          background-color: var(--bg);
        }
        .section-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .section-kicker {
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: #5C6470;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .section-title {
          font-family: var(--font-heading);
          font-size: clamp(1.6rem, 3vw, 2.4rem);
          color: #121417;
        }

        .collections-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 24px;
        }
        .collection-card-link {
          text-decoration: none;
          color: inherit;
        }
        .collection-card {
          background-color: #FFFFFF;
          border: 1px solid #D8DCE4;
          border-radius: var(--radius-lg);
          padding: 32px 24px;
          height: 100%;
          display: flex;
          flex-direction: column;
          transition: all 0.25s ease;
          box-shadow: 0 2px 6px rgba(0,0,0,0.03);
          position: relative;
        }
        .collection-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.08);
          border-color: #A8B1C0;
        }

        .card-badge {
          align-self: flex-start;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: #4F5866;
          background-color: #EFF2F6;
          padding: 3px 8px;
          border-radius: var(--radius-sm);
          margin-bottom: 16px;
        }

        .card-icon-box {
          width: 52px;
          height: 52px;
          background-color: #F4F6F9;
          border: 1px solid #E2E6ED;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin-bottom: 20px;
        }

        .card-title {
          font-family: var(--font-heading);
          font-size: 1.3rem;
          font-weight: 700;
          color: #121417;
          margin-bottom: 10px;
        }

        .card-desc {
          font-size: 0.875rem;
          color: #5C6470;
          line-height: 1.6;
          flex: 1;
          margin-bottom: 24px;
        }

        .card-action {
          font-size: 0.875rem;
          font-weight: 700;
          color: #121417;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .acquisitions-section {
          padding: 64px 0;
          background-color: #EFF2F6;
          border-top: 1px solid #E1E5ED;
          border-bottom: 1px solid #E1E5ED;
        }
        .acquisitions-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .archive-item-card {
          height: 100%;
        }
        .card-img-wrap {
          position: relative;
          aspect-ratio: 4/3;
          background-color: #D8DCE4;
        }
        .placeholder-box {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          opacity: 0.3;
        }
        .card-body {
          padding: 16px;
        }
        .item-title {
          font-family: var(--font-heading);
          font-size: 1rem;
          color: #121417;
          margin-bottom: 10px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .item-meta {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
        }
        .meta-text {
          font-size: 0.78rem;
          color: #5C6470;
        }

        .mission-section {
          padding: 64px 0;
          background-color: #D5DAE3;
        }
        .mission-box {
          text-align: center;
          background-color: #FFFFFF;
          padding: 48px 36px;
          border-radius: var(--radius-lg);
          border: 1px solid #C4CBD6;
          box-shadow: 0 4px 16px rgba(0,0,0,0.04);
        }
        .mission-title {
          font-family: var(--font-heading);
          font-size: clamp(1.6rem, 3vw, 2.2rem);
          color: #121417;
          margin-bottom: 16px;
        }
        .mission-desc {
          font-size: 1rem;
          color: #4F5866;
          line-height: 1.7;
          margin-bottom: 32px;
        }
        .mission-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }
      `}</style>
    </div>
  );
}
