import { useCallback } from 'react';
import { Board, Card } from '../types/board';
import {
  createCard,
  addCardToBoard,
  updateCardOnBoard,
  removeCardFromBoard,
} from '../utils/boardUtils';

export interface UseBoardCardsResult {
  addCard: (columnId: string, text: string, author?: string) => void;
  editCard: (columnId: string, cardId: string, text: string) => void;
  deleteCard: (columnId: string, cardId: string) => void;
  moveCard: (card: Card, fromColumnId: string, toColumnId: string) => void;
}

export function useBoardCards(
  board: Board,
  setBoard: (board: Board) => void
): UseBoardCardsResult {
  const addCard = useCallback(
    (columnId: string, text: string, author?: string) => {
      const card = createCard(text, author);
      const updated = addCardToBoard(board, columnId, card);
      setBoard(updated);
    },
    [board, setBoard]
  );

  const editCard = useCallback(
    (columnId: string, cardId: string, text: string) => {
      const updated = updateCardOnBoard(board, columnId, cardId, { text });
      setBoard(updated);
    },
    [board, setBoard]
  );

  const deleteCard = useCallback(
    (columnId: string, cardId: string) => {
      const updated = removeCardFromBoard(board, columnId, cardId);
      setBoard(updated);
    },
    [board, setBoard]
  );

  const moveCard = useCallback(
    (card: Card, fromColumnId: string, toColumnId: string) => {
      if (fromColumnId === toColumnId) return;
      let updated = removeCardFromBoard(board, fromColumnId, card.id);
      updated = addCardToBoard(updated, toColumnId, card);
      setBoard(updated);
    },
    [board, setBoard]
  );

  return { addCard, editCard, deleteCard, moveCard };
}
