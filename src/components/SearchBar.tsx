import React from 'react';
import { UseBoardSearchReturn } from '../hooks/useBoardSearch';

interface SearchBarProps {
  search: UseBoardSearchReturn;
}

export function SearchBar({ search }: SearchBarProps) {
  const { query, setQuery, results, clearSearch, hasQuery } = search;

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search cards…"
        aria-label="Search cards"
        style={{
          padding: '0.4rem 0.75rem',
          borderRadius: '6px',
          border: '1px solid #ccc',
          fontSize: '0.9rem',
          width: '220px',
        }}
      />
      {hasQuery && (
        <button
          onClick={clearSearch}
          aria-label="Clear search"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            color: '#888',
            padding: '0 0.25rem',
          }}
        >
          ✕
        </button>
      )}
      {hasQuery && (
        <span
          aria-live="polite"
          style={{ fontSize: '0.8rem', color: '#555', whiteSpace: 'nowrap' }}
        >
          {results.length === 0
            ? 'No results'
            : `${results.length} result${results.length !== 1 ? 's' : ''}`}
        </span>
      )}
    </div>
  );
}
