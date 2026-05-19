import React from 'react';
import { Board } from '../types/board';
import { ColumnList } from './ColumnList';
import { ExportButton } from './ExportButton';

interface BoardViewProps {
  board: Board;
  onBoardChange: (board: Board) => void;
}

export const BoardView: React.FC<BoardViewProps> = ({ board, onBoardChange }) => {
  const formattedDate = new Date(board.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="board-view" style={{ padding: 16 }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>{board.title}</h1>
          <small style={{ color: '#888' }}>Created {formattedDate}</small>
        </div>
        <ExportButton board={board} />
      </header>
      <ColumnList board={board} onBoardChange={onBoardChange} />
    </div>
  );
};

export default BoardView;
