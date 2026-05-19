import { useCallback, useState } from 'react';
import { Board } from '../types/board';
import { exportBoardToMarkdown } from '../utils/markdownExport';

interface UseBoardExportResult {
  isExporting: boolean;
  exportError: string | null;
  exportToMarkdown: (board: Board) => string;
  downloadMarkdown: (board: Board) => void;
  copyMarkdownToClipboard: (board: Board) => Promise<boolean>;
}

export function useBoardExport(): UseBoardExportResult {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const exportToMarkdown = useCallback((board: Board): string => {
    return exportBoardToMarkdown(board);
  }, []);

  const downloadMarkdown = useCallback((board: Board): void => {
    setIsExporting(true);
    setExportError(null);
    try {
      const markdown = exportBoardToMarkdown(board);
      const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const safeName = board.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      link.href = url;
      link.download = `${safeName}_retro.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setExportError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  }, []);

  const copyMarkdownToClipboard = useCallback(async (board: Board): Promise<boolean> => {
    setIsExporting(true);
    setExportError(null);
    try {
      const markdown = exportBoardToMarkdown(board);
      await navigator.clipboard.writeText(markdown);
      return true;
    } catch (err) {
      setExportError(err instanceof Error ? err.message : 'Copy to clipboard failed');
      return false;
    } finally {
      setIsExporting(false);
    }
  }, []);

  return {
    isExporting,
    exportError,
    exportToMarkdown,
    downloadMarkdown,
    copyMarkdownToClipboard,
  };
}
