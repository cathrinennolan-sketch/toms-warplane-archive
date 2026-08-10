'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="top-header">
      <div className="top-header-container">
        {/* Quick Search */}
        <form onSubmit={handleSearchSubmit} className="top-search-form">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search photos, pilots, serial numbers, manuals..."
            className="top-search-input"
          />
        </form>

        {/* Right Status & Actions */}
        <div className="top-header-right">
          <div className="status-badge">
            <span className="status-dot"></span>
            <span>Public Access</span>
          </div>

          <Link href="/admin" className="admin-btn">
            <span>Admin Portal</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .top-header {
          background-color: #E2E6EE;
          border-bottom: 1px solid #D2D7E0;
          position: sticky;
          top: 0;
          z-index: 80;
        }
        .top-header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
          padding: 0 24px;
          gap: 20px;
        }
        .top-search-form {
          position: relative;
          flex: 1;
          max-width: 480px;
        }
        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #727B88;
          pointer-events: none;
        }
        .top-search-input {
          width: 100%;
          padding: 9px 12px 9px 38px;
          border-radius: var(--radius-md);
          border: 1px solid #C4CBD6;
          background-color: #FFFFFF;
          font-family: var(--font-body);
          font-size: 0.875rem;
          color: #121417;
          transition: all 0.2s ease;
        }
        .top-search-input:focus {
          outline: none;
          border-color: #121417;
          box-shadow: 0 0 0 3px rgba(18,20,23,0.06);
        }
        .top-header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .status-badge {
          display: none;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          font-weight: 600;
          color: #4F5866;
          background-color: #FFFFFF;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          border: 1px solid #D2D7E0;
        }
        @media (min-width: 768px) {
          .status-badge {
            display: flex;
          }
        }
        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: var(--success);
        }
        .admin-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: var(--radius-md);
          background-color: #121417;
          color: #FFFFFF;
          font-size: 0.8125rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .admin-btn:hover {
          background-color: #2D333C;
        }
      `}</style>
    </header>
  );
}
