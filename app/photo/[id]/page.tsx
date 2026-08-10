'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { getPhoto, getPersonsByIds, getDocumentsByIds, getPhotos } from '@/lib/firestore';
import { Photo, Person, ArchiveDocument } from '@/lib/types';
import PersonCard from '@/components/PersonCard';
import DocumentCard from '@/components/DocumentCard';
import PhotoCard from '@/components/PhotoCard';
import CaptionOverlay from '@/components/CaptionOverlay';
import ImageDownloader from '@/components/ImageDownloader';
import TagBadge from '@/components/TagBadge';

export default function PhotoDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [linkedPersons, setLinkedPersons] = useState<Person[]>([]);
  const [linkedDocs, setLinkedDocs] = useState<ArchiveDocument[]>([]);
  const [relatedPhotos, setRelatedPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCaption, setShowCaption] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getPhoto(id);
        if (!data) return;
        setPhoto(data);
        
        const [persons, docs, related] = await Promise.all([
          data.personIds?.length ? getPersonsByIds(data.personIds) : Promise.resolve([]),
          data.relatedDocIds?.length ? getDocumentsByIds(data.relatedDocIds) : Promise.resolve([]),
          data.unit ? getPhotos({ unit: data.unit }, 4) : Promise.resolve({ photos: [] })
        ]);
        
        setLinkedPersons(persons);
        setLinkedDocs(docs);
        setRelatedPhotos(related.photos.filter((p: Photo) => p.id !== id).slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'c') setShowCaption(prev => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (loading) return <div className="spinner" style={{ margin: '100px auto', textAlign: 'center' }}>Loading historical record...</div>;
  if (!photo) return <div className="empty-state" style={{ padding: '100px', textAlign: 'center' }}>Photograph not found.</div>;

  return (
    <div style={{ backgroundColor: 'var(--bg)' }}>
      {/* Full-screen viewer */}
      <div style={{ 
        height: '100vh', 
        backgroundColor: 'var(--bg-dark)', 
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        <img src={photo.imageUrl} alt={photo.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
        
        <button 
          onClick={() => setShowCaption(!showCaption)}
          style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10, background: 'rgba(0,0,0,0.5)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
        >
          {showCaption ? 'Hide Caption (C)' : 'Show Caption (C)'}
        </button>

        {showCaption && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
            <CaptionOverlay title={photo.title} date={photo.dateApprox} />
          </div>
        )}
      </div>
      
      <div style={{ textAlign: 'center', padding: '10px', backgroundColor: '#000', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        &copy; Tom's Warplane Archive. All Rights Reserved.
      </div>

      <div className="container" style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
        
        {/* Download Bar */}
        <div className="card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', marginBottom: '30px' }}>
          <div>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-display)' }}>Archive Downloads</h3>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{photo.downloadCount || 0} downloads</span>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <ImageDownloader url={photo.imageUrl} filename={\`\${photo.id}-caption.jpg\`} label="⬇ Download with Caption" type="primary" />
            <ImageDownloader url={photo.imageCleanUrl} filename={\`\${photo.id}-original.jpg\`} label="⬇ Download Original" type="secondary" />
          </div>
        </div>

        {/* Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }} className="info-grid">
          
          {/* Left Column: Metadata */}
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', margin: '0 0 20px 0', color: 'var(--navy)' }}>{photo.title}</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px', padding: '20px', backgroundColor: 'var(--bg-alt)', borderRadius: '8px' }}>
              <div><strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.85rem', textTransform: 'uppercase' }}>Date</strong>{photo.dateApprox || photo.year || 'Unknown'}</div>
              <div><strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.85rem', textTransform: 'uppercase' }}>Plane Type</strong>{photo.planeType || 'N/A'}</div>
              <div><strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.85rem', textTransform: 'uppercase' }}>Serial Number</strong><span className="serial-number">{photo.planeSerial || 'N/A'}</span></div>
              <div><strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.85rem', textTransform: 'uppercase' }}>Unit</strong>{photo.unit || 'N/A'}</div>
              <div><strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.85rem', textTransform: 'uppercase' }}>Photographer</strong>{photo.photographer || 'Unknown'}</div>
              <div><strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.85rem', textTransform: 'uppercase' }}>Source</strong>{photo.source || 'Archive'}</div>
            </div>

            <div style={{ lineHeight: '1.7', fontSize: '1.1rem', color: 'var(--text)', marginBottom: '30px' }}>
              {photo.description || 'No detailed description available for this record.'}
            </div>

            {photo.peopleInPhoto && photo.peopleInPhoto.length > 0 && (
              <div style={{ marginBottom: '30px' }}>
                <h4 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>People Identified in Photograph</h4>
                <ul style={{ paddingLeft: '20px' }}>
                  {photo.peopleInPhoto.map((name, i) => <li key={i}>{name}</li>)}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column: Relations & Tags */}
          <div>
            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>Tags</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {photo.tags?.map(tag => <TagBadge key={tag} tag={tag} />)}
              </div>
            </div>

            {linkedPersons.length > 0 && (
              <div style={{ marginBottom: '30px' }}>
                <h4 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>Linked Airmen</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {linkedPersons.map(person => <PersonCard key={person.id} person={person} />)}
                </div>
              </div>
            )}

            {linkedDocs.length > 0 && (
              <div style={{ marginBottom: '30px' }}>
                <h4 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>Related Documents</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {linkedDocs.map(doc => <DocumentCard key={doc.id} document={doc} />)}
                </div>
              </div>
            )}

            {relatedPhotos.length > 0 && (
              <div style={{ marginBottom: '30px' }}>
                <h4 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>Related Photographs</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
                  {relatedPhotos.map(rp => <PhotoCard key={rp.id} photo={rp} />)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 1024px) {
          .info-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
