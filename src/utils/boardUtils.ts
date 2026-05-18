import { v4 as uuidv4 } from 'uuid';
import { Board, Card, CardCategory, CreateCardPayload, UpdateCardPayload } from '../types/board';

export function createBoard(title: string): Board {
  return {
    id: uuidv4(),
    title,
    cards: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function createCard(payload: CreateCardPayload): Card {
  return {
    id: uuidv4(),
    category: payload.category,
    text: payload.text,
    author: payload.author,
    votes: 0,
    createdAt: new Date(),
  };
}

export function addCardToBoard(board: Board, card: Card): Board {
  return { ...board, cards: [...board.cards, card], updatedAt: new Date() };
}

export function updateCardOnBoard(board: Board, cardId: string, changes: UpdateCardPayload): Board {
  const cards = board.cards.map((c) =>
    c.id === cardId ? { ...c, ...changes } : c
  );
  return { ...board, cards, updatedAt: new Date() };
}

export function removeCardFromBoard(board: Board, cardId: string): Board {
  const cards = board.cards.filter((c) => c.id !== cardId);
  return { ...board, cards, updatedAt: new Date() };
}

export function getCardsByCategory(board: Board, category: CardCategory): Card[] {
  return board.cards.filter((c) => c.category === category);
}

export function exportBoardToMarkdown(board: Board): string {
  const sections: Record<CardCategory, string> = {
    'went-well': '## ✅ Went Well',
    'to-improve': '## 🔧 To Improve',
    'action-items': '## 🚀 Action Items',
  };

  const lines: string[] = [`# ${board.title}`, ''];

  for (const [category, heading] of Object.entries(sections) as [CardCategory, string][]) {
    lines.push(heading);
    const cards = getCardsByCategory(board, category);
    if (cards.length === 0) {
      lines.push('_No items_');
    } else {
      cards.forEach((card) => {
        lines.push(`- ${card.text} *(by ${card.author}, 👍 ${card.votes})*`);
      });
    }
    lines.push('');
  }

  return lines.join('\n');
}
