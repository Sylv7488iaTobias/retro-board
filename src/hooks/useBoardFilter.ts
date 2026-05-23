import { useMemo, useState } from 'react';
import { Board, Card } from '../types/board';

export type FilterOption = 'all' | 'voted' | 'unvoted';

export interface FilteredBoard extends Board {
  filteredColumns: Array<{
    id: string;
    title: string;
    cards: Card[];
  }>;
}

export function useBoardFilter(board: Board | null) {
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);

  const filteredBoard = useMemo<FilteredBoard | null>(() => {
    if (!board) return null;

    const filteredColumns = board.columns
      .filter((col) => selectedColumn === null || col.id === selectedColumn)
      .map((col) => ({
        ...col,
        cards: col.cards.filter((card) => {
          if (activeFilter === 'voted') return card.votes > 0;
          if (activeFilter === 'unvoted') return card.votes === 0;
          return true;
        }),
      }));

    return {
      ...board,
      filteredColumns,
    };
  }, [board, activeFilter, selectedColumn]);

  const totalVisible = useMemo(() => {
    if (!filteredBoard) return 0;
    return filteredBoard.filteredColumns.reduce(
      (sum, col) => sum + col.cards.length,
      0
    );
  }, [filteredBoard]);

  return {
    activeFilter,
    setActiveFilter,
    selectedColumn,
    setSelectedColumn,
    filteredBoard,
    totalVisible,
  };
}
