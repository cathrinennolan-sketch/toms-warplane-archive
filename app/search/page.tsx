'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { searchAll } from '@/lib/firestore';
import { Photo, Person, ArchiveDocument } from '@/lib/types';
import PhotoCard from '@/components/PhotoCard';
import PersonCard from '@/components/PersonCard';
import DocumentCard from '@/components/DocumentCard';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<{ photos: Photo[], persons: Person[], documents: ArchiveDocument[] }>({ photos: [], persons: [], documents: [] });
  const [loading, setLoading] = useState(false);
  
  const [showPhotos, setShowPhotos] = useState(true);
  const [showPersons, setShowPersons] = useState(true);
  const [showDocs, setShowDocs] = useState(true);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setQuery('');
        router.push('/search');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [initialQuery]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const res = await searchAll(searchQuery);
      setResults(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(\`/search?q=\${encodeURIComponent(query)}\`);
  };

  const totalFound = (showPhotos ? results.photos.length : 0) + 
                     (showPersons ? results.persons.length : 0) + 
                     (showDocs ? results.documents.length : 0);

  return (
    <div className="page-container" style={{ backgroundColor: 'var(--bg)', minHeight: '100vh' }}>
      
      {/* Search Header */}
      <div style={{ backgroundColor: 'var(--navy)', padding: '60px 20px' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search across photos, personnel, and documents..."
              style={{ flex: 1, padding: '16px 20px', fontSize: '1.2rem', borderRadius: '4px', border: 'none', outline: 'none' }}
              autoFocus
            />
            <button type="submit" className="btn btn-primary" style={{ backgroundColor: 'var(--gold)', color: 'var(--navy)', border: 'none', padding: '0 30px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px' }}>
              Search
            </button>
          </form>

          <div style={{ display: 'flex', gap: '20px', marginTop: '20px', color: 'var(--text-light)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={showPhotos} onChange={(e) => setShowPhotos(e.target.checked)} /> 📷 Photos
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={showPersons} onChange={(e) => setShowPersons(e.target.checked)} /> 🧑 Persons
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={showDocs} onChange={(e) => setShowDocs(e.target.checked)} /> 📄 Documents
            </label>
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
        {loading ? (
          <div className="spinner" style={{ margin: '100px auto', textAlign: 'center' }}>Searching archives...</div>
        ) : initialQuery ? (
          <>
            <div style={{ marginBottom: '40px', fontSize: '1.2rem', color: 'var(--text-muted)' }}>
              Found {totalFound} results for <strong>"{initialQuery}"</strong>
            </div>

            {/* Photos Section */}
            {showPhotos && results.photos.length > 0 && (
              <div style={{ marginBottom: '60px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', borderBottom: '2px solid var(--border)', paddingBottom: '10px', marginBottom: '20px' }}>Photographs ({results.photos.length})</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                  {results.photos.map(p => <PhotoCard key={p.id} photo={p} />)}
                </div>
              </div>
            )}

            {/* Persons Section */}
            {showPersons && results.persons.length > 0 && (
              <div style={{ marginBottom: '60px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', borderBottom: '2px solid var(--border)', paddingBottom: '10px', marginBottom: '20px' }}>Personnel ({results.persons.length})</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                  {results.persons.map(p => <PersonCard key={p.id} person={p} />)}
                </div>
              </div>
            )}

            {/* Documents Section */}
            {showDocs && results.documents.length > 0 && (
              <div style={{ marginBottom: '60px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', borderBottom: '2px solid var(--border)', paddingBottom: '10px', marginBottom: '20px' }}>Documents ({results.documents.length})</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                  {results.documents.map(d => <DocumentCard key={d.id} document={d} />)}
                </div>
              </div>
            )}

            {totalFound === 0 && (
              <div className="empty-state" style={{ textAlign: 'center', padding: '60px', backgroundColor: 'var(--surface)', border: '1px dashed var(--border)' }}>
                <h3 style={{ fontFamily: 'var(--font-display)' }}>No records match your search</h3>
                <p style={{ color: 'var(--text-muted)' }}>Try using fewer keywords or check your spelling.</p>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
            Enter a search term above to begin exploring the archive.
          </div>
        )}
      </div>
    </div>
  );
}
