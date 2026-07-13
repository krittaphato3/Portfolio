import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Command,
  Search,
  Bell,
  Settings,
  Moon,
  Sun,
  Monitor,
} from 'lucide-react';
import { useThemeContext } from '../hooks/useTheme';
import { SearchModal, useSearchShortcut } from './UI/SearchModal';
import { NotificationsPanel, useSampleNotifications } from './UI/NotificationsPanel';
import { SettingsPanel, defaultSettings, type SettingsState } from './UI/SettingsPanel';

export function Header() {
  const { theme, setTheme } = useThemeContext();
  const notifications = useSampleNotifications();
  const [unreadCount] = useState(() => notifications.filter((n) => !n.read).length);

  // Panel state
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);

  const toggleSearch = useCallback(() => {
    setSearchOpen((prev) => !prev);
    setNotifOpen(false);
    setSettingsOpen(false);
  }, []);

  const handleSearchClose = useCallback(() => setSearchOpen(false), []);
  const handleNotifClose = useCallback(() => setNotifOpen(false), []);
  const handleSettingsClose = useCallback(() => setSettingsOpen(false), []);

  useSearchShortcut(toggleSearch);

  const cycleTheme = () => {
    const order: Array<'dark' | 'light' | 'system'> = ['dark', 'light', 'system'];
    const idx = order.indexOf(theme);
    setTheme(order[(idx + 1) % order.length]);
  };

  const ThemeIcon = theme === 'light' ? Sun : theme === 'system' ? Monitor : Moon;

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const, stiffness: 300, damping: 30 }}
        className="sticky top-0 z-50 glass-strong border-b border-glass-border"
      >
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: -10, scale: 1.05 }}
              transition={{ type: 'spring' as const, stiffness: 400, damping: 15 }}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-cyan to-primary-violet flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              <Command className="w-4 h-4 text-white" />
            </motion.div>
            <span className="text-text-primary font-semibold text-sm hidden sm:block tracking-tight">
              Portfolio Command Center
            </span>
          </div>

          {/* Center: Search trigger */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-bg-card border border-border-subtle rounded-xl w-72 hover:border-border-default transition-colors cursor-pointer group" onClick={toggleSearch}>
            <Search className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" />
            <span className="text-sm text-text-muted group-hover:text-text-secondary transition-colors">
              Search everything...
            </span>
            <kbd className="ml-auto px-1.5 py-0.5 text-[10px] font-medium bg-bg-elevated text-text-muted rounded border border-border-subtle">
              Ctrl K
            </kbd>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 relative">
            {/* Notifications */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  setSettingsOpen(false);
                }}
                className="relative p-2 rounded-lg hover:bg-bg-elevated transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-text-secondary" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-cyan rounded-full" />
                )}
              </motion.button>
              <NotificationsPanel
                open={notifOpen}
                onClose={handleNotifClose}
                notifications={notifications}
                onMarkRead={() => {}}
                onMarkAllRead={() => {}}
              />
            </div>

            {/* Settings */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSettingsOpen(!settingsOpen);
                setNotifOpen(false);
              }}
              className="p-2 rounded-lg hover:bg-bg-elevated transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5 text-text-secondary" />
            </motion.button>

            {/* Theme toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={cycleTheme}
              className="p-2 rounded-lg hover:bg-bg-elevated transition-colors"
              aria-label={`Current theme: ${theme}. Click to cycle.`}
              title={`Theme: ${theme}`}
            >
              <ThemeIcon className="w-5 h-5 text-text-secondary" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Global overlays */}
      <SearchModal open={searchOpen} onClose={handleSearchClose} />
      <SettingsPanel
        open={settingsOpen}
        onClose={handleSettingsClose}
        settings={settings}
        onSettingsChange={setSettings}
      />
    </>
  );
}
