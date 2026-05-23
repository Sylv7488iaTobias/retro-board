import { useState, useMemo, useCallback } from 'react';
import { Board, Card } from '../types/board';

export interface SearchResult {
  card: Card;
  columnId: string;
  columnTitle: string;
}

export interface UseBoardSearchReturn {
  query: string;
  setQuery: (q: string) => void;
  results: SearchResult[];
  clearSearch: () => void;
  hasQuery: boolean;
}

export function useBoardSearch(board: Board | null): UseBoardSearchReturn {
  const [query, setQuery] = useState('');

  const results = useMemo<SearchResult[]>(() => {
    if (!board || !query.trim()) return [];
    const lower = query.toLowerCase();

    const found: SearchResult[] = [];
    for (const column of board.columns) {
      for (const card of column.cards) {
        if (
          card.text.toLowerCase().includes(lower) ||
          (card.author && card.author.toLowerCase().includes(lower))
        ) {
          found.push({
            card,
            columnId: column.id,
            columnTitle: column.title,
          });
        }
      }
    }
    return found;
  }, [board, query]);

  const clearSearch = useCallback(() => setQuery(''), []);

  return {
    query,
    setQuery,
    results,
    clearSearch,
    hasQuery: query.trim().length > 0,
  };
}
