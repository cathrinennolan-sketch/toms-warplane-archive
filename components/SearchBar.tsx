'use client';

import { useState, useEffect, useRef } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
}

export default function SearchBar({ 
  onSearch, 
  placeholder = "Search archive...", 
  defaultValue = "", 
  className = "" 
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    debounceTimer.current = setTimeout(() => {
      onSearch(val);
    }, 300);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className={`search-container ${className}`}>
      <div className="search-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
      
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
      />
      
      {query && (
        <button 
          className="search-clear" 
          onClick={handleClear}
          aria-label="Clear search"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}

      <style jsx>{`
        .search-container {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
          background-color: var(--surface);
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-full);
          padding: 8px 16px;
          box-shadow: var(--shadow-sm);
          transition: all var(--transition-fast);
        }
        .search-container:focus-within {
          border-color: var(--navy);
          box-shadow: 0 0 0 3px rgba(30, 58, 95, 0.1);
        }
        .search-icon {
          color: var(--text-muted);
          display: flex;
          align-items: center;
          margin-right: 12px;
        }
        .search-input {
          flex-grow: 1;
          border: none;
          background: transparent;
          font-family: var(--font-body);
          font-size: 1rem;
          color: var(--text);
          outline: none;
          padding: 4px 0;
        }
        .search-input::placeholder {
          color: var(--text-muted);
        }
        .search-clear {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 50%;
          transition: all var(--transition-fast);
        }
        .search-clear:hover {
          color: var(--text);
          background-color: var(--bg-alt);
        }
      `}</style>
    </div>
  );
}
