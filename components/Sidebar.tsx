'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const mainNav = [
    { name: 'Home', path: '/', icon: '🏛️' },
    { name: 'Photo Gallery', path: '/gallery', icon: '📷' },
    { name: 'Historic Airmen', path: '/persons', icon: '🧑‍✈️' },
    { name: 'Documents', path: '/documents', icon: '📄' },
    { name: 'Search Archive', path: '/search', icon: '🔍' },
  ];

  const adminNav = [
    { name: 'Admin Portal', path: '/admin', icon: '🔐' },
  ];

  return (
    <>
      {/* Mobile Toggle Button (Sticky Bar on Mobile) */}
      <div className="mobile-header">
        <Link href="/" className="mobile-logo">
          Tom&apos;s Warplane Archive
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="mobile-toggle-btn"
          aria-label="Toggle navigation"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Backdrop for Mobile */}
      {mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${mobileOpen ? 'mobile-show' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div className="brand-icon">✈️</div>
          <div className="brand-text">
            <Link href="/" onClick={() => setMobileOpen(false)}>
              <h1 className="brand-title">Tom&apos;s Archive</h1>
              <p className="brand-subtitle">WWII Aviation History</p>
            </Link>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="sidebar-scroll">
          <div className="nav-section">
            <p className="section-label">MAIN ARCHIVES</p>
            <nav className="nav-list">
              {mainNav.map((item) => {
                const isActive = item.path === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.path);

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-text">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="nav-section">
            <p className="section-label">MANAGEMENT</p>
            <nav className="nav-list">
              {adminNav.map((item) => {
                const isActive = pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-text">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Quick Info Box */}
          <div className="sidebar-card">
            <p className="card-tag">DIGITAL ARCHIVE</p>
            <p className="card-title">3,000+ Photographs</p>
            <p className="card-desc">WWII aircraft, pilot records & primary sources.</p>
          </div>
        </div>

        {/* Footer info in sidebar */}
        <div className="sidebar-footer">
          <p>© {new Date().getFullYear()} Tom&apos;s Archive</p>
        </div>
      </aside>

      <style jsx>{`
        .mobile-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 60px;
          padding: 0 20px;
          background-color: #D8DCE4;
          border-bottom: 1px solid #BCC3D0;
          position: sticky;
          top: 0;
          z-index: 90;
        }
        @media (min-width: 1024px) {
          .mobile-header {
            display: none;
          }
        }
        .mobile-logo {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1.1rem;
          color: #121417;
        }
        .mobile-toggle-btn {
          background: none;
          border: none;
          color: #121417;
          cursor: pointer;
          padding: 4px;
        }

        .sidebar-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          z-index: 95;
        }

        .sidebar {
          width: 270px;
          height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
          background-color: #ECEFF4;
          border-right: 1px solid #D2D7E0;
          display: flex;
          flex-direction: column;
          z-index: 100;
          transition: transform 0.3s ease;
        }

        @media (max-width: 1023px) {
          .sidebar {
            transform: translateX(-100%);
          }
          .sidebar.mobile-show {
            transform: translateX(0);
          }
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 24px 20px;
          border-bottom: 1px solid #D2D7E0;
          background-color: #E2E6EE;
        }
        .brand-icon {
          width: 44px;
          height: 44px;
          background-color: #FFFFFF;
          border: 1px solid #C4CBD6;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.04);
        }
        .brand-title {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 700;
          color: #121417;
          line-height: 1.2;
          margin: 0;
        }
        .brand-subtitle {
          font-size: 0.75rem;
          color: #5C6470;
          margin: 2px 0 0;
          font-weight: 500;
          letter-spacing: 0.02em;
        }

        .sidebar-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 20px 16px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .section-label {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #5C6470;
          margin-bottom: 10px;
          padding-left: 10px;
        }

        .nav-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: var(--radius-md);
          color: #3B424E;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.2s ease;
          text-decoration: none;
        }
        .nav-item:hover {
          background-color: #DFE4ED;
          color: #121417;
        }
        .nav-item.active {
          background-color: #121417;
          color: #FFFFFF;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
        .nav-icon {
          font-size: 1.1rem;
        }

        .sidebar-card {
          margin-top: auto;
          padding: 16px;
          background-color: #FFFFFF;
          border: 1px solid #D2D7E0;
          border-radius: var(--radius-md);
          box-shadow: 0 2px 6px rgba(0,0,0,0.03);
        }
        .card-tag {
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: #4F5866;
          margin-bottom: 4px;
        }
        .card-title {
          font-family: var(--font-heading);
          font-size: 0.95rem;
          font-weight: 700;
          color: #121417;
          margin-bottom: 4px;
        }
        .card-desc {
          font-size: 0.78rem;
          color: #5C6470;
          line-height: 1.4;
        }

        .sidebar-footer {
          padding: 16px 20px;
          border-top: 1px solid #D2D7E0;
          font-size: 0.75rem;
          color: #727B88;
        }
      `}</style>
    </>
  );
}
