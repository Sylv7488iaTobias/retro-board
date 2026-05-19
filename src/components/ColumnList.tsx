import React from 'react';
import { Board, Column } from '../types/board';
import { CardItem } from './CardItem';
import { addCardToBoard, removeCardFromBoard, updateCardOnBoard } from '../utils/boardUtils';

interface ColumnListProps {
  board: Board;
  onBoardChange: (board: Board) => void;
}

interface ColumnProps {
  column: Column;
  board: Board;
  onBoardChange: (board: Board) => void;
}

const ColumnView: React.FC<ColumnProps> = ({ column, board, onBoardChange }) => {
  const handleAddCard = () => {
    const text = prompt('Enter card text:');
    if (!text?.trim()) return;
    const updated = addCardToBoard(board, column.id, text.trim());
    onBoardChange(updated);
  };

  const handleDeleteCard = (cardId: string) => {
    const updated = removeCardFromBoard(board, column.id, cardId);
    onBoardChange(updated);
  };

  const handleEditCard = (cardId: string, newText: string) => {
    const updated = updateCardOnBoard(board, column.id, cardId, { text: newText });
    onBoardChange(updated);
  };

  return (
    <div className="column" style={{ flex: 1, minWidth: 220, padding: '0 8px' }}>
      <h3 style={{ textAlign: 'center' }}>{column.title}</h3>
      <div className="cards">
        {column.cards.map((card) => (
          <CardItem
            key={card.id}
            card={card}
            onDelete={() => handleDeleteCard(card.id)}
            onEdit={(newText) => handleEditCard(card.id, newText)}
          />
        ))}
      </div>
      <button onClick={handleAddCard} style={{ width: '100%', marginTop: 8 }}>
        + Add Card
      </button>
    </div>
  );
};

export const ColumnList: React.FC<ColumnListProps> = ({ board, onBoardChange }) => {
  return (
    <div
      className="column-list"
      style={{ display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}
    >
      {board.columns.map((column) => (
        <ColumnView
          key={column.id}
          column={column}
          board={board}
          onBoardChange={onBoardChange}
        />
      ))}
    </div>
  );
};

export default ColumnList;
