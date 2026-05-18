import { Board } from '../types/board';

const STORAGE_KEY_PREFIX = 'retro-board:';

export function saveBoardToStorage(board: Board): void {
  try {
    const key = `${STORAGE_KEY_PREFIX}${board.id}`;
    const serialized = JSON.stringify({
      ...board,
      updatedAt: new Date().toISOString(),
    });
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error('Failed to save board to storage:', error);
    throw new Error('Storage save failed');
  }
}

export function loadBoardFromStorage(boardId: string): Board | null {
  try {
    const key = `${STORAGE_KEY_PREFIX}${boardId}`;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as Board;
  } catch (error) {
    console.error('Failed to load board from storage:', error);
    return null;
  }
}

export function listBoardIdsFromStorage(): string[] {
  const ids: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
      ids.push(key.slice(STORAGE_KEY_PREFIX.length));
    }
  }
  return ids;
}

export function removeBoardFromStorage(boardId: string): void {
  const key = `${STORAGE_KEY_PREFIX}${boardId}`;
  localStorage.removeItem(key);
}

export function clearAllBoardsFromStorage(): void {
  const ids = listBoardIdsFromStorage();
  ids.forEach((id) => removeBoardFromStorage(id));
}
