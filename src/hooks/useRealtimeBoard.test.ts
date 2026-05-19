import { renderHook, act } from '@testing-library/react';
import { useRealtimeBoard, BoardEvent } from './useRealtimeBoard';
import { createBoard, createCard } from '../utils/boardUtils';
import { Board } from '../types/board';

const mockClose = jest.fn();
let messageHandler: ((e: MessageEvent) => void) | null = null;

const mockChannel = {
  postMessage: jest.fn(),
  close: mockClose,
  set onmessage(handler: (e: MessageEvent) => void) {
    messageHandler = handler;
  },
};

(global as any).BroadcastChannel = jest.fn(() => mockChannel);

describe('useRealtimeBoard', () => {
  let initialBoard: Board;

  beforeEach(() => {
    jest.clearAllMocks();
    messageHandler = null;
    initialBoard = createBoard('Test Board', ['Went Well', 'To Improve']);
  });

  it('initializes with the provided board', () => {
    const { result } = renderHook(() =>
      useRealtimeBoard({ boardId: 'b1', initialBoard })
    );
    expect(result.current.board.title).toBe('Test Board');
    expect(result.current.connected).toBe(true);
  });

  it('applies card_added event via broadcastEvent', () => {
    const { result } = renderHook(() =>
      useRealtimeBoard({ boardId: 'b1', initialBoard })
    );
    const columnId = initialBoard.columns[0].id;
    const card = createCard('Great teamwork!');
    const event: BoardEvent = { type: 'card_added', columnId, card };

    act(() => {
      result.current.broadcastEvent(event);
    });

    const col = result.current.board.columns.find((c) => c.id === columnId);
    expect(col?.cards).toHaveLength(1);
    expect(col?.cards[0].text).toBe('Great teamwork!');
    expect(mockChannel.postMessage).toHaveBeenCalledWith(event);
  });

  it('applies incoming broadcast messages from other tabs', () => {
    const { result } = renderHook(() =>
      useRealtimeBoard({ boardId: 'b1', initialBoard })
    );
    const columnId = initialBoard.columns[1].id;
    const card = createCard('Need better CI');
    const event: BoardEvent = { type: 'card_added', columnId, card };

    act(() => {
      messageHandler?.({ data: event } as MessageEvent);
    });

    const col = result.current.board.columns.find((c) => c.id === columnId);
    expect(col?.cards).toHaveLength(1);
  });

  it('calls onEvent callback when an event is applied', () => {
    const onEvent = jest.fn();
    const { result } = renderHook(() =>
      useRealtimeBoard({ boardId: 'b1', initialBoard, onEvent })
    );
    const columnId = initialBoard.columns[0].id;
    const card = createCard('Callback test');
    const event: BoardEvent = { type: 'card_added', columnId, card };

    act(() => {
      result.current.broadcastEvent(event);
    });

    expect(onEvent).toHaveBeenCalledWith(event);
  });

  it('closes BroadcastChannel on unmount', () => {
    const { unmount } = renderHook(() =>
      useRealtimeBoard({ boardId: 'b1', initialBoard })
    );
    unmount();
    expect(mockClose).toHaveBeenCalled();
  });
});
