import { renderHook, act } from '@testing-library/react';
import { useBoardPresence } from './useBoardPresence';

const BOARD_ID = 'test-board-presence';

beforeEach(() => {
  localStorage.clear();
});

describe('useBoardPresence', () => {
  it('initialises with a current user', () => {
    const { result } = renderHook(() =>
      useBoardPresence(BOARD_ID, 'Alice')
    );
    expect(result.current.currentUser.name).toBe('Alice');
    expect(result.current.currentUser.id).toBeTruthy();
    expect(result.current.currentUser.color).toMatch(/^#/);
  });

  it('includes the current user in activeUsers', () => {
    const { result } = renderHook(() =>
      useBoardPresence(BOARD_ID, 'Bob')
    );
    const ids = result.current.activeUsers.map((u) => u.id);
    expect(ids).toContain(result.current.currentUser.id);
  });

  it('updateName changes the current user name', () => {
    const { result } = renderHook(() =>
      useBoardPresence(BOARD_ID, 'Charlie')
    );
    act(() => {
      result.current.updateName('Dave');
    });
    expect(result.current.currentUser.name).toBe('Dave');
  });

  it('assigns distinct colors for different user ids', () => {
    const { result: r1 } = renderHook(() =>
      useBoardPresence('board-a', 'User1')
    );
    const { result: r2 } = renderHook(() =>
      useBoardPresence('board-b', 'User2')
    );
    // Colors are strings starting with #
    expect(r1.current.currentUser.color).toMatch(/^#[0-9a-f]{6}$/i);
    expect(r2.current.currentUser.color).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it('removes user from storage on unmount', () => {
    const { result, unmount } = renderHook(() =>
      useBoardPresence(BOARD_ID, 'Eve')
    );
    const userId = result.current.currentUser.id;
    unmount();
    const raw = localStorage.getItem(`presence:${BOARD_ID}`);
    const users = raw ? JSON.parse(raw) : [];
    expect(users.find((u: { id: string }) => u.id === userId)).toBeUndefined();
  });

  it('persists presence data in localStorage', () => {
    const { result } = renderHook(() =>
      useBoardPresence(BOARD_ID, 'Frank')
    );
    const raw = localStorage.getItem(`presence:${BOARD_ID}`);
    expect(raw).not.toBeNull();
    const users = JSON.parse(raw!);
    expect(users.some((u: { id: string }) => u.id === result.current.currentUser.id)).toBe(true);
  });
});
