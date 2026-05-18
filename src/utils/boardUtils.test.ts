import {
  createBoard,
  createCard,
  addCardToBoard,
  updateCardOnBoard,
  removeCardFromBoard,
  getCardsByCategory,
  exportBoardToMarkdown,
} from './boardUtils';

describe('boardUtils', () => {
  const sampleBoard = createBoard('Sprint 42 Retro');

  it('createBoard should initialize with empty cards', () => {
    expect(sampleBoard.title).toBe('Sprint 42 Retro');
    expect(sampleBoard.cards).toHaveLength(0);
    expect(sampleBoard.id).toBeDefined();
  });

  it('createCard should set defaults correctly', () => {
    const card = createCard({ category: 'went-well', text: 'Great teamwork', author: 'Alice' });
    expect(card.votes).toBe(0);
    expect(card.category).toBe('went-well');
    expect(card.id).toBeDefined();
  });

  it('addCardToBoard should append the card', () => {
    const card = createCard({ category: 'went-well', text: 'CI is fast', author: 'Bob' });
    const updated = addCardToBoard(sampleBoard, card);
    expect(updated.cards).toHaveLength(1);
    expect(updated.cards[0].text).toBe('CI is fast');
  });

  it('updateCardOnBoard should update matching card', () => {
    const card = createCard({ category: 'to-improve', text: 'Old text', author: 'Carol' });
    let board = addCardToBoard(sampleBoard, card);
    board = updateCardOnBoard(board, card.id, { text: 'New text', votes: 3 });
    expect(board.cards[0].text).toBe('New text');
    expect(board.cards[0].votes).toBe(3);
  });

  it('removeCardFromBoard should remove matching card', () => {
    const card = createCard({ category: 'action-items', text: 'Fix bug', author: 'Dave' });
    let board = addCardToBoard(sampleBoard, card);
    board = removeCardFromBoard(board, card.id);
    expect(board.cards).toHaveLength(0);
  });

  it('getCardsByCategory should filter correctly', () => {
    const c1 = createCard({ category: 'went-well', text: 'A', author: 'X' });
    const c2 = createCard({ category: 'to-improve', text: 'B', author: 'Y' });
    let board = addCardToBoard(sampleBoard, c1);
    board = addCardToBoard(board, c2);
    expect(getCardsByCategory(board, 'went-well')).toHaveLength(1);
    expect(getCardsByCategory(board, 'action-items')).toHaveLength(0);
  });

  it('exportBoardToMarkdown should include all sections', () => {
    const card = createCard({ category: 'went-well', text: 'Shipped on time', author: 'Eve' });
    const board = addCardToBoard(createBoard('Test Retro'), card);
    const md = exportBoardToMarkdown(board);
    expect(md).toContain('# Test Retro');
    expect(md).toContain('## ✅ Went Well');
    expect(md).toContain('Shipped on time');
    expect(md).toContain('_No items_');
  });
});
