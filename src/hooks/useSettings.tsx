import { createContext, useContext, type ReactNode } from 'react';
import type { SettingsState } from '../components/UI/SettingsPanel';

interface SettingsContextValue {
  settings: SettingsState;
  updateSettings: (settings: SettingsState) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}

export function SettingsProvider({
  settings,
  updateSettings,
  children,
}: {
  settings: SettingsState;
  updateSettings: (settings: SettingsState) => void;
  children: ReactNode;
}) {
  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}
