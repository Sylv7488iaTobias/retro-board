import React, { useState } from 'react';
import { Board } from '../types/board';
import { useBoardExport } from '../hooks/useBoardExport';

interface ExportButtonProps {
  board: Board;
  className?: string;
}

export function ExportButton({ board, className = '' }: ExportButtonProps) {
  const { isExporting, exportError, downloadMarkdown, copyMarkdownToClipboard } = useBoardExport();
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleDownload = () => {
    downloadMarkdown(board);
    setMenuOpen(false);
  };

  const handleCopy = async () => {
    const success = await copyMarkdownToClipboard(board);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    setMenuOpen(false);
  };

  return (
    <div className={`export-button-wrapper ${className}`} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setMenuOpen((prev) => !prev)}
        disabled={isExporting}
        aria-haspopup="true"
        aria-expanded={menuOpen}
        style={{ cursor: isExporting ? 'not-allowed' : 'pointer' }}
      >
        {isExporting ? 'Exporting…' : 'Export'}
      </button>

      {menuOpen && (
        <div
          role="menu"
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: 4,
            zIndex: 100,
            minWidth: 160,
          }}
        >
          <button role="menuitem" onClick={handleDownload} style={{ display: 'block', width: '100%', padding: '8px 12px' }}>
            Download .md
          </button>
          <button role="menuitem" onClick={handleCopy} style={{ display: 'block', width: '100%', padding: '8px 12px' }}>
            {copied ? '✓ Copied!' : 'Copy to Clipboard'}
          </button>
        </div>
      )}

      {exportError && (
        <p role="alert" style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
          {exportError}
        </p>
      )}
    </div>
  );
}
