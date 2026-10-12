'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getDocument, getPersonsByIds, getPhotos } from '@/lib/firestore';
import { ArchiveDocument, Person, Photo } from '@/lib/types';
import PersonCard from '@/components/PersonCard';
import PhotoCard from '@/components/PhotoCard';

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [document, setDocument] = useState<ArchiveDocument | null>(null);
  const [persons, setPersons] = useState<Person[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const doc = await getDocument(id);
        if (!doc) return;
        setDocument(doc);
        
        const [pers, phs] = await Promise.all([
          doc.relatedPersonIds?.length ? getPersonsByIds(doc.relatedPersonIds) : Promise.resolve([]),
          doc.relatedPhotoIds?.length ? getPhotos({ ids: doc.relatedPhotoIds }) : Promise.resolve({ data: [] })
        ]);
        
        setPersons(pers || []);
        setPhotos(phs.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) return <div className="spinner" style={{ margin: '100px auto', textAlign: 'center' }}>Loading historical document...</div>;
  if (!document) return <div className="empty-state" style={{ padding: '100px', textAlign: 'center' }}>Document not found.</div>;

  return (
    <div style={{ backgroundColor: 'var(--bg)', minHeight: '100vh', paddingBottom: '60px' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--navy)', fontWeight: 'bold', marginBottom: '20px' }}>&larr; Back to Documents</button>
        
        <div style={{ backgroundColor: 'var(--surface)', padding: '40px', border: '1px solid var(--border)', marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <span className="badge badge-navy" style={{ marginBottom: '10px', display: 'inline-block' }}>{document.category}</span>
              <h1 style={{ fontFamily: 'var(--font-display)', margin: '0 0 10px 0', color: 'var(--navy)', fontSize: '2.5rem' }}>{document.title}</h1>
              <div style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Year: {document.year || 'Unknown'}</div>
            </div>
            
            <a 
              href={document.fileUrl} 
              target="_blank" 
              rel="noreferrer"
              className="btn btn-primary"
              style={{ display: 'inline-flex', padding: '12px 24px', backgroundColor: 'var(--navy)', color: '#fff', textDecoration: 'none', borderRadius: '4px' }}
            >
              ⬇ Download Document
            </a>
          </div>

          <div style={{ marginTop: '30px', fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text)' }}>
            {document.description || 'No description provided.'}
          </div>
        </div>

        {/* PDF Viewer */}
        <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', height: '75vh', marginBottom: '40px' }}>
          {document.fileUrl.endsWith('.pdf') ? (
            <iframe 
              src={`${document.fileUrl}#toolbar=1`}
              width="100%" 
              height="100%" 
              style={{ border: 'none' }}
              title={document.title}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column' }}>
              <p>Preview not available for this file type.</p>
              <a href={document.fileUrl} className="btn btn-secondary" target="_blank" rel="noreferrer">Open File Directly</a>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }} className="related-grid">
          {persons.length > 0 && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>Related Persons</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                {persons.map(p => <PersonCard key={p.id} person={p} />)}
              </div>
            </div>
          )}
          
          {photos.length > 0 && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>Related Photographs</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
                {photos.map(p => <PhotoCard key={p.id} photo={p} />)}
              </div>
            </div>
          )}
        </div>

      </div>
      
      <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        &copy; Tom's Warplane Archive. All Rights Reserved.
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .related-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
