import { useState, useEffect, useCallback, useRef } from 'react';
import { Board, Card } from '../types/board';
import { addCardToBoard, updateCardOnBoard, removeCardFromBoard } from '../utils/boardUtils';

export type BoardEvent =
  | { type: 'card_added'; columnId: string; card: Card }
  | { type: 'card_updated'; columnId: string; card: Card }
  | { type: 'card_removed'; columnId: string; cardId: string }
  | { type: 'board_replaced'; board: Board };

interface UseRealtimeBoardOptions {
  boardId: string;
  initialBoard: Board;
  onEvent?: (event: BoardEvent) => void;
}

interface UseRealtimeBoardReturn {
  board: Board;
  connected: boolean;
  broadcastEvent: (event: BoardEvent) => void;
  applyEvent: (event: BoardEvent) => void;
}

export function useRealtimeBoard({
  boardId,
  initialBoard,
  onEvent,
}: UseRealtimeBoardOptions): UseRealtimeBoardReturn {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [connected, setConnected] = useState(false);
  const channelRef = useRef<BroadcastChannel | null>(null);

  const applyEvent = useCallback((event: BoardEvent) => {
    setBoard((prev) => {
      switch (event.type) {
        case 'card_added':
          return addCardToBoard(prev, event.columnId, event.card);
        case 'card_updated':
          return updateCardOnBoard(prev, event.columnId, event.card);
        case 'card_removed':
          return removeCardFromBoard(prev, event.columnId, event.cardId);
        case 'board_replaced':
          return event.board;
        default:
          return prev;
      }
    });
    onEvent?.(event);
  }, [onEvent]);

  const broadcastEvent = useCallback((event: BoardEvent) => {
    applyEvent(event);
    channelRef.current?.postMessage(event);
  }, [applyEvent]);

  useEffect(() => {
    const channel = new BroadcastChannel(`retro-board:${boardId}`);
    channelRef.current = channel;
    setConnected(true);

    channel.onmessage = (e: MessageEvent<BoardEvent>) => {
      applyEvent(e.data);
    };

    return () => {
      channel.close();
      channelRef.current = null;
      setConnected(false);
    };
  }, [boardId, applyEvent]);

  useEffect(() => {
    setBoard(initialBoard);
  }, [initialBoard]);

  return { board, connected, broadcastEvent, applyEvent };
}
