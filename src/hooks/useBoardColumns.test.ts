import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';
import { useBoardColumns } from './useBoardColumns';
import { createBoard } from '../utils/boardUtils';
import { Board } from '../types/board';

function useBoardWithColumns() {
  const [board, setBoard] = useState<Board>(() =>
    createBoard('Test Board', ['Went Well', 'To Improve'])
  );
  const actions = useBoardColumns(setBoard);
  return { board, ...actions };
}

describe('useBoardColumns', () => {
  it('adds a card to the specified column', () => {
    const { result } = renderHook(() => useBoardWithColumns());
    const columnId = result.current.board.columns[0].id;

    act(() => {
      result.current.addCard(columnId, 'Great teamwork', 'Alice');
    });

    const column = result.current.board.columns[0];
    expect(column.cards).toHaveLength(1);
    expect(column.cards[0].text).toBe('Great teamwork');
    expect(column.cards[0].author).toBe('Alice');
  });

  it('edits an existing card text', () => {
    const { result } = renderHook(() => useBoardWithColumns());
    const columnId = result.current.board.columns[0].id;

    act(() => {
      result.current.addCard(columnId, 'Original text');
    });

    const cardId = result.current.board.columns[0].cards[0].id;

    act(() => {
      result.current.editCard(columnId, cardId, 'Updated text');
    });

    expect(result.current.board.columns[0].cards[0].text).toBe('Updated text');
  });

  it('deletes a card from a column', () => {
    const { result } = renderHook(() => useBoardWithColumns());
    const columnId = result.current.board.columns[0].id;

    act(() => {
      result.current.addCard(columnId, 'To be deleted');
    });

    const cardId = result.current.board.columns[0].cards[0].id;

    act(() => {
      result.current.deleteCard(columnId, cardId);
    });

    expect(result.current.board.columns[0].cards).toHaveLength(0);
  });

  it('moves a card from one column to another', () => {
    const { result } = renderHook(() => useBoardWithColumns());
    const fromColumnId = result.current.board.columns[0].id;
    const toColumnId = result.current.board.columns[1].id;

    act(() => {
      result.current.addCard(fromColumnId, 'Move me');
    });

    const cardId = result.current.board.columns[0].cards[0].id;

    act(() => {
      result.current.moveCard(fromColumnId, toColumnId, cardId);
    });

    expect(result.current.board.columns[0].cards).toHaveLength(0);
    expect(result.current.board.columns[1].cards).toHaveLength(1);
    expect(result.current.board.columns[1].cards[0].text).toBe('Move me');
  });
});
