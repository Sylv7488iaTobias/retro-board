import { renderHook, act } from '@testing-library/react';
import { useBoardCards } from './useBoardCards';
import { createBoard } from '../utils/boardUtils';
import { Board } from '../types/board';

function makeBoardWithColumns(): Board {
  return createBoard('Test Board', ['col-1', 'col-2']);
}

describe('useBoardCards', () => {
  it('adds a card to the specified column', () => {
    const initial = makeBoardWithColumns();
    const setBoard = jest.fn();
    const { result } = renderHook(() => useBoardCards(initial, setBoard));

    act(() => {
      result.current.addCard('col-1', 'My card text', 'Alice');
    });

    expect(setBoard).toHaveBeenCalledTimes(1);
    const updated: Board = setBoard.mock.calls[0][0];
    const col = updated.columns.find((c) => c.id === 'col-1')!;
    expect(col.cards).toHaveLength(1);
    expect(col.cards[0].text).toBe('My card text');
    expect(col.cards[0].author).toBe('Alice');
  });

  it('edits a card text', () => {
    let board = makeBoardWithColumns();
    const setBoard = jest.fn((b: Board) => { board = b; });
    const { result, rerender } = renderHook(() => useBoardCards(board, setBoard));

    act(() => { result.current.addCard('col-1', 'Original'); });
    rerender();
    const cardId = board.columns.find((c) => c.id === 'col-1')!.cards[0].id;

    act(() => { result.current.editCard('col-1', cardId, 'Updated'); });
    rerender();

    const col = board.columns.find((c) => c.id === 'col-1')!;
    expect(col.cards[0].text).toBe('Updated');
  });

  it('deletes a card from a column', () => {
    let board = makeBoardWithColumns();
    const setBoard = jest.fn((b: Board) => { board = b; });
    const { result, rerender } = renderHook(() => useBoardCards(board, setBoard));

    act(() => { result.current.addCard('col-1', 'To delete'); });
    rerender();
    const cardId = board.columns.find((c) => c.id === 'col-1')!.cards[0].id;

    act(() => { result.current.deleteCard('col-1', cardId); });
    rerender();

    const col = board.columns.find((c) => c.id === 'col-1')!;
    expect(col.cards).toHaveLength(0);
  });

  it('moves a card between columns', () => {
    let board = makeBoardWithColumns();
    const setBoard = jest.fn((b: Board) => { board = b; });
    const { result, rerender } = renderHook(() => useBoardCards(board, setBoard));

    act(() => { result.current.addCard('col-1', 'Move me'); });
    rerender();
    const card = board.columns.find((c) => c.id === 'col-1')!.cards[0];

    act(() => { result.current.moveCard(card, 'col-1', 'col-2'); });
    rerender();

    expect(board.columns.find((c) => c.id === 'col-1')!.cards).toHaveLength(0);
    expect(board.columns.find((c) => c.id === 'col-2')!.cards).toHaveLength(1);
    expect(board.columns.find((c) => c.id === 'col-2')!.cards[0].text).toBe('Move me');
  });

  it('does nothing when moving a card to the same column', () => {
    let board = makeBoardWithColumns();
    const setBoard = jest.fn((b: Board) => { board = b; });
    const { result, rerender } = renderHook(() => useBoardCards(board, setBoard));

    act(() => { result.current.addCard('col-1', 'Stay here'); });
    rerender();
    const callsBefore = setBoard.mock.calls.length;
    const card = board.columns.find((c) => c.id === 'col-1')!.cards[0];

    act(() => { result.current.moveCard(card, 'col-1', 'col-1'); });

    expect(setBoard.mock.calls.length).toBe(callsBefore);
  });
});
