import React, { useState } from 'react';
import { Card } from '../types/board';

interface CardItemProps {
  card: Card;
  onUpdate: (cardId: string, text: string) => void;
  onRemove: (cardId: string) => void;
}

export const CardItem: React.FC<CardItemProps> = ({ card, onUpdate, onRemove }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(card.text);

  const handleSave = () => {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== card.text) {
      onUpdate(card.id, trimmed);
    } else {
      setEditText(card.text);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      setEditText(card.text);
      setIsEditing(false);
    }
  };

  return (
    <div className="card-item" data-testid={`card-${card.id}`}>
      {isEditing ? (
        <textarea
          autoFocus
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="card-edit-input"
          rows={3}
        />
      ) : (
        <p
          className="card-text"
          onClick={() => setIsEditing(true)}
          title="Click to edit"
        >
          {card.text}
        </p>
      )}
      <button
        className="card-remove-btn"
        onClick={() => onRemove(card.id)}
        aria-label="Remove card"
        title="Remove card"
      >
        ✕
      </button>
    </div>
  );
};

export default CardItem;
