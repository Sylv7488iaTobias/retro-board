import { useState, useCallback } from 'react';
import { Board } from '../types/board';
import {
  saveBoardToStorage,
  loadBoardFromStorage,
  listBoardIdsFromStorage,
  removeBoardFromStorage,
} from '../utils/boardStorage';

interface UseBoardStorageReturn {
  savedIds: string[];
  saveBoard: (board: Board) => void;
  loadBoard: (id: string) => Board | null;
  deleteBoard: (id: string) => void;
  refreshIds: () => void;
  clearError: () => void;
  error: string | null;
}

export function useBoardStorage(): UseBoardStorageReturn {
  const [savedIds, setSavedIds] = useState<string[]>(() =>
    listBoardIdsFromStorage()
  );
  const [error, setError] = useState<string | null>(null);

  const refreshIds = useCallback(() => {
    setSavedIds(listBoardIdsFromStorage());
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const saveBoard = useCallback((board: Board) => {
    try {
      saveBoardToStorage(board);
      setError(null);
      refreshIds();
    } catch {
      setError('Failed to save board. Storage may be full.');
    }
  }, [refreshIds]);

  const loadBoard = useCallback((id: string): Board | null => {
    const board = loadBoardFromStorage(id);
    if (!board) {
      setError(`Board "${id}" not found in storage.`);
    } else {
      setError(null);
    }
    return board;
  }, []);

  const deleteBoard = useCallback((id: string) => {
    try {
      removeBoardFromStorage(id);
      setError(null);
      refreshIds();
    } catch {
      setError(`Failed to delete board "${id}".`);
    }
  }, [refreshIds]);

  return { savedIds, saveBoard, loadBoard, deleteBoard, refreshIds, clearError, error };
}
