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
          background-color: #1A2E4A;
          color: var(--text-light);
          padding: 64px 0 32px;
          border-top: 1px solid rgba(255,255,255,0.1);
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
          color: var(--gold-light);
          margin-bottom: 12px;
          font-size: 1.25rem;
        }
        .footer-brand p {
          color: rgba(255,255,255,0.7);
          font-size: 0.875rem;
        }
        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .footer-links h4 {
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--surface);
          margin-bottom: 8px;
        }
        .footer-links a {
          color: rgba(255,255,255,0.7);
          font-size: 0.875rem;
          transition: color var(--transition-fast);
        }
        .footer-links a:hover {
          color: var(--gold);
        }
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 24px;
          text-align: center;
          font-size: 0.875rem;
          color: rgba(255,255,255,0.5);
        }
      `}</style>
    </footer>
  );
}
