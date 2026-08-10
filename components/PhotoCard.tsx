'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Photo } from '@/lib/types';

interface PhotoCardProps {
  photo: Photo;
}

export default function PhotoCard({ photo }: PhotoCardProps) {
  const [imgError, setImgError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Link href={`/photo/${photo.id}`} className="card photo-card">
      <div className="image-container">
        {!imgError && photo.thumbnailUrl ? (
          <Image
            src={photo.thumbnailUrl}
            alt={photo.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`photo-img ${isLoading ? 'loading' : ''}`}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setImgError(true);
              setIsLoading(false);
            }}
          />
        ) : (
          <div className="placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.8 19.2L16 11l-3.5-3.5C11.3 6.3 9.7 5.8 8 6.5L3 8.8l1.6 3.1 3.5-1.5 2 4.5-4.8 2.6L6 20h12.5l-1.8-3.4-3.2-1.7 4.3-4.2z" />
            </svg>
          </div>
        )}
        {isLoading && <div className="skeleton image-skeleton"></div>}
      </div>
      
      <div className="card-content">
        <h3 className="title">{photo.title}</h3>
        
        <div className="meta">
          {photo.year && <span className="badge badge-navy">{photo.year}</span>}
          {photo.planeType && <span className="plane-type">{photo.planeType}</span>}
        </div>
        
        {photo.planeSerial && (
          <div className="serial-container">
            <span className="serial-number">{photo.planeSerial}</span>
          </div>
        )}
      </div>

      <style jsx>{`
        .photo-card {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
        }
        .image-container {
          position: relative;
          width: 100%;
          aspect-ratio: 4/3;
          background-color: var(--bg-alt);
          overflow: hidden;
        }
        .photo-img {
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .photo-card:hover .photo-img {
          transform: scale(1.03);
        }
        .photo-img.loading {
          opacity: 0;
        }
        .placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--navy-light);
          color: var(--navy);
          opacity: 0.5;
        }
        .image-skeleton {
          position: absolute;
          inset: 0;
        }
        .card-content {
          padding: 16px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        .title {
          font-family: var(--font-heading);
          font-size: 1.125rem;
          margin-bottom: 12px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .meta {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          margin-top: auto;
        }
        .plane-type {
          font-size: 0.875rem;
          color: var(--text-muted);
        }
        .serial-container {
          margin-top: 4px;
        }
      `}</style>
    </Link>
  );
}
