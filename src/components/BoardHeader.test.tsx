import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BoardHeader } from './BoardHeader';
import { createBoard } from '../utils/boardUtils';

const mockBoard = createBoard('Sprint Retro');

describe('BoardHeader', () => {
  it('renders the board title', () => {
    render(<BoardHeader board={mockBoard} onRename={jest.fn()} />);
    expect(screen.getByText('Sprint Retro')).toBeInTheDocument();
  });

  it('shows a truncated board id', () => {
    render(<BoardHeader board={mockBoard} onRename={jest.fn()} />);
    expect(screen.getByTitle('Board ID').textContent).toContain('#');
  });

  it('switches to edit mode on title click', () => {
    render(<BoardHeader board={mockBoard} onRename={jest.fn()} />);
    fireEvent.click(screen.getByTitle('Click to rename'));
    expect(screen.getByRole('textbox', { name: /board title/i })).toBeInTheDocument();
  });

  it('calls onRename with new title on submit', () => {
    const onRename = jest.fn();
    render(<BoardHeader board={mockBoard} onRename={onRename} />);
    fireEvent.click(screen.getByTitle('Click to rename'));
    const input = screen.getByRole('textbox', { name: /board title/i });
    fireEvent.change(input, { target: { value: 'New Title' } });
    fireEvent.submit(input.closest('form')!);
    expect(onRename).toHaveBeenCalledWith('New Title');
  });

  it('does not call onRename if title is unchanged', () => {
    const onRename = jest.fn();
    render(<BoardHeader board={mockBoard} onRename={onRename} />);
    fireEvent.click(screen.getByTitle('Click to rename'));
    const input = screen.getByRole('textbox', { name: /board title/i });
    fireEvent.submit(input.closest('form')!);
    expect(onRename).not.toHaveBeenCalled();
  });

  it('cancels edit on Escape key', () => {
    render(<BoardHeader board={mockBoard} onRename={jest.fn()} />);
    fireEvent.click(screen.getByTitle('Click to rename'));
    const input = screen.getByRole('textbox', { name: /board title/i });
    fireEvent.change(input, { target: { value: 'Changed' } });
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.getByText('Sprint Retro')).toBeInTheDocument();
  });
});
