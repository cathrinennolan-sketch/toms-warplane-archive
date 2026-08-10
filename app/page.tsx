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
    <>
      {/* ── Hero Section ───────────────────────────────────────── */}
      <section style={{
        position: 'relative',
        height: '85vh',
        minHeight: '620px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: '#0E1013',
      }}>
        {/* Background image */}
        {heroPhoto?.thumbnailUrl ? (
          <div style={{
            position: 'absolute', inset: 0,
            transition: 'opacity 1.5s ease',
          }}>
            <Image
              src={heroPhoto.thumbnailUrl}
              alt={heroPhoto.title}
              fill
              style={{ objectFit: 'cover', opacity: 0.4 }}
              priority
            />
          </div>
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(circle at center, #1C2026 0%, #0E1013 100%)',
          }} />
        )}

        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(14,16,19,0.4) 0%, rgba(14,16,19,0.75) 60%, rgba(14,16,19,0.98) 100%)',
        }} />

        {/* Hero content */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          padding: '0 24px',
          maxWidth: '860px',
        }}>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '3.5px',
            textTransform: 'uppercase',
            color: '#A0AAB8',
            marginBottom: '20px',
          }}>
            WWII Aviation Photography Archive
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 700,
            color: '#FFFFFF',
            lineHeight: 1.1,
            marginBottom: '24px',
            letterSpacing: '-0.02em',
          }}>
            Tom&apos;s Warplane Archive
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1rem, 2vw, 1.18rem)',
            color: '#C1C7D0',
            marginBottom: '44px',
            lineHeight: 1.7,
            maxWidth: '640px',
            margin: '0 auto 44px',
          }}>
            Preserving the visual history of WWII aviation — photographs, personal records,
            and the stories of the men and machines that shaped history.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} style={{
            display: 'flex',
            gap: '0',
            maxWidth: '560px',
            margin: '0 auto 48px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            borderRadius: '6px',
            overflow: 'hidden',
          }}>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by pilot, serial number, unit, or aircraft…"
              style={{
                flex: 1,
                padding: '16px 20px',
                fontSize: '15px',
                fontFamily: 'var(--font-body)',
                border: 'none',
                background: '#FFFFFF',
                color: '#121417',
                outline: 'none',
              }}
            />
            <button type="submit" style={{
              padding: '16px 28px',
              background: '#16191D',
              color: '#FFFFFF',
              border: 'none',
              borderLeft: '1px solid #2D333C',
              cursor: 'pointer',
              fontSize: '15px',
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              transition: 'all 0.2s ease',
            }}>
              Search
            </button>
          </form>

          {/* Stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '56px',
            flexWrap: 'wrap',
          }}>
            {[
              { value: '3,000+', label: 'Photographs' },
              { value: '400+', label: 'Aircraft' },
              { value: '1939–1945', label: 'Era Covered' },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2.1rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  marginBottom: '2px',
                }}>{stat.value}</p>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color: '#8C96A5',
                }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hero nav dots */}
        {featuredPhotos.length > 1 && (
          <div style={{
            position: 'absolute', bottom: '32px',
            left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: '8px', zIndex: 2,
          }}>
            {featuredPhotos.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentHero(i)}
                aria-label={`Go to photo ${i + 1}`}
                style={{
                  width: i === currentHero ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: i === currentHero ? '#FFFFFF' : 'rgba(255,255,255,0.25)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  padding: 0,
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Browse Categories ─────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: '12px',
            }}>Browse the Archive</p>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
              color: 'var(--text)',
            }}>Three Ways to Explore</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}>
            {[
              {
                href: '/gallery',
                icon: '📷',
                title: 'Photographs',
                desc: 'Browse thousands of wartime aircraft photographs, searchable by aircraft type, serial number, unit, and date.',
                cta: 'Browse Gallery',
                color: '#16191D',
              },
              {
                href: '/persons',
                icon: '🧑‍✈️',
                title: 'Historic Persons',
                desc: 'Read biographies of pilots, crew members, and other notable figures — linked to their photographs and records.',
                cta: 'Meet the Airmen',
                color: '#4F5866',
              },
              {
                href: '/documents',
                icon: '📄',
                title: 'Documents',
                desc: 'Pilot manuals, printed orders, certificates, maps, and other primary source materials from the war.',
                cta: 'View Documents',
                color: '#8C96A5',
              },
            ].map(card => (
              <Link key={card.href} href={card.href} style={{ textDecoration: 'none' }}>
                <div className="card" style={{
                  padding: '40px 32px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  borderTop: `4px solid ${card.color}`,
                }}>
                  <span style={{ fontSize: '2.5rem', marginBottom: '20px' }}>{card.icon}</span>
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.5rem',
                    color: 'var(--text)',
                    marginBottom: '12px',
                  }}>{card.title}</h3>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    color: 'var(--text-muted)',
                    lineHeight: 1.7,
                    flex: 1,
                    marginBottom: '24px',
                  }}>{card.desc}</p>
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: card.color,
                    letterSpacing: '0.5px',
                  }}>
                    {card.cta} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recent Photos Preview ─────────────────────────────── */}
      {featuredPhotos.length > 0 && (
        <section className="section" style={{ background: 'var(--bg-alt)' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  marginBottom: '8px',
                }}>Recently Added</p>
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                  color: 'var(--text)',
                }}>Latest Photographs</h2>
              </div>
              <Link href="/gallery" className="btn btn-secondary">View All Photos</Link>
            </div>

            <div className="photo-grid">
              {featuredPhotos.slice(0, 3).map(photo => (
                <Link key={photo.id} href={`/photo/${photo.id}`} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ overflow: 'hidden' }}>
                    <div style={{ position: 'relative', aspectRatio: '4/3', background: 'var(--bg-alt)' }}>
                      {photo.thumbnailUrl ? (
                        <Image src={photo.thumbnailUrl} alt={photo.title} fill style={{ objectFit: 'cover' }} />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                          <span style={{ fontSize: '3rem', opacity: 0.3 }}>✈️</span>
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '16px' }}>
                      <h3 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1rem',
                        color: 'var(--text)',
                        marginBottom: '8px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>{photo.title}</h3>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                        {photo.year && <span className="badge badge-navy">{photo.year}</span>}
                        {photo.planeType && <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{photo.planeType}</span>}
                        {photo.planeSerial && <span className="serial-number" style={{ fontSize: '11px' }}>{photo.planeSerial}</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── About / Mission ───────────────────────────────────── */}
      <section className="section" style={{ background: '#0E1013', color: 'var(--text-light)' }}>
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: '#8C96A5',
            marginBottom: '16px',
          }}>About the Archive</p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
            marginBottom: '24px',
            color: '#FFFFFF',
          }}>Preserving Aviation History</h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.08rem',
            lineHeight: 1.8,
            color: '#C1C7D0',
            marginBottom: '32px',
          }}>
            This archive is dedicated to collecting, preserving, and sharing photographs and records
            from WWII aviation. Each image is paired with detailed metadata — aircraft serial numbers,
            unit assignments, crew information, and contextual history — to serve researchers,
            historians, and aviation enthusiasts worldwide.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/gallery" className="btn btn-primary" style={{ background: '#FFFFFF', color: '#121417', borderColor: '#FFFFFF' }}>Explore the Gallery</Link>
            <Link href="/search" className="btn btn-secondary" style={{ borderColor: 'rgba(255,255,255,0.25)', color: '#FFFFFF', background: 'transparent' }}>Search the Archive</Link>
          </div>
        </div>
      </section>
    </>
  );
}
