'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Gallery', path: '/gallery' },
    { name: 'Persons', path: '/persons' },
    { name: 'Documents', path: '/documents' },
    { name: 'Search', path: '/search' },
  ];

  return (
    <header className="header">
      <div className="container header-container">
        <Link href="/" className="logo">
          Tom's Warplane Archive
        </Link>

        {/* Desktop Nav */}
        <nav className="desktop-nav">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`nav-link ${pathname.startsWith(link.path) ? 'active' : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="header-right">
          <Link href="/admin" className="admin-link">
            Admin
          </Link>
          
          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="mobile-nav">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`mobile-nav-link ${pathname.startsWith(link.path) ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link 
            href="/admin" 
            className="mobile-nav-link admin-mobile-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Admin
          </Link>
        </div>
      )}

      <style jsx>{`
        .header {
          background-color: #0F1114;
          color: var(--text-light);
          position: sticky;
          top: 0;
          z-index: 100;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
        }
        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
        }
        .logo {
          font-family: var(--font-heading);
          font-size: 1.4rem;
          font-weight: 700;
          color: #FFFFFF;
          text-decoration: none;
          letter-spacing: -0.01em;
        }
        .desktop-nav {
          display: none;
          gap: 36px;
        }
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex;
          }
          .mobile-menu-btn {
            display: none;
          }
        }
        .nav-link {
          font-weight: 500;
          font-size: 0.9375rem;
          color: #9EA7B5;
          transition: all var(--transition-fast);
          padding: 8px 0;
          border-bottom: 2px solid transparent;
          letter-spacing: 0.02em;
        }
        .nav-link:hover {
          color: #FFFFFF;
        }
        .nav-link.active {
          color: #FFFFFF;
          border-bottom-color: var(--silver-bright);
        }
        .header-right {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .admin-link {
          font-size: 0.84375rem;
          color: #9EA7B5;
          padding: 6px 12px;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }
        .admin-link:hover {
          color: #FFFFFF;
          border-color: rgba(255,255,255,0.4);
          background-color: rgba(255,255,255,0.05);
        }
        .mobile-menu-btn {
          background: none;
          border: none;
          color: var(--surface);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
        }
        .mobile-nav {
          background-color: #16191D;
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .mobile-nav-link {
          color: #9EA7B5;
          font-weight: 500;
          padding: 8px 0;
          display: block;
        }
        .mobile-nav-link.active {
          color: #FFFFFF;
        }
        .admin-mobile-link {
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 16px;
          margin-top: 8px;
          color: #9EA7B5;
        }
      `}</style>
    </header>
  );
}
