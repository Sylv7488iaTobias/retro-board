import {
  saveBoardToStorage,
  loadBoardFromStorage,
  listBoardIdsFromStorage,
  removeBoardFromStorage,
  clearAllBoardsFromStorage,
} from './boardStorage';
import { createBoard } from './boardUtils';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    get length() { return Object.keys(store).length; },
    key: (index: number) => Object.keys(store)[index] ?? null,
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

beforeEach(() => {
  localStorageMock.clear();
});

describe('boardStorage', () => {
  it('saves and loads a board', () => {
    const board = createBoard('Sprint Retro');
    saveBoardToStorage(board);
    const loaded = loadBoardFromStorage(board.id);
    expect(loaded).not.toBeNull();
    expect(loaded?.id).toBe(board.id);
    expect(loaded?.title).toBe('Sprint Retro');
  });

  it('returns null for unknown board id', () => {
    const result = loadBoardFromStorage('nonexistent-id');
    expect(result).toBeNull();
  });

  it('lists saved board ids', () => {
    const b1 = createBoard('Board 1');
    const b2 = createBoard('Board 2');
    saveBoardToStorage(b1);
    saveBoardToStorage(b2);
    const ids = listBoardIdsFromStorage();
    expect(ids).toContain(b1.id);
    expect(ids).toContain(b2.id);
    expect(ids.length).toBe(2);
  });

  it('removes a board from storage', () => {
    const board = createBoard('To Remove');
    saveBoardToStorage(board);
    removeBoardFromStorage(board.id);
    expect(loadBoardFromStorage(board.id)).toBeNull();
  });

  it('clears all boards from storage', () => {
    saveBoardToStorage(createBoard('A'));
    saveBoardToStorage(createBoard('B'));
    clearAllBoardsFromStorage();
    expect(listBoardIdsFromStorage().length).toBe(0);
  });
});
