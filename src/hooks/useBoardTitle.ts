import { useCallback } from 'react';
import { Board } from '../types/board';

export interface UseBoardTitleResult {
  renameBoard: (board: Board, newTitle: string) => Board;
}

/**
 * Hook that provides a pure helper to rename a board,
 * returning a new Board object with an updated title and updatedAt timestamp.
 * Consumers are responsible for persisting the returned board.
 */
export function useBoardTitle(): UseBoardTitleResult {
  const renameBoard = useCallback((board: Board, newTitle: string): Board => {
    const trimmed = newTitle.trim();
    if (!trimmed) {
      throw new Error('Board title must not be empty.');
    }
    return {
      ...board,
      title: trimmed,
      updatedAt: new Date().toISOString(),
    };
  }, []);

  return { renameBoard };
}

export default useBoardTitle;
