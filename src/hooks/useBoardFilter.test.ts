import { renderHook, act } from '@testing-library/react';
import { useBoardFilter } from './useBoardFilter';
import { Board } from '../types/board';

function makeBoard(): Board {
  return {
    id: 'b1',
    title: 'Test Board',
    createdAt: Date.now(),
    columns: [
      {
        id: 'col1',
        title: 'Went Well',
        cards: [
          { id: 'c1', text: 'Good deploy', votes: 3, createdAt: Date.now() },
          { id: 'c2', text: 'Team sync', votes: 0, createdAt: Date.now() },
        ],
      },
      {
        id: 'col2',
        title: 'Improve',
        cards: [
          { id: 'c3', text: 'Slow CI', votes: 0, createdAt: Date.now() },
        ],
      },
    ],
  };
}

describe('useBoardFilter', () => {
  it('returns all cards by default', () => {
    const { result } = renderHook(() => useBoardFilter(makeBoard()));
    expect(result.current.totalVisible).toBe(3);
  });

  it('filters to only voted cards', () => {
    const { result } = renderHook(() => useBoardFilter(makeBoard()));
    act(() => result.current.setActiveFilter('voted'));
    expect(result.current.totalVisible).toBe(1);
    expect(result.current.filteredBoard?.filteredColumns[0].cards[0].id).toBe('c1');
  });

  it('filters to only unvoted cards', () => {
    const { result } = renderHook(() => useBoardFilter(makeBoard()));
    act(() => result.current.setActiveFilter('unvoted'));
    expect(result.current.totalVisible).toBe(2);
  });

  it('filters by selected column', () => {
    const { result } = renderHook(() => useBoardFilter(makeBoard()));
    act(() => result.current.setSelectedColumn('col1'));
    expect(result.current.filteredBoard?.filteredColumns).toHaveLength(1);
    expect(result.current.totalVisible).toBe(2);
  });

  it('combines column and vote filter', () => {
    const { result } = renderHook(() => useBoardFilter(makeBoard()));
    act(() => {
      result.current.setSelectedColumn('col1');
      result.current.setActiveFilter('voted');
    });
    expect(result.current.totalVisible).toBe(1);
  });

  it('returns null filteredBoard when board is null', () => {
    const { result } = renderHook(() => useBoardFilter(null));
    expect(result.current.filteredBoard).toBeNull();
    expect(result.current.totalVisible).toBe(0);
  });
});
