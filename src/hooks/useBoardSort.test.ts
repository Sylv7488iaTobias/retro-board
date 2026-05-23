import { renderHook, act } from '@testing-library/react';
import { useBoardSort } from './useBoardSort';
import { Board, Card } from '../types/board';

const makeCard = (id: string, text: string, votes: number, createdAt: string): Card => ({
  id,
  text,
  votes,
  createdAt,
});

const makeBoard = (): Board => ({
  id: 'b1',
  title: 'Test Board',
  createdAt: '2024-01-01T00:00:00Z',
  columns: [
    {
      id: 'col1',
      title: 'Went Well',
      cards: [
        makeCard('c1', 'Banana', 3, '2024-01-03T00:00:00Z'),
        makeCard('c2', 'Apple', 5, '2024-01-01T00:00:00Z'),
        makeCard('c3', 'Cherry', 1, '2024-01-02T00:00:00Z'),
      ],
    },
  ],
});

describe('useBoardSort', () => {
  it('defaults to createdAt desc', () => {
    const { result } = renderHook(() => useBoardSort(makeBoard()));
    expect(result.current.sortState).toEqual({ field: 'createdAt', direction: 'desc' });
  });

  it('sorts cards by votes descending', () => {
    const { result } = renderHook(() => useBoardSort(makeBoard()));
    act(() => result.current.setSortField('votes'));
    const cards = result.current.sortedBoard!.columns[0].cards;
    expect(cards.map(c => c.votes)).toEqual([5, 3, 1]);
  });

  it('sorts cards by votes ascending when toggled', () => {
    const { result } = renderHook(() => useBoardSort(makeBoard()));
    act(() => result.current.setSortField('votes'));
    act(() => result.current.setSortField('votes')); // toggles direction
    const cards = result.current.sortedBoard!.columns[0].cards;
    expect(cards.map(c => c.votes)).toEqual([1, 3, 5]);
  });

  it('sorts cards by text ascending', () => {
    const { result } = renderHook(() => useBoardSort(makeBoard()));
    act(() => result.current.setSortField('text'));
    act(() => result.current.toggleSortDirection());
    const cards = result.current.sortedBoard!.columns[0].cards;
    expect(cards.map(c => c.text)).toEqual(['Apple', 'Banana', 'Cherry']);
  });

  it('returns null sortedBoard when board is null', () => {
    const { result } = renderHook(() => useBoardSort(null));
    expect(result.current.sortedBoard).toBeNull();
  });

  it('toggleSortDirection flips direction', () => {
    const { result } = renderHook(() => useBoardSort(makeBoard()));
    act(() => result.current.toggleSortDirection());
    expect(result.current.sortState.direction).toBe('asc');
    act(() => result.current.toggleSortDirection());
    expect(result.current.sortState.direction).toBe('desc');
  });
});
