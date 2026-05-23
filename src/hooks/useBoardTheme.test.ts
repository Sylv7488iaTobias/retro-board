import { renderHook, act } from '@testing-library/react';
import { useBoardTheme } from './useBoardTheme';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const matchMediaMock = (matches: boolean) => ({
  matches,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
});

beforeEach(() => {
  localStorageMock.clear();
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(() => matchMediaMock(false)),
  });
  document.documentElement.removeAttribute('data-theme');
});

test('defaults to system theme', () => {
  const { result } = renderHook(() => useBoardTheme());
  expect(result.current.theme).toBe('system');
});

test('resolves system theme to light when no dark preference', () => {
  const { result } = renderHook(() => useBoardTheme());
  expect(result.current.resolvedTheme).toBe('light');
});

test('setTheme persists to localStorage', () => {
  const { result } = renderHook(() => useBoardTheme());
  act(() => result.current.setTheme('dark'));
  expect(localStorageMock.getItem('retro-board-theme')).toBe('dark');
  expect(result.current.theme).toBe('dark');
  expect(result.current.resolvedTheme).toBe('dark');
});

test('toggleTheme switches from light to dark', () => {
  const { result } = renderHook(() => useBoardTheme());
  act(() => result.current.setTheme('light'));
  act(() => result.current.toggleTheme());
  expect(result.current.resolvedTheme).toBe('dark');
});

test('toggleTheme switches from dark to light', () => {
  const { result } = renderHook(() => useBoardTheme());
  act(() => result.current.setTheme('dark'));
  act(() => result.current.toggleTheme());
  expect(result.current.resolvedTheme).toBe('light');
});

test('sets data-theme attribute on documentElement', () => {
  const { result } = renderHook(() => useBoardTheme());
  act(() => result.current.setTheme('dark'));
  expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
});

test('loads persisted theme from localStorage', () => {
  localStorageMock.setItem('retro-board-theme', 'dark');
  const { result } = renderHook(() => useBoardTheme());
  expect(result.current.theme).toBe('dark');
});
