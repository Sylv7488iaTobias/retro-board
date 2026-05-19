import { useState, useCallback } from 'react';
import { Board } from '../types/board';

interface UseBoardTitleReturn {
  title: string;
  isEditing: boolean;
  startEditing: () => void;
  handleChange: (value: string) => void;
  commitTitle: () => void;
  cancelEditing: () => void;
}

export function useBoardTitle(
  board: Board,
  onUpdate: (board: Board) => void
): UseBoardTitleReturn {
  const [title, setTitle] = useState<string>(board.title);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const startEditing = useCallback(() => {
    setTitle(board.title);
    setIsEditing(true);
  }, [board.title]);

  const handleChange = useCallback((value: string) => {
    setTitle(value);
  }, []);

  const commitTitle = useCallback(() => {
    const trimmed = title.trim();
    if (!trimmed) {
      setTitle(board.title);
      setIsEditing(false);
      return;
    }
    onUpdate({ ...board, title: trimmed, updatedAt: new Date().toISOString() });
    setIsEditing(false);
  }, [title, board, onUpdate]);

  const cancelEditing = useCallback(() => {
    setTitle(board.title);
    setIsEditing(false);
  }, [board.title]);

  return {
    title,
    isEditing,
    startEditing,
    handleChange,
    commitTitle,
    cancelEditing,
  };
}
