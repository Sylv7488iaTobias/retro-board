import React, { useState, useRef } from 'react';

interface AddCardFormProps {
  columnId: string;
  onAdd: (columnId: string, text: string, author?: string) => void;
  placeholder?: string;
}

export function AddCardForm({ columnId, onAdd, placeholder }: AddCardFormProps) {
  const [text, setText] = useState('');
  const [expanded, setExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleOpen = () => {
    setExpanded(true);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(columnId, trimmed);
    setText('');
    setExpanded(false);
  };

  const handleCancel = () => {
    setText('');
    setExpanded(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!expanded) {
    return (
      <button
        onClick={handleOpen}
        aria-label="Add card"
        style={{
          width: '100%',
          padding: '8px',
          background: 'transparent',
          border: '1px dashed #aaa',
          borderRadius: '4px',
          cursor: 'pointer',
          color: '#666',
          marginTop: '8px',
        }}
      >
        + Add card
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '8px' }}>
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder ?? 'Enter card text…'}
        rows={3}
        aria-label="Card text"
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '6px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          resize: 'vertical',
          fontFamily: 'inherit',
          fontSize: '0.9rem',
        }}
      />
      <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
        <button type="submit" disabled={!text.trim()}>
          Add
        </button>
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
