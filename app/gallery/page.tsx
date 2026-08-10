'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { getPhotos, getAllUnits, getAllSerials, getAllPlaneTypes } from '@/lib/firestore';
import { Photo } from '@/lib/types';
import PhotoCard from '@/components/PhotoCard';

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const [units, setUnits] = useState<string[]>([]);
  const [serials, setSerials] = useState<string[]>([]);
  const [planeTypes, setPlaneTypes] = useState<string[]>([]);
  
  const [filters, setFilters] = useState({ unit: '', serial: '', type: '', sort: 'newest' });
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    async function loadMetadata() {
      const [u, s, p] = await Promise.all([getAllUnits(), getAllSerials(), getAllPlaneTypes()]);
      setUnits(u); setSerials(s); setPlaneTypes(p);
    }
    loadMetadata();
  }, []);

  const loadPhotos = useCallback(async (isLoadMore = false) => {
    try {
      if (isLoadMore) setLoadingMore(true);
      else setLoading(true);
      
      // Simulate API call with filters
      const response = await getPhotos({ ...filters, limit: 24, cursor: isLoadMore ? lastDoc : null });
      
      if (isLoadMore) {
        setPhotos(prev => [...prev, ...response.data]);
      } else {
        setPhotos(response.data);
      }
      setLastDoc(response.lastDoc);
      setHasMore(response.hasMore);
      if (!isLoadMore) setTotalCount(response.totalCount || 0);
    } catch (error) {
      console.error('Failed to load photos:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filters, lastDoc]);

  useEffect(() => {
    loadPhotos();
  }, [filters]); // Reload when filters change

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="page-container">
      <div className="page-hero" style={{ backgroundColor: 'var(--navy)', color: 'var(--text-light)', padding: '60px 20px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', margin: '0 0 10px 0', fontSize: '2.5rem' }}>Photograph Gallery</h1>
        <p style={{ color: 'var(--border)', margin: 0 }}>Browse {totalCount > 0 ? totalCount : 'our collection of'} historical photographs</p>
      </div>
      
      <div className="container" style={{ display: 'flex', gap: '30px', margin: '40px auto', padding: '0 20px' }}>
        <aside className="filter-sidebar" style={{ width: '280px', flexShrink: 0, position: 'sticky', top: '20px', height: 'fit-content' }}>
          <div className="card" style={{ padding: '20px', backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
            <h3 style={{ marginTop: 0, borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>Filters</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Unit</label>
              <select value={filters.unit} onChange={(e) => handleFilterChange('unit', e.target.value)} style={{ width: '100%', padding: '8px' }}>
                <option value="">All Units</option>
                {units.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Plane Type</label>
              <select value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)} style={{ width: '100%', padding: '8px' }}>
                <option value="">All Types</option>
                {planeTypes.map(pt => <option key={pt} value={pt}>{pt}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Serial Number</label>
              <select value={filters.serial} onChange={(e) => handleFilterChange('serial', e.target.value)} style={{ width: '100%', padding: '8px' }}>
                <option value="">All Serials</option>
                {serials.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Sort By</label>
              <select value={filters.sort} onChange={(e) => handleFilterChange('sort', e.target.value)} style={{ width: '100%', padding: '8px' }}>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest Date</option>
                <option value="az">A-Z Title</option>
              </select>
            </div>
            
            <button className="btn btn-secondary" onClick={() => setFilters({ unit: '', serial: '', type: '', sort: 'newest' })} style={{ width: '100%' }}>Clear Filters</button>
          </div>
        </aside>

        <main style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ color: 'var(--text-muted)' }}>
              Showing {photos.length} of {totalCount} photographs
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {Object.entries(filters).filter(([k,v]) => v && k !== 'sort').map(([k,v]) => (
                <span key={k} className="badge badge-navy" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  {v} <button onClick={() => handleFilterChange(k, '')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}>×</button>
                </span>
              ))}
            </div>
          </div>

          {loading && !loadingMore ? (
            <div className="photo-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: '300px', backgroundColor: 'var(--bg-alt)' }} />)}
            </div>
          ) : photos.length === 0 ? (
            <div className="empty-state" style={{ textAlign: 'center', padding: '60px', backgroundColor: 'var(--surface)', border: '1px dashed var(--border)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)' }}>No photographs found</h3>
              <p style={{ color: 'var(--text-muted)' }}>Try adjusting your filters to see more results.</p>
            </div>
          ) : (
            <>
              <div className="photo-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {photos.map(photo => (
                  <PhotoCard key={photo.id} photo={photo} />
                ))}
              </div>
              
              {hasMore && (
                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                  <button className="btn btn-primary" onClick={() => loadPhotos(true)} disabled={loadingMore} style={{ padding: '12px 30px', cursor: loadingMore ? 'not-allowed' : 'pointer' }}>
                    {loadingMore ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          .container { flex-direction: column; }
          .filter-sidebar { width: 100%; position: static; }
        }
      `}</style>
    </div>
  );
}
