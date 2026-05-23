import React from 'react';
import { useBoardTheme, Theme } from '../hooks/useBoardTheme';

const THEME_OPTIONS: { value: Theme; label: string; icon: string }[] = [
  { value: 'light', label: 'Light', icon: '☀️' },
  { value: 'dark', label: 'Dark', icon: '🌙' },
  { value: 'system', label: 'System', icon: '💻' },
];

export interface ThemeToggleProps {
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ showLabel = false }) => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useBoardTheme();

  return (
    <div className="theme-toggle" role="group" aria-label="Theme selector">
      <button
        className="theme-toggle__quick"
        onClick={toggleTheme}
        aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} theme`}
        title={`Current: ${resolvedTheme}`}
      >
        {resolvedTheme === 'light' ? '🌙' : '☀️'}
      </button>
      <select
        className="theme-toggle__select"
        value={theme}
        onChange={(e) => setTheme(e.target.value as Theme)}
        aria-label="Select theme"
      >
        {THEME_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.icon} {opt.label}
          </option>
        ))}
      </select>
      {showLabel && (
        <span className="theme-toggle__label">
          {THEME_OPTIONS.find((o) => o.value === theme)?.label}
        </span>
      )}
    </div>
  );
};

export default ThemeToggle;
