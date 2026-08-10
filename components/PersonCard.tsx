'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Person } from '@/lib/types';

interface PersonCardProps {
  person: Person;
}

export default function PersonCard({ person }: PersonCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link href={`/persons/${person.id}`} className="card person-card">
      <div className="portrait-container">
        {!imgError && person.portraitUrl ? (
          <Image
            src={person.portraitUrl}
            alt={person.fullName}
            width={80}
            height={80}
            className="portrait-img"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="portrait-placeholder">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        )}
      </div>
      
      <div className="person-info">
        <h3 className="person-name">{person.fullName}</h3>
        
        {(person.rank || person.unit) && (
          <div className="person-role">
            {person.rank && <span>{person.rank}</span>}
            {person.rank && person.unit && <span> &bull; </span>}
            {person.unit && <span>{person.unit}</span>}
          </div>
        )}
        
        {(person.birthYear || person.deathYear) && (
          <div className="person-years">
            {person.birthYear || '?'} &ndash; {person.deathYear || '?'}
          </div>
        )}
      </div>

      <style jsx>{`
        .person-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 24px 16px;
          text-align: center;
          text-decoration: none;
          color: inherit;
        }
        .portrait-container {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          margin-bottom: 16px;
          overflow: hidden;
          background-color: var(--bg-alt);
          border: 2px solid var(--border);
          flex-shrink: 0;
        }
        .portrait-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .portrait-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--navy-light);
          color: var(--navy);
        }
        .person-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .person-name {
          font-family: var(--font-heading);
          font-size: 1.125rem;
          margin: 0;
        }
        .person-role {
          font-size: 0.875rem;
          color: var(--text-muted);
        }
        .person-years {
          font-size: 0.75rem;
          color: var(--border-strong);
        }
      `}</style>
    </Link>
  );
}
