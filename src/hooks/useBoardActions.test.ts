import { renderHook, act } from '@testing-library/react';
import { useBoardActions } from './useBoardActions';
import * as useRealtimeBoardModule from './useRealtimeBoard';
import { createBoard, createCard, addCardToBoard } from '../utils/boardUtils';
import { Board } from '../types/board';

function makeBoardWithCard(): Board {
  const board = createBoard('Test Board');
  const card = createCard('Test card');
  return addCardToBoard(board, board.columns[0].id, card);
}

const mockUpdateBoard = jest.fn();

beforeEach(() => {
  mockUpdateBoard.mockReset();
});

function mockRealtime(board: Board) {
  jest.spyOn(useRealtimeBoardModule, 'useRealtimeBoard').mockReturnValue({
    board,
    updateBoard: mockUpdateBoard,
    isConnected: true,
  });
}

describe('useBoardActions', () => {
  it('returns board and isConnected from useRealtimeBoard', () => {
    const board = makeBoardWithCard();
    mockRealtime(board);
    const { result } = renderHook(() => useBoardActions(board.id));
    expect(result.current.board).toBe(board);
    expect(result.current.isConnected).toBe(true);
  });

  it('addCard calls updateBoard with new card', () => {
    const board = makeBoardWithCard();
    mockRealtime(board);
    const { result } = renderHook(() => useBoardActions(board.id));
    act(() => {
      result.current.addCard(board.columns[0].id, 'New card text');
    });
    expect(mockUpdateBoard).toHaveBeenCalledTimes(1);
    const updatedBoard: Board = mockUpdateBoard.mock.calls[0][0];
    const col = updatedBoard.columns.find(c => c.id === board.columns[0].id);
    expect(col?.cards.some(c => c.text === 'New card text')).toBe(true);
  });

  it('removeCard calls updateBoard without removed card', () => {
    const board = makeBoardWithCard();
    mockRealtime(board);
    const cardId = board.columns[0].cards[0].id;
    const { result } = renderHook(() => useBoardActions(board.id));
    act(() => {
      result.current.removeCard(board.columns[0].id, cardId);
    });
    expect(mockUpdateBoard).toHaveBeenCalledTimes(1);
    const updatedBoard: Board = mockUpdateBoard.mock.calls[0][0];
    const col = updatedBoard.columns.find(c => c.id === board.columns[0].id);
    expect(col?.cards.find(c => c.id === cardId)).toBeUndefined();
  });

  it('voteCard increments votes', () => {
    const board = makeBoardWithCard();
    mockRealtime(board);
    const cardId = board.columns[0].cards[0].id;
    const { result } = renderHook(() => useBoardActions(board.id));
    act(() => {
      result.current.voteCard(board.columns[0].id, cardId);
    });
    expect(mockUpdateBoard).toHaveBeenCalledTimes(1);
    const updatedBoard: Board = mockUpdateBoard.mock.calls[0][0];
    const col = updatedBoard.columns.find(c => c.id === board.columns[0].id);
    const card = col?.cards.find(c => c.id === cardId);
    expect(card?.votes).toBe(1);
  });

  it('setTitle updates board title', () => {
    const board = makeBoardWithCard();
    mockRealtime(board);
    const { result } = renderHook(() => useBoardActions(board.id));
    act(() => {
      result.current.setTitle('New Title');
    });
    expect(mockUpdateBoard).toHaveBeenCalledTimes(1);
    const updatedBoard: Board = mockUpdateBoard.mock.calls[0][0];
    expect(updatedBoard.title).toBe('New Title');
  });
});
