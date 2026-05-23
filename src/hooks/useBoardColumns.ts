import { useState, useCallback } from 'react';
import { Board, Column } from '../types/board';
import { addCardToBoard, removeCardFromBoard, updateCardOnBoard } from '../utils/boardUtils';

type SetBoard = React.Dispatch<React.SetStateAction<Board>>;

export interface UseBoardColumnsResult {
  addCard: (columnId: string, text: string, author?: string) => void;
  editCard: (columnId: string, cardId: string, text: string) => void;
  deleteCard: (columnId: string, cardId: string) => void;
  moveCard: (fromColumnId: string, toColumnId: string, cardId: string) => void;
}

export function useBoardColumns(setBoard: SetBoard): UseBoardColumnsResult {
  const addCard = useCallback(
    (columnId: string, text: string, author?: string) => {
      setBoard((prev) => addCardToBoard(prev, columnId, text, author));
    },
    [setBoard]
  );

  const editCard = useCallback(
    (columnId: string, cardId: string, text: string) => {
      setBoard((prev) => updateCardOnBoard(prev, columnId, cardId, { text }));
    },
    [setBoard]
  );

  const deleteCard = useCallback(
    (columnId: string, cardId: string) => {
      setBoard((prev) => removeCardFromBoard(prev, columnId, cardId));
    },
    [setBoard]
  );

  const moveCard = useCallback(
    (fromColumnId: string, toColumnId: string, cardId: string) => {
      setBoard((prev) => {
        const fromColumn = prev.columns.find((c) => c.id === fromColumnId);
        if (!fromColumn) return prev;
        const card = fromColumn.cards.find((c) => c.id === cardId);
        if (!card) return prev;
        const afterRemove = removeCardFromBoard(prev, fromColumnId, cardId);
        const toColumn = afterRemove.columns.find((c) => c.id === toColumnId);
        if (!toColumn) return prev;
        return {
          ...afterRemove,
          columns: afterRemove.columns.map((col) =>
            col.id === toColumnId
              ? { ...col, cards: [...col.cards, card] }
              : col
          ),
          updatedAt: new Date().toISOString(),
        };
      });
    },
    [setBoard]
  );

  return { addCard, editCard, deleteCard, moveCard };
}
