import { exportBoardToMarkdown } from './markdownExport';
import { createBoard, createCard, addCardToBoard } from './boardUtils';

describe('exportBoardToMarkdown', () => {
  it('should export an empty board with title and date', () => {
    const board = createBoard('Sprint Retro', 'Our first retro');
    const md = exportBoardToMarkdown(board);

    expect(md).toContain('# Sprint Retro');
    expect(md).toContain('> Our first retro');
    expect(md).toContain('*Created:');
    expect(md).toContain('---');
  });

  it('should render columns with no items message when empty', () => {
    const board = createBoard('Empty Board');
    const md = exportBoardToMarkdown(board);

    expect(md).toContain('*No items*');
  });

  it('should include card text in output', () => {
    let board = createBoard('Team Retro');
    const card = createCard('Great teamwork this sprint', 'Alice');
    board = addCardToBoard(board, 'went-well', card);

    const md = exportBoardToMarkdown(board);

    expect(md).toContain('Great teamwork this sprint');
    expect(md).toContain('Author: Alice');
  });

  it('should show votes when card has votes', () => {
    let board = createBoard('Voted Retro');
    const card = { ...createCard('Deploy more often'), votes: 5 };
    board = addCardToBoard(board, 'improvements', card);

    const md = exportBoardToMarkdown(board);

    expect(md).toContain('Votes: 5');
  });

  it('should escape special markdown characters in card text', () => {
    let board = createBoard('Special Chars');
    const card = createCard('Use *bold* and _italic_ carefully');
    board = addCardToBoard(board, 'went-well', card);

    const md = exportBoardToMarkdown(board);

    expect(md).toContain('\\*bold\\*');
    expect(md).toContain('\\_italic\\_');
  });

  it('should format column headings from kebab-case ids', () => {
    const board = createBoard('Heading Test');
    const md = exportBoardToMarkdown(board);

    expect(md).toMatch(/### Went Well|### Improvements|### Action Items/);
  });

  it('should not include description section when not provided', () => {
    const board = createBoard('No Desc Board');
    const md = exportBoardToMarkdown(board);

    expect(md).not.toContain('> ');
  });
});
