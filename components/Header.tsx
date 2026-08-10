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
          background-color: var(--navy);
          color: var(--surface);
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: var(--shadow-sm);
        }
        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
        }
        .logo {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--gold-light);
          text-decoration: none;
        }
        .desktop-nav {
          display: none;
          gap: 32px;
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
          color: var(--surface);
          opacity: 0.9;
          transition: all var(--transition-fast);
          padding: 8px 0;
          border-bottom: 2px solid transparent;
        }
        .nav-link:hover {
          opacity: 1;
          color: var(--gold-light);
        }
        .nav-link.active {
          opacity: 1;
          color: var(--gold);
          border-bottom-color: var(--gold);
        }
        .header-right {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .admin-link {
          font-size: 0.875rem;
          color: var(--navy-light);
          opacity: 0.8;
        }
        .admin-link:hover {
          opacity: 1;
          text-decoration: underline;
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
          background-color: var(--navy-dark);
          padding: 16px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .mobile-nav-link {
          color: var(--surface);
          font-weight: 500;
          padding: 8px 0;
          display: block;
        }
        .mobile-nav-link.active {
          color: var(--gold);
        }
        .admin-mobile-link {
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 16px;
          margin-top: 8px;
          color: var(--navy-light);
        }
      `}</style>
    </header>
  );
}
