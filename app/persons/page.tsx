'use client';

import React, { useState, useEffect } from 'react';
import { getPersons } from '@/lib/firestore';
import { Person } from '@/lib/types';
import PersonCard from '@/components/PersonCard';

export default function PersonsPage() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [filters, setFilters] = useState({ branch: '', unit: '' });

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Mock query with filters/search
        const res = await getPersons({ ...filters, search });
        setPersons(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    const timeout = setTimeout(loadData, 300); // debounce
    return () => clearTimeout(timeout);
  }, [filters, search]);

  return (
    <div className="page-container" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="page-hero" style={{ backgroundColor: 'var(--navy)', color: 'var(--text-light)', padding: '60px 20px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', margin: '0 0 10px 0', fontSize: '2.5rem' }}>Historic Persons</h1>
        <p style={{ color: 'var(--border)', margin: 0 }}>Browse the profiles of brave airmen and personnel</p>
      </div>

      <div className="container" style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
        <div className="card" style={{ padding: '20px', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', marginBottom: '30px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Search by Name</label>
            <input 
              type="text" 
              placeholder="e.g. John Doe" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '4px' }}
            />
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Branch</label>
            <select 
              value={filters.branch} 
              onChange={(e) => setFilters(prev => ({ ...prev, branch: e.target.value }))}
              style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '4px' }}
            >
              <option value="">All Branches</option>
              <option value="USAAF">USAAF</option>
              <option value="RAF">RAF</option>
              <option value="USN">USN</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="person-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
            {[...Array(8)].map((_, i) => <div key={i} className="skeleton" style={{ height: '350px', backgroundColor: 'var(--bg-alt)' }} />)}
          </div>
        ) : persons.length === 0 ? (
          <div className="empty-state" style={{ textAlign: 'center', padding: '60px', backgroundColor: 'var(--surface)', border: '1px dashed var(--border)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)' }}>No personnel records found</h3>
            <p style={{ color: 'var(--text-muted)' }}>Adjust your search criteria to try again.</p>
          </div>
        ) : (
          <div className="person-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
            {persons.map(person => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
