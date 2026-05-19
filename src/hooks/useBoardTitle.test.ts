import { renderHook, act } from '@testing-library/react';
import { useBoardTitle } from './useBoardTitle';
import { createBoard } from '../utils/boardUtils';

describe('useBoardTitle', () => {
  it('should initialize with the board title', () => {
    const board = createBoard('My Retro');
    const onUpdate = jest.fn();
    const { result } = renderHook(() => useBoardTitle(board, onUpdate));

    expect(result.current.title).toBe('My Retro');
    expect(result.current.isEditing).toBe(false);
  });

  it('should enter editing mode when startEditing is called', () => {
    const board = createBoard('My Retro');
    const onUpdate = jest.fn();
    const { result } = renderHook(() => useBoardTitle(board, onUpdate));

    act(() => {
      result.current.startEditing();
    });

    expect(result.current.isEditing).toBe(true);
  });

  it('should update title on change', () => {
    const board = createBoard('My Retro');
    const onUpdate = jest.fn();
    const { result } = renderHook(() => useBoardTitle(board, onUpdate));

    act(() => {
      result.current.startEditing();
      result.current.handleChange('New Title');
    });

    expect(result.current.title).toBe('New Title');
  });

  it('should call onUpdate and exit editing on commitTitle', () => {
    const board = createBoard('My Retro');
    const onUpdate = jest.fn();
    const { result } = renderHook(() => useBoardTitle(board, onUpdate));

    act(() => {
      result.current.startEditing();
      result.current.handleChange('Updated Title');
      result.current.commitTitle();
    });

    expect(result.current.isEditing).toBe(false);
    expect(onUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Updated Title' })
    );
  });

  it('should not call onUpdate if title is empty on commit', () => {
    const board = createBoard('My Retro');
    const onUpdate = jest.fn();
    const { result } = renderHook(() => useBoardTitle(board, onUpdate));

    act(() => {
      result.current.startEditing();
      result.current.handleChange('');
      result.current.commitTitle();
    });

    expect(onUpdate).not.toHaveBeenCalled();
    expect(result.current.isEditing).toBe(false);
    expect(result.current.title).toBe('My Retro');
  });

  it('should cancel editing and revert title on cancelEditing', () => {
    const board = createBoard('My Retro');
    const onUpdate = jest.fn();
    const { result } = renderHook(() => useBoardTitle(board, onUpdate));

    act(() => {
      result.current.startEditing();
      result.current.handleChange('Draft Title');
      result.current.cancelEditing();
    });

    expect(result.current.isEditing).toBe(false);
    expect(result.current.title).toBe('My Retro');
    expect(onUpdate).not.toHaveBeenCalled();
  });
});
