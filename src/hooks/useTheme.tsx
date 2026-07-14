import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';
import {
  type Theme,
  getStoredTheme,
  setStoredTheme,
  initTheme,
} from '../lib/theme';

interface ThemeContextValue {
  theme: Theme;
  resolved: 'dark' | 'light';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeContext must be used within ThemeProvider');
  return ctx;
}

function computeResolved(t: Theme): 'dark' | 'light' {
  if (t === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return t;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme);
  const [resolved, setResolved] = useState<'dark' | 'light'>(() => computeResolved(getStoredTheme()));

  const setTheme = useCallback((t: Theme) => {
    setStoredTheme(t);
    setThemeState(t);
    setResolved(computeResolved(t));
  }, []);

  useEffect(() => {
    const { cleanup } = initTheme();
    const stored = getStoredTheme();
    setThemeState(stored);
    setResolved(computeResolved(stored));

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (getStoredTheme() === 'system') {
        setResolved(mq.matches ? 'dark' : 'light');
      }
    };
    mq.addEventListener('change', handler);

    return () => {
      mq.removeEventListener('change', handler);
      cleanup();
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolved, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
