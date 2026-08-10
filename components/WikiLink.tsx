'use client';

import Link from 'next/link';

interface WikiLinkProps {
  type: 'photo' | 'person' | 'document';
  id: string;
  label: string;
  className?: string;
}

export default function WikiLink({ type, id, label, className = '' }: WikiLinkProps) {
  let icon = '';
  let basePath = '';
  
  switch (type) {
    case 'photo':
      icon = '📷';
      basePath = '/photo';
      break;
    case 'person':
      icon = '👤';
      basePath = '/persons';
      break;
    case 'document':
      icon = '📄';
      basePath = '/documents';
      break;
  }

  return (
    <Link href={`${basePath}/${id}`} className={`wiki-link ${className}`}>
      <span className="wiki-icon">{icon}</span>
      <span className="wiki-label">{label}</span>
      
      <style jsx>{`
        .wiki-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: var(--navy);
          font-weight: 500;
          transition: all var(--transition-fast);
          padding: 2px 4px;
          border-radius: var(--radius-sm);
          background-color: transparent;
        }
        .wiki-link:hover {
          background-color: var(--navy-light);
          text-decoration: underline;
        }
        .wiki-icon {
          font-size: 0.875rem;
          opacity: 0.8;
        }
      `}</style>
    </Link>
  );
}
