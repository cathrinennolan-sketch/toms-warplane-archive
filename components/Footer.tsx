'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>Tom's Warplane Archive</h3>
            <p>Preserving WWII aviation history through photography.</p>
          </div>
          
          <div className="footer-links">
            <h4>Archive</h4>
            <Link href="/gallery">Gallery</Link>
            <Link href="/persons">Persons</Link>
            <Link href="/documents">Documents</Link>
          </div>
          
          <div className="footer-links">
            <h4>Research</h4>
            <Link href="/search">Search</Link>
          </div>
          
          <div className="footer-links">
            <h4>Site</h4>
            <Link href="/admin">Admin Login</Link>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Tom's Warplane Archive. All rights reserved.</p>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background-color: #CBD1DC;
          color: var(--text);
          padding: 64px 0 32px;
          border-top: 1px solid #B0B7C4;
          margin-top: auto;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 40px;
          margin-bottom: 48px;
        }
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
        }
        .footer-brand h3 {
          font-family: var(--font-heading);
          color: #121417;
          margin-bottom: 12px;
          font-size: 1.25rem;
          letter-spacing: -0.01em;
        }
        .footer-brand p {
          color: #4A5260;
          font-size: 0.875rem;
        }
        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .footer-links h4 {
          font-size: 0.8125rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #121417;
          margin-bottom: 8px;
          font-weight: 700;
        }
        .footer-links a {
          color: #3D4552;
          font-size: 0.875rem;
          font-weight: 500;
          transition: color var(--transition-fast);
        }
        .footer-links a:hover {
          color: #121417;
          text-decoration: underline;
        }
        .footer-bottom {
          border-top: 1px solid #B0B7C4;
          padding-top: 24px;
          text-align: center;
          font-size: 0.875rem;
          color: #5A6372;
        }
      `}</style>
    </footer>
  );
}
