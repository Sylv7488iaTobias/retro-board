import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ColumnList } from './ColumnList';
import { createBoard } from '../utils/boardUtils';
import { Board } from '../types/board';

const defaultColumns = ['Went Well', 'To Improve', 'Action Items'];

function makeBoard(): Board {
  return createBoard('Test Board', defaultColumns);
}

describe('ColumnList', () => {
  it('renders all columns', () => {
    const board = makeBoard();
    render(<ColumnList board={board} onBoardChange={jest.fn()} />);
    defaultColumns.forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it('renders an Add Card button for each column', () => {
    const board = makeBoard();
    render(<ColumnList board={board} onBoardChange={jest.fn()} />);
    const addButtons = screen.getAllByText('+ Add Card');
    expect(addButtons).toHaveLength(defaultColumns.length);
  });

  it('calls onBoardChange when a card is added via prompt', () => {
    const board = makeBoard();
    const onBoardChange = jest.fn();
    window.prompt = jest.fn().mockReturnValue('New card text');
    render(<ColumnList board={board} onBoardChange={onBoardChange} />);
    const addButtons = screen.getAllByText('+ Add Card');
    fireEvent.click(addButtons[0]);
    expect(onBoardChange).toHaveBeenCalledTimes(1);
    const updatedBoard: Board = onBoardChange.mock.calls[0][0];
    expect(updatedBoard.columns[0].cards).toHaveLength(1);
    expect(updatedBoard.columns[0].cards[0].text).toBe('New card text');
  });

  it('does not call onBoardChange when prompt is cancelled', () => {
    const board = makeBoard();
    const onBoardChange = jest.fn();
    window.prompt = jest.fn().mockReturnValue(null);
    render(<ColumnList board={board} onBoardChange={onBoardChange} />);
    const addButtons = screen.getAllByText('+ Add Card');
    fireEvent.click(addButtons[0]);
    expect(onBoardChange).not.toHaveBeenCalled();
  });

  it('renders existing cards in columns', () => {
    const board = makeBoard();
    board.columns[0].cards.push({ id: 'c1', text: 'Great teamwork', votes: 0, createdAt: new Date().toISOString() });
    render(<ColumnList board={board} onBoardChange={jest.fn()} />);
    expect(screen.getByText('Great teamwork')).toBeInTheDocument();
  });
});
