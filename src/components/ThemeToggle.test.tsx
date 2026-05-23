import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from './ThemeToggle';
import * as useBoardThemeModule from '../hooks/useBoardTheme';

const mockToggleTheme = jest.fn();
const mockSetTheme = jest.fn();

const mockHook = (overrides: Partial<useBoardThemeModule.UseBoardThemeResult> = {}) => {
  jest.spyOn(useBoardThemeModule, 'useBoardTheme').mockReturnValue({
    theme: 'light',
    resolvedTheme: 'light',
    setTheme: mockSetTheme,
    toggleTheme: mockToggleTheme,
    ...overrides,
  });
};

beforeEach(() => {
  jest.clearAllMocks();
  mockHook();
});

test('renders quick toggle button', () => {
  render(<ThemeToggle />);
  expect(screen.getByRole('button', { name: /switch to dark/i })).toBeInTheDocument();
});

test('quick toggle calls toggleTheme', () => {
  render(<ThemeToggle />);
  fireEvent.click(screen.getByRole('button'));
  expect(mockToggleTheme).toHaveBeenCalledTimes(1);
});

test('renders select with theme options', () => {
  render(<ThemeToggle />);
  const select = screen.getByRole('combobox', { name: /select theme/i });
  expect(select).toBeInTheDocument();
  expect(screen.getByRole('option', { name: /light/i })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: /dark/i })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: /system/i })).toBeInTheDocument();
});

test('select change calls setTheme', () => {
  render(<ThemeToggle />);
  const select = screen.getByRole('combobox');
  fireEvent.change(select, { target: { value: 'dark' } });
  expect(mockSetTheme).toHaveBeenCalledWith('dark');
});

test('shows label when showLabel is true', () => {
  render(<ThemeToggle showLabel />);
  expect(screen.getByText('Light')).toBeInTheDocument();
});

test('shows moon icon when resolved theme is light', () => {
  mockHook({ resolvedTheme: 'light' });
  render(<ThemeToggle />);
  expect(screen.getByRole('button').textContent).toBe('🌙');
});

test('shows sun icon when resolved theme is dark', () => {
  mockHook({ resolvedTheme: 'dark', theme: 'dark' });
  render(<ThemeToggle />);
  expect(screen.getByRole('button').textContent).toBe('☀️');
});
