import React from 'react';
import { FilterOption } from '../hooks/useBoardFilter';
import { Board } from '../types/board';

interface FilterBarProps {
  board: Board | null;
  activeFilter: FilterOption;
  selectedColumn: string | null;
  totalVisible: number;
  onFilterChange: (filter: FilterOption) => void;
  onColumnChange: (columnId: string | null) => void;
}

const FILTER_OPTIONS: { value: FilterOption; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'voted', label: 'Voted' },
  { value: 'unvoted', label: 'Unvoted' },
];

export function FilterBar({
  board,
  activeFilter,
  selectedColumn,
  totalVisible,
  onFilterChange,
  onColumnChange,
}: FilterBarProps) {
  if (!board) return null;

  return (
    <div className="filter-bar" role="toolbar" aria-label="Filter options">
      <div className="filter-bar__votes">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className={`filter-bar__btn${
              activeFilter === opt.value ? ' filter-bar__btn--active' : ''
            }`}
            onClick={() => onFilterChange(opt.value)}
            aria-pressed={activeFilter === opt.value}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="filter-bar__columns">
        <select
          value={selectedColumn ?? ''}
          onChange={(e) => onColumnChange(e.target.value || null)}
          aria-label="Filter by column"
        >
          <option value="">All columns</option>
          {board.columns.map((col) => (
            <option key={col.id} value={col.id}>
              {col.title}
            </option>
          ))}
        </select>
      </div>

      <span className="filter-bar__count" aria-live="polite">
        {totalVisible} card{totalVisible !== 1 ? 's' : ''}
      </span>
    </div>
  );
}
