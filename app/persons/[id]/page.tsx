'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPerson, getPhotos, getDocumentsByIds } from '@/lib/firestore';
import { Person, Photo, ArchiveDocument } from '@/lib/types';
import PhotoCard from '@/components/PhotoCard';
import DocumentCard from '@/components/DocumentCard';
import TagBadge from '@/components/TagBadge';

export default function PersonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [person, setPerson] = useState<Person | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [documents, setDocuments] = useState<ArchiveDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const p = await getPerson(id);
        if (!p) return;
        setPerson(p);
        
        const [ph, docs] = await Promise.all([
          p.relatedPhotoIds?.length ? getPhotos({ ids: p.relatedPhotoIds }) : Promise.resolve({ data: [] }),
          p.relatedDocIds?.length ? getDocumentsByIds(p.relatedDocIds) : Promise.resolve([])
        ]);
        
        setPhotos(ph.data || []);
        setDocuments(docs || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) return <div className="spinner" style={{ margin: '100px auto', textAlign: 'center' }}>Loading personnel record...</div>;
  if (!person) return <div className="empty-state" style={{ padding: '100px', textAlign: 'center' }}>Record not found.</div>;

  return (
    <div style={{ backgroundColor: 'var(--bg)', minHeight: '100vh', paddingBottom: '60px' }}>
      {/* Header Section */}
      <div style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '60px 20px' }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <button onClick={() => router.back()} style={{ position: 'absolute', top: '20px', left: '20px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--navy)', fontWeight: 'bold' }}>&larr; Back</button>
          
          {person.portraitUrl ? (
            <img 
              src={person.portraitUrl} 
              alt={person.fullName} 
              style={{ width: '200px', height: '200px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--bg-alt)' }} 
            />
          ) : (
            <div style={{ width: '200px', height: '200px', borderRadius: '50%', backgroundColor: 'var(--bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid var(--border)' }}>
              <span style={{ fontSize: '3rem', color: 'var(--text-muted)' }}>{person.fullName.charAt(0)}</span>
            </div>
          )}

          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', margin: '0 0 10px 0', color: 'var(--navy)' }}>{person.fullName}</h1>
            <div style={{ fontSize: '1.2rem', color: 'var(--text)', marginBottom: '15px' }}>
              {person.rank && <span style={{ fontWeight: 'bold' }}>{person.rank}</span>}
              {person.branch && <span> • {person.branch}</span>}
              {person.unit && <span> • {person.unit}</span>}
            </div>
            
            <div style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Lifespan: {person.birthYear || 'Unknown'} &ndash; {person.deathYear || 'Unknown'}
            </div>
            
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {person.tags?.map(tag => <TagBadge key={tag} tag={tag} />)}
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }} className="content-grid">
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', borderBottom: '2px solid var(--gold)', paddingBottom: '10px', display: 'inline-block' }}>Biography</h2>
            <div style={{ lineHeight: '1.8', fontSize: '1.1rem', marginTop: '20px' }} className="markdown-body">
              {person.biography ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {person.biography}
                </ReactMarkdown>
              ) : (
                <p style={{ color: 'var(--text-muted)' }}>No biographical information currently available for this record.</p>
              )}
            </div>
          </div>

          <div>
            {photos.length > 0 && (
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>Associated Photographs</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', marginTop: '15px' }}>
                  {photos.slice(0, 3).map(photo => <PhotoCard key={photo.id} photo={photo} />)}
                </div>
              </div>
            )}

            {documents.length > 0 && (
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>Associated Documents</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', marginTop: '15px' }}>
                  {documents.slice(0, 3).map(doc => <DocumentCard key={doc.id} document={doc} />)}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          .content-grid { grid-template-columns: 1fr !important; }
        }
        .markdown-body p { margin-bottom: 1em; }
        .markdown-body h1, .markdown-body h2, .markdown-body h3 { font-family: var(--font-display); margin-top: 1.5em; margin-bottom: 0.5em; }
      `}</style>
    </div>
  );
}
