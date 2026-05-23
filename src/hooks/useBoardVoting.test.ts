import { renderHook, act } from '@testing-library/react';
import { useBoardVoting } from './useBoardVoting';
import { createBoard, createCard } from '../utils/boardUtils';
import { Board } from '../types/board';

function makeBoardWithCards(): Board {
  const board = createBoard('Voting Test Board', ['Went Well', 'To Improve']);
  const card1 = createCard('Great teamwork');
  const card2 = createCard('Slow deploys');
  board.columns[0].cards.push(card1);
  board.columns[1].cards.push(card2);
  return board;
}

describe('useBoardVoting', () => {
  it('upvotes a card incrementing votes by 1', () => {
    const board = makeBoardWithCards();
    const setBoard = jest.fn();
    const { result } = renderHook(() => useBoardVoting(board, setBoard));

    const colId = board.columns[0].id;
    const cardId = board.columns[0].cards[0].id;

    act(() => {
      result.current.upvoteCard(colId, cardId);
    });

    expect(setBoard).toHaveBeenCalledTimes(1);
    const updatedBoard: Board = setBoard.mock.calls[0][0];
    const updatedCard = updatedBoard.columns[0].cards[0];
    expect(updatedCard.votes).toBe(1);
  });

  it('downvotes a card but does not go below 0', () => {
    const board = makeBoardWithCards();
    const setBoard = jest.fn();
    const { result } = renderHook(() => useBoardVoting(board, setBoard));

    const colId = board.columns[1].id;
    const cardId = board.columns[1].cards[0].id;

    act(() => {
      result.current.downvoteCard(colId, cardId);
    });

    const updatedBoard: Board = setBoard.mock.calls[0][0];
    const updatedCard = updatedBoard.columns[1].cards[0];
    expect(updatedCard.votes).toBe(0);
  });

  it('getVoteCount returns 0 for a card with no votes', () => {
    const board = makeBoardWithCards();
    const setBoard = jest.fn();
    const { result } = renderHook(() => useBoardVoting(board, setBoard));

    const colId = board.columns[0].id;
    const cardId = board.columns[0].cards[0].id;

    expect(result.current.getVoteCount(colId, cardId)).toBe(0);
  });

  it('getVoteCount returns 0 for unknown column or card', () => {
    const board = makeBoardWithCards();
    const setBoard = jest.fn();
    const { result } = renderHook(() => useBoardVoting(board, setBoard));

    expect(result.current.getVoteCount('unknown-col', 'unknown-card')).toBe(0);
  });
});
