'use client';

import { useState } from 'react';

interface FilterSidebarProps {
  filters: {
    yearMin?: number;
    yearMax?: number;
    unit?: string;
    planeType?: string;
    planeSerial?: string;
    pilotName?: string;
    tags?: string[];
  };
  unitOptions?: string[];
  serialOptions?: string[];
  planeTypeOptions?: string[];
  onFilterChange: (filters: any) => void;
  onClearAll: () => void;
  className?: string;
}

export default function FilterSidebar({
  filters,
  unitOptions = [],
  serialOptions = [],
  planeTypeOptions = [],
  onFilterChange,
  onClearAll,
  className = ''
}: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [localFilters, setLocalFilters] = useState(filters);

  // Auto-apply filters when local state changes
  const updateFilter = (key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    if (!value && value !== 0) {
      delete newFilters[key as keyof typeof newFilters];
    }
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const activeCount = Object.keys(localFilters).filter(k => {
    if (Array.isArray(localFilters[k as keyof typeof localFilters])) {
      return (localFilters[k as keyof typeof localFilters] as string[]).length > 0;
    }
    return localFilters[k as keyof typeof localFilters] !== undefined;
  }).length;

  return (
    <div className={`filter-sidebar ${className}`}>
      <div className="filter-header">
        <h3 className="filter-title">
          Filters {activeCount > 0 && <span className="badge badge-navy">{activeCount}</span>}
        </h3>
        
        {/* Mobile toggle */}
        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? 'Hide' : 'Show'}
        </button>
      </div>

      <div className={`filter-content ${isOpen ? 'open' : 'closed'}`}>
        {activeCount > 0 && (
          <button 
            className="btn btn-sm btn-ghost clear-btn"
            onClick={() => {
              setLocalFilters({});
              onClearAll();
            }}
          >
            Clear all filters
          </button>
        )}

        <div className="filter-section">
          <div className="filter-section-title">Year Range</div>
          <div className="year-inputs">
            <div className="form-group mb-0">
              <input 
                type="number" 
                className="form-input" 
                placeholder="Min" 
                value={localFilters.yearMin || ''}
                onChange={(e) => updateFilter('yearMin', e.target.value ? parseInt(e.target.value) : undefined)}
              />
            </div>
            <span>-</span>
            <div className="form-group mb-0">
              <input 
                type="number" 
                className="form-input" 
                placeholder="Max" 
                value={localFilters.yearMax || ''}
                onChange={(e) => updateFilter('yearMax', e.target.value ? parseInt(e.target.value) : undefined)}
              />
            </div>
          </div>
        </div>

        <div className="divider"></div>

        <div className="filter-section">
          <div className="filter-section-title">Plane Type</div>
          <div className="form-group mb-0">
            <input 
              type="text" 
              className="form-input" 
              list="plane-types"
              placeholder="e.g. B-17 Flying Fortress"
              value={localFilters.planeType || ''}
              onChange={(e) => updateFilter('planeType', e.target.value)}
            />
            <datalist id="plane-types">
              {planeTypeOptions.map(opt => <option key={opt} value={opt} />)}
            </datalist>
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-section-title">Plane Serial</div>
          <div className="form-group mb-0">
            <input 
              type="text" 
              className="form-input" 
              list="serials"
              placeholder="e.g. 42-31034"
              value={localFilters.planeSerial || ''}
              onChange={(e) => updateFilter('planeSerial', e.target.value)}
            />
            <datalist id="serials">
              {serialOptions.map(opt => <option key={opt} value={opt} />)}
            </datalist>
          </div>
        </div>

        <div className="divider"></div>

        <div className="filter-section">
          <div className="filter-section-title">Unit</div>
          <div className="form-group mb-0">
            <input 
              type="text" 
              className="form-input" 
              list="units"
              placeholder="e.g. 100th Bomb Group"
              value={localFilters.unit || ''}
              onChange={(e) => updateFilter('unit', e.target.value)}
            />
            <datalist id="units">
              {unitOptions.map(opt => <option key={opt} value={opt} />)}
            </datalist>
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-section-title">Pilot / Crew Name</div>
          <div className="form-group mb-0">
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search names..."
              value={localFilters.pilotName || ''}
              onChange={(e) => updateFilter('pilotName', e.target.value)}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .filter-sidebar {
          /* globals.css applies base styles */
        }
        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .filter-title {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .mobile-toggle {
          display: none;
          background: none;
          border: 1px solid var(--border);
          padding: 4px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
          cursor: pointer;
        }
        @media (max-width: 768px) {
          .mobile-toggle {
            display: block;
          }
          .filter-content.closed {
            display: none;
          }
        }
        .clear-btn {
          width: 100%;
          margin-bottom: 24px;
        }
        .mb-0 {
          margin-bottom: 0 !important;
        }
        .year-inputs {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .year-inputs > .form-group {
          flex: 1;
        }
      `}</style>
    </div>
  );
}
