import { Board, Card } from '../types/board';

function escapeMarkdown(text: string): string {
  return text.replace(/[\\`*_{}[\]()#+\-.!]/g, '\\$&');
}

function formatCard(card: Card, index: number): string {
  const lines: string[] = [];
  lines.push(`${index + 1}. **${escapeMarkdown(card.text)}**`);
  if (card.author) {
    lines.push(`   - *Author: ${escapeMarkdown(card.author)}*`);
  }
  if (card.votes && card.votes > 0) {
    lines.push(`   - Votes: ${card.votes}`);
  }
  return lines.join('\n');
}

function formatColumn(columnId: string, cards: Card[]): string {
  const lines: string[] = [];
  const heading = columnId
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  lines.push(`### ${heading}`);
  lines.push('');

  if (cards.length === 0) {
    lines.push('*No items*');
  } else {
    cards.forEach((card, index) => {
      lines.push(formatCard(card, index));
    });
  }

  return lines.join('\n');
}

export function exportBoardToMarkdown(board: Board): string {
  const lines: string[] = [];

  lines.push(`# ${escapeMarkdown(board.title)}`);
  lines.push('');

  if (board.description) {
    lines.push(`> ${escapeMarkdown(board.description)}`);
    lines.push('');
  }

  const createdAt = new Date(board.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  lines.push(`*Created: ${createdAt}*`);
  lines.push('');
  lines.push('---');
  lines.push('');

  const columnOrder = board.columnOrder ?? Object.keys(board.columns);

  columnOrder.forEach((columnId, idx) => {
    const cards = board.columns[columnId] ?? [];
    lines.push(formatColumn(columnId, cards));
    if (idx < columnOrder.length - 1) {
      lines.push('');
    }
  });

  return lines.join('\n');
}
