'use client';

import Link from 'next/link';
import { ArchiveDocument } from '@/lib/types';

interface DocumentCardProps {
  document: ArchiveDocument;
}

export default function DocumentCard({ document }: DocumentCardProps) {
  const getBadgeClass = (category: string) => {
    switch (category) {
      case 'Manual': return 'badge-navy';
      case 'Certificate': return 'badge-gold';
      case 'Orders': return 'badge-rust';
      case 'Map': return 'badge-success';
      default: return 'badge';
    }
  };

  return (
    <Link href={`/documents/${document.id}`} className="card doc-card">
      <div className="doc-icon-col">
        <div className="doc-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
      </div>
      
      <div className="doc-content">
        <div className="doc-meta-top">
          <span className={`badge ${getBadgeClass(document.category)}`}>
            {document.category}
          </span>
          {document.year && <span className="doc-year">{document.year}</span>}
        </div>
        
        <h3 className="doc-title">{document.title}</h3>
        
        {document.description && (
          <p className="doc-desc">{document.description}</p>
        )}
        
        <div className="doc-actions">
          <button 
            className="btn btn-sm btn-secondary"
            onClick={(e) => {
              e.preventDefault();
              window.open(document.fileUrl, '_blank');
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download
          </button>
        </div>
      </div>

      <style jsx>{`
        .doc-card {
          display: flex;
          padding: 20px;
          gap: 16px;
          text-decoration: none;
          color: inherit;
        }
        .doc-icon-col {
          flex-shrink: 0;
        }
        .doc-icon {
          width: 56px;
          height: 64px;
          background-color: var(--bg-alt);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
        }
        .doc-content {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }
        .doc-meta-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .doc-year {
          font-size: 0.875rem;
          color: var(--text-muted);
          font-family: var(--font-mono);
        }
        .doc-title {
          font-family: var(--font-heading);
          font-size: 1.125rem;
          margin-bottom: 8px;
          line-height: 1.3;
        }
        .doc-desc {
          font-size: 0.875rem;
          color: var(--text-muted);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 16px;
        }
        .doc-actions {
          margin-top: auto;
          display: flex;
          justify-content: flex-end;
        }
      `}</style>
    </Link>
  );
}
