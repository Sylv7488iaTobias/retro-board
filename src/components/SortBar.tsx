import React from 'react';
import { SortField, SortState } from '../hooks/useBoardSort';

interface SortBarProps {
  sortState: SortState;
  onSortField: (field: SortField) => void;
  onToggleDirection: () => void;
}

const SORT_FIELDS: { label: string; value: SortField }[] = [
  { label: 'Date', value: 'createdAt' },
  { label: 'Votes', value: 'votes' },
  { label: 'Text', value: 'text' },
];

export const SortBar: React.FC<SortBarProps> = ({
  sortState,
  onSortField,
  onToggleDirection,
}) => {
  return (
    <div className="sort-bar" role="toolbar" aria-label="Sort cards">
      <span className="sort-bar__label">Sort by:</span>
      {SORT_FIELDS.map(({ label, value }) => (
        <button
          key={value}
          className={`sort-bar__btn${sortState.field === value ? ' sort-bar__btn--active' : ''}`}
          onClick={() => onSortField(value)}
          aria-pressed={sortState.field === value}
        >
          {label}
          {sortState.field === value && (
            <span className="sort-bar__direction" aria-label={sortState.direction}>
              {sortState.direction === 'asc' ? ' ↑' : ' ↓'}
            </span>
          )}
        </button>
      ))}
      <button
        className="sort-bar__toggle"
        onClick={onToggleDirection}
        aria-label="Toggle sort direction"
      >
        {sortState.direction === 'asc' ? '↑ Asc' : '↓ Desc'}
      </button>
    </div>
  );
};

export default SortBar;
