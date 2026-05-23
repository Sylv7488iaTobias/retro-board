import { renderHook, act } from '@testing-library/react';
import { useBoardSearch } from './useBoardSearch';
import { Board } from '../types/board';

function makeBoard(): Board {
  return {
    id: 'b1',
    title: 'Test Board',
    createdAt: Date.now(),
    columns: [
      {
        id: 'c1',
        title: 'Went Well',
        cards: [
          { id: 'card1', text: 'Great teamwork', votes: 0, createdAt: 1 },
          { id: 'card2', text: 'Good communication', author: 'Alice', votes: 2, createdAt: 2 },
        ],
      },
      {
        id: 'c2',
        title: 'Improvements',
        cards: [
          { id: 'card3', text: 'Need better planning', votes: 1, createdAt: 3 },
        ],
      },
    ],
  };
}

describe('useBoardSearch', () => {
  it('returns empty results when query is empty', () => {
    const { result } = renderHook(() => useBoardSearch(makeBoard()));
    expect(result.current.results).toHaveLength(0);
    expect(result.current.hasQuery).toBe(false);
  });

  it('returns empty results when board is null', () => {
    const { result } = renderHook(() => useBoardSearch(null));
    act(() => result.current.setQuery('anything'));
    expect(result.current.results).toHaveLength(0);
  });

  it('finds cards matching text query', () => {
    const { result } = renderHook(() => useBoardSearch(makeBoard()));
    act(() => result.current.setQuery('teamwork'));
    expect(result.current.results).toHaveLength(1);
    expect(result.current.results[0].card.id).toBe('card1');
    expect(result.current.results[0].columnTitle).toBe('Went Well');
  });

  it('finds cards matching author', () => {
    const { result } = renderHook(() => useBoardSearch(makeBoard()));
    act(() => result.current.setQuery('alice'));
    expect(result.current.results).toHaveLength(1);
    expect(result.current.results[0].card.id).toBe('card2');
  });

  it('is case-insensitive', () => {
    const { result } = renderHook(() => useBoardSearch(makeBoard()));
    act(() => result.current.setQuery('GOOD'));
    expect(result.current.results).toHaveLength(1);
    expect(result.current.results[0].card.id).toBe('card2');
  });

  it('returns multiple results across columns', () => {
    const { result } = renderHook(() => useBoardSearch(makeBoard()));
    act(() => result.current.setQuery('g'));
    expect(result.current.results.length).toBeGreaterThan(1);
  });

  it('clears search query', () => {
    const { result } = renderHook(() => useBoardSearch(makeBoard()));
    act(() => result.current.setQuery('planning'));
    expect(result.current.hasQuery).toBe(true);
    act(() => result.current.clearSearch());
    expect(result.current.query).toBe('');
    expect(result.current.hasQuery).toBe(false);
    expect(result.current.results).toHaveLength(0);
  });
});
