export type CardCategory = 'went-well' | 'to-improve' | 'action-items';

export interface Card {
  id: string;
  category: CardCategory;
  text: string;
  author: string;
  votes: number;
  createdAt: Date;
}

export interface Board {
  id: string;
  title: string;
  cards: Card[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCardPayload {
  category: CardCategory;
  text: string;
  author: string;
}

export interface UpdateCardPayload {
  text?: string;
  votes?: number;
}

export type BoardEvent =
  | { type: 'card:created'; card: Card }
  | { type: 'card:updated'; cardId: string; changes: UpdateCardPayload }
  | { type: 'card:deleted'; cardId: string }
  | { type: 'card:voted'; cardId: string; votes: number }
  | { type: 'board:synced'; board: Board };
