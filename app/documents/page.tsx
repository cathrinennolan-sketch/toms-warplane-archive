'use client';

import React, { useState, useEffect } from 'react';
import { getDocuments } from '@/lib/firestore';
import { ArchiveDocument } from '@/lib/types';
import DocumentCard from '@/components/DocumentCard';

const CATEGORIES = ['All', 'Manual', 'Orders', 'Certificate', 'Map', 'Letter', 'Other'];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<ArchiveDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchDocs() {
      setLoading(true);
      try {
        const res = await getDocuments({ 
          category: category === 'All' ? undefined : category,
          search 
        });
        setDocuments(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    const timeoutId = setTimeout(fetchDocs, 300);
    return () => clearTimeout(timeoutId);
  }, [category, search]);

  return (
    <div className="page-container" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="page-hero" style={{ backgroundColor: 'var(--navy)', color: 'var(--text-light)', padding: '60px 20px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', margin: '0 0 10px 0', fontSize: '2.5rem' }}>Historical Documents</h1>
        <p style={{ color: 'var(--border)', margin: 0 }}>Explore original manuals, maps, letters, and orders</p>
      </div>

      <div className="container" style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
        
        {/* Filters and Search */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '20px' }}>
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => setCategory(cat)}
                style={{ 
                  padding: '8px 16px', 
                  borderRadius: '20px', 
                  border: '1px solid var(--border)',
                  backgroundColor: category === cat ? 'var(--navy)' : 'var(--surface)',
                  color: category === cat ? 'var(--surface)' : 'var(--text)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <input 
            type="text" 
            placeholder="Search document titles..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', maxWidth: '400px', padding: '12px', border: '1px solid var(--border)', borderRadius: '4px' }}
          />
        </div>

        {/* Results */}
        {loading ? (
          <div className="doc-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: '200px', backgroundColor: 'var(--bg-alt)' }} />)}
          </div>
        ) : documents.length === 0 ? (
          <div className="empty-state" style={{ textAlign: 'center', padding: '60px', backgroundColor: 'var(--surface)', border: '1px dashed var(--border)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)' }}>No documents found</h3>
            <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search or category filters.</p>
          </div>
        ) : (
          <div className="doc-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {documents.map(doc => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
