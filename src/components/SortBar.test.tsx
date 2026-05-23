import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SortBar } from './SortBar';
import { SortState } from '../hooks/useBoardSort';

const defaultSort: SortState = { field: 'createdAt', direction: 'desc' };

describe('SortBar', () => {
  it('renders all sort field buttons', () => {
    render(
      <SortBar sortState={defaultSort} onSortField={jest.fn()} onToggleDirection={jest.fn()} />
    );
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Votes')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
  });

  it('marks active field button as pressed', () => {
    render(
      <SortBar sortState={defaultSort} onSortField={jest.fn()} onToggleDirection={jest.fn()} />
    );
    const dateBtn = screen.getByText('Date').closest('button');
    expect(dateBtn).toHaveAttribute('aria-pressed', 'true');
    const votesBtn = screen.getByText('Votes').closest('button');
    expect(votesBtn).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onSortField with correct field when button clicked', () => {
    const onSortField = jest.fn();
    render(
      <SortBar sortState={defaultSort} onSortField={onSortField} onToggleDirection={jest.fn()} />
    );
    fireEvent.click(screen.getByText('Votes'));
    expect(onSortField).toHaveBeenCalledWith('votes');
  });

  it('calls onToggleDirection when toggle button clicked', () => {
    const onToggleDirection = jest.fn();
    render(
      <SortBar sortState={defaultSort} onSortField={jest.fn()} onToggleDirection={onToggleDirection} />
    );
    fireEvent.click(screen.getByLabelText('Toggle sort direction'));
    expect(onToggleDirection).toHaveBeenCalled();
  });

  it('shows direction indicator on active field', () => {
    render(
      <SortBar sortState={defaultSort} onSortField={jest.fn()} onToggleDirection={jest.fn()} />
    );
    expect(screen.getByLabelText('desc')).toBeInTheDocument();
  });

  it('shows asc indicator when direction is asc', () => {
    const ascSort: SortState = { field: 'votes', direction: 'asc' };
    render(
      <SortBar sortState={ascSort} onSortField={jest.fn()} onToggleDirection={jest.fn()} />
    );
    expect(screen.getByLabelText('asc')).toBeInTheDocument();
  });
});
