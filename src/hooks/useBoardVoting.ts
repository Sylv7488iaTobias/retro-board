import { useCallback } from 'react';
import { Board, Card } from '../types/board';

export interface UseBoardVotingResult {
  upvoteCard: (columnId: string, cardId: string) => void;
  downvoteCard: (columnId: string, cardId: string) => void;
  getVoteCount: (columnId: string, cardId: string) => number;
}

export function useBoardVoting(
  board: Board,
  setBoard: (board: Board) => void
): UseBoardVotingResult {
  const updateCardVotes = useCallback(
    (columnId: string, cardId: string, delta: number) => {
      const updatedColumns = board.columns.map((col) => {
        if (col.id !== columnId) return col;
        const updatedCards = col.cards.map((card: Card) => {
          if (card.id !== cardId) return card;
          const currentVotes = card.votes ?? 0;
          const newVotes = Math.max(0, currentVotes + delta);
          return { ...card, votes: newVotes };
        });
        return { ...col, cards: updatedCards };
      });
      setBoard({ ...board, columns: updatedColumns });
    },
    [board, setBoard]
  );

  const upvoteCard = useCallback(
    (columnId: string, cardId: string) => {
      updateCardVotes(columnId, cardId, 1);
    },
    [updateCardVotes]
  );

  const downvoteCard = useCallback(
    (columnId: string, cardId: string) => {
      updateCardVotes(columnId, cardId, -1);
    },
    [updateCardVotes]
  );

  const getVoteCount = useCallback(
    (columnId: string, cardId: string): number => {
      const column = board.columns.find((col) => col.id === columnId);
      if (!column) return 0;
      const card = column.cards.find((c: Card) => c.id === cardId);
      return card?.votes ?? 0;
    },
    [board]
  );

  return { upvoteCard, downvoteCard, getVoteCount };
}
