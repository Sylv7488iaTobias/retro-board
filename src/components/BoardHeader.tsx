import React, { useState } from 'react';
import { Board } from '../types/board';
import { ExportButton } from './ExportButton';

interface BoardHeaderProps {
  board: Board;
  onRename: (newTitle: string) => void;
}

export const BoardHeader: React.FC<BoardHeaderProps> = ({ board, onRename }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(board.title);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = draft.trim();
    if (trimmed && trimmed !== board.title) {
      onRename(trimmed);
    }
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setDraft(board.title);
      setEditing(false);
    }
  };

  return (
    <header className="board-header">
      <div className="board-header__title">
        {editing ? (
          <form onSubmit={handleSubmit}>
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={handleSubmit}
              onKeyDown={handleKeyDown}
              className="board-header__input"
              aria-label="Board title"
            />
          </form>
        ) : (
          <h1
            onClick={() => setEditing(true)}
            title="Click to rename"
            className="board-header__heading"
          >
            {board.title}
          </h1>
        )}
      </div>
      <div className="board-header__actions">
        <span className="board-header__id" title="Board ID">
          #{board.id.slice(0, 8)}
        </span>
        <ExportButton board={board} />
      </div>
    </header>
  );
};

export default BoardHeader;
