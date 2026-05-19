import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CardItem } from './CardItem';
import { Card } from '../types/board';

const mockCard: Card = {
  id: 'card-1',
  text: 'This is a test card',
  createdAt: new Date().toISOString(),
};

describe('CardItem', () => {
  const onUpdate = jest.fn();
  const onRemove = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders card text', () => {
    render(<CardItem card={mockCard} onUpdate={onUpdate} onRemove={onRemove} />);
    expect(screen.getByText('This is a test card')).toBeInTheDocument();
  });

  it('switches to edit mode on text click', () => {
    render(<CardItem card={mockCard} onUpdate={onUpdate} onRemove={onRemove} />);
    fireEvent.click(screen.getByText('This is a test card'));
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('calls onUpdate with new text on Enter key', () => {
    render(<CardItem card={mockCard} onUpdate={onUpdate} onRemove={onRemove} />);
    fireEvent.click(screen.getByText('This is a test card'));
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Updated text' } });
    fireEvent.keyDown(textarea, { key: 'Enter' });
    expect(onUpdate).toHaveBeenCalledWith('card-1', 'Updated text');
  });

  it('cancels edit on Escape key', () => {
    render(<CardItem card={mockCard} onUpdate={onUpdate} onRemove={onRemove} />);
    fireEvent.click(screen.getByText('This is a test card'));
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Changed text' } });
    fireEvent.keyDown(textarea, { key: 'Escape' });
    expect(onUpdate).not.toHaveBeenCalled();
    expect(screen.getByText('This is a test card')).toBeInTheDocument();
  });

  it('calls onRemove when remove button is clicked', () => {
    render(<CardItem card={mockCard} onUpdate={onUpdate} onRemove={onRemove} />);
    fireEvent.click(screen.getByLabelText('Remove card'));
    expect(onRemove).toHaveBeenCalledWith('card-1');
  });

  it('does not call onUpdate if text is unchanged', () => {
    render(<CardItem card={mockCard} onUpdate={onUpdate} onRemove={onRemove} />);
    fireEvent.click(screen.getByText('This is a test card'));
    const textarea = screen.getByRole('textbox');
    fireEvent.keyDown(textarea, { key: 'Enter' });
    expect(onUpdate).not.toHaveBeenCalled();
  });
});
