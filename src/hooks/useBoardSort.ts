import { useState, useCallback, useMemo } from 'react';
import { Board, Card } from '../types/board';

export type SortField = 'votes' | 'createdAt' | 'text';
export type SortDirection = 'asc' | 'desc';

export interface SortState {
  field: SortField;
  direction: SortDirection;
}

export interface UseBoardSortResult {
  sortState: SortState;
  setSortField: (field: SortField) => void;
  toggleSortDirection: () => void;
  sortCards: (cards: Card[]) => Card[];
  sortedBoard: Board | null;
}

export function useBoardSort(board: Board | null): UseBoardSortResult {
  const [sortState, setSortState] = useState<SortState>({
    field: 'createdAt',
    direction: 'desc',
  });

  const setSortField = useCallback((field: SortField) => {
    setSortState(prev =>
      prev.field === field
        ? { ...prev, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { field, direction: 'desc' }
    );
  }, []);

  const toggleSortDirection = useCallback(() => {
    setSortState(prev => ({
      ...prev,
      direction: prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const sortCards = useCallback(
    (cards: Card[]): Card[] => {
      const sorted = [...cards].sort((a, b) => {
        let cmp = 0;
        if (sortState.field === 'votes') {
          cmp = (a.votes ?? 0) - (b.votes ?? 0);
        } else if (sortState.field === 'createdAt') {
          cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        } else if (sortState.field === 'text') {
          cmp = a.text.localeCompare(b.text);
        }
        return sortState.direction === 'asc' ? cmp : -cmp;
      });
      return sorted;
    },
    [sortState]
  );

  const sortedBoard = useMemo((): Board | null => {
    if (!board) return null;
    return {
      ...board,
      columns: board.columns.map(col => ({
        ...col,
        cards: sortCards(col.cards),
      })),
    };
  }, [board, sortCards]);

  return { sortState, setSortField, toggleSortDirection, sortCards, sortedBoard };
}
