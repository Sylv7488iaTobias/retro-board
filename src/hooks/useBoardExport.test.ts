import { renderHook, act } from '@testing-library/react';
import { useBoardExport } from './useBoardExport';
import { createBoard, addCardToBoard, createCard } from '../utils/boardUtils';
import * as markdownExport from '../utils/markdownExport';

describe('useBoardExport', () => {
  let board = createBoard('Sprint 1 Retro');

  beforeEach(() => {
    board = createBoard('Sprint 1 Retro');
    const card = createCard('Great teamwork', 'went_well');
    board = addCardToBoard(board, card);
  });

  it('returns initial state correctly', () => {
    const { result } = renderHook(() => useBoardExport());
    expect(result.current.isExporting).toBe(false);
    expect(result.current.exportError).toBeNull();
  });

  it('exportToMarkdown returns markdown string', () => {
    const spy = jest.spyOn(markdownExport, 'exportBoardToMarkdown').mockReturnValue('# Sprint 1 Retro\n');
    const { result } = renderHook(() => useBoardExport());
    const md = result.current.exportToMarkdown(board);
    expect(md).toBe('# Sprint 1 Retro\n');
    expect(spy).toHaveBeenCalledWith(board);
    spy.mockRestore();
  });

  it('copyMarkdownToClipboard returns true on success', async () => {
    const writeTextMock = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText: writeTextMock } });
    jest.spyOn(markdownExport, 'exportBoardToMarkdown').mockReturnValue('# Board');

    const { result } = renderHook(() => useBoardExport());
    let success: boolean;
    await act(async () => {
      success = await result.current.copyMarkdownToClipboard(board);
    });

    expect(success!).toBe(true);
    expect(writeTextMock).toHaveBeenCalledWith('# Board');
    expect(result.current.exportError).toBeNull();
  });

  it('copyMarkdownToClipboard returns false and sets error on failure', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: jest.fn().mockRejectedValue(new Error('Permission denied')) },
    });

    const { result } = renderHook(() => useBoardExport());
    let success: boolean;
    await act(async () => {
      success = await result.current.copyMarkdownToClipboard(board);
    });

    expect(success!).toBe(false);
    expect(result.current.exportError).toBe('Permission denied');
  });

  it('isExporting is false after operations complete', async () => {
    Object.assign(navigator, { clipboard: { writeText: jest.fn().mockResolvedValue(undefined) } });
    const { result } = renderHook(() => useBoardExport());
    await act(async () => {
      await result.current.copyMarkdownToClipboard(board);
    });
    expect(result.current.isExporting).toBe(false);
  });
});
