import { useCallback } from 'react';
import { Board, Card } from '../types/board';
import { useRealtimeBoard } from './useRealtimeBoard';
import { useBoardCards } from './useBoardCards';
import { useBoardVoting } from './useBoardVoting';
import { useBoardTitle } from './useBoardTitle';
import { useBoardColumns } from './useBoardColumns';

export interface UseBoardActionsResult {
  board: Board | null;
  title: string;
  isConnected: boolean;
  addCard: (columnId: string, text: string) => void;
  updateCard: (columnId: string, cardId: string, text: string) => void;
  removeCard: (columnId: string, cardId: string) => void;
  voteCard: (columnId: string, cardId: string) => void;
  setTitle: (title: string) => void;
  addColumn: (name: string) => void;
  removeColumn: (columnId: string) => void;
}

export function useBoardActions(boardId: string): UseBoardActionsResult {
  const { board, updateBoard, isConnected } = useRealtimeBoard(boardId);
  const { addCard, updateCard, removeCard } = useBoardCards(board, updateBoard);
  const { voteCard } = useBoardVoting(board, updateBoard);
  const { title, setTitle } = useBoardTitle(board, updateBoard);
  const { addColumn, removeColumn } = useBoardColumns(board, updateBoard);

  const handleAddCard = useCallback(
    (columnId: string, text: string) => {
      addCard(columnId, text);
    },
    [addCard]
  );

  const handleUpdateCard = useCallback(
    (columnId: string, cardId: string, text: string) => {
      updateCard(columnId, cardId, text);
    },
    [updateCard]
  );

  const handleRemoveCard = useCallback(
    (columnId: string, cardId: string) => {
      removeCard(columnId, cardId);
    },
    [removeCard]
  );

  const handleVoteCard = useCallback(
    (columnId: string, cardId: string) => {
      voteCard(columnId, cardId);
    },
    [voteCard]
  );

  return {
    board,
    title,
    isConnected,
    addCard: handleAddCard,
    updateCard: handleUpdateCard,
    removeCard: handleRemoveCard,
    voteCard: handleVoteCard,
    setTitle,
    addColumn,
    removeColumn,
  };
}
