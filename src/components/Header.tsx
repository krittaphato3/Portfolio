import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router';
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
import { NotificationsPanel, type Notification } from './UI/NotificationsPanel';
import { SettingsPanel, type SettingsState } from './UI/SettingsPanel';

interface HeaderProps {
  settings: SettingsState;
  onSettingsChange: (settings: SettingsState) => void;
  notifications: Notification[];
}

export function Header({ settings, onSettingsChange, notifications }: HeaderProps) {
  const { theme, setTheme } = useThemeContext();
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  // Skip link for accessibility
  const [_skipLinkVisible, _setSkipLinkVisible] = useState(false);

  // Panel state
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Sync settings.theme with theme context
  useEffect(() => {
    if (settings.theme !== theme) {
      setTheme(settings.theme);
    }
  }, [settings.theme, theme, setTheme]);

  const notificationsWithRead = notifications.map(n => ({
    ...n,
    read: readIds.has(n.id),
  }));

  const unreadCount = notificationsWithRead.filter((n) => !n.read).length;

  const toggleSearch = useCallback(() => {
    setSearchOpen((prev) => !prev);
    setNotifOpen(false);
    setSettingsOpen(false);
  }, []);

  const handleSearchClose = useCallback(() => setSearchOpen(false), []);
  const handleNotifClose = useCallback(() => setNotifOpen(false), []);
  const handleSettingsClose = useCallback(() => setSettingsOpen(false), []);

  useSearchShortcut(toggleSearch);

  // Handle focus for skip link
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        _setSkipLinkVisible(true);
      }
    };
    const handleClick = () => _setSkipLinkVisible(false);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  const cycleTheme = () => {
    const order: Array<'dark' | 'light' | 'system'> = ['dark', 'light', 'system'];
    const idx = order.indexOf(theme);
    const next = order[(idx + 1) % order.length];
    setTheme(next);
    onSettingsChange({ ...settings, theme: next });
  };

  const ThemeIcon = theme === 'light' ? Sun : theme === 'system' ? Monitor : Moon;

  return (
    <>
      {/* Skip Link - Accessibility */}
      <a
        href="#main-content"
        className={`sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary-cyan focus:text-white focus:rounded-lg focus:font-medium focus:outline-none focus:ring-2 focus:ring-primary-cyan focus:ring-offset-2 focus:ring-offset-bg-dark`}
      >
        Skip to main content
      </a>

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const, stiffness: 300, damping: 30 }}
        className="sticky top-0 z-50 glass-strong border-b border-glass-border"
        role="banner"
      >
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: -10, scale: 1.05 }}
              transition={{ type: 'spring' as const, stiffness: 400, damping: 15 }}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-cyan to-primary-violet flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              aria-hidden="true"
            >
              <Command className="w-4 h-4 text-white" />
            </motion.div>
            <Link to="/" className="text-text-primary font-semibold text-sm hidden sm:block tracking-tight hover:text-primary-cyan transition-colors" aria-label="Portfolio Command Center - Home">
              Portfolio Command Center
            </Link>
          </div>

          {/* Center: Search trigger */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-bg-card border border-border-subtle rounded-xl w-72 hover:border-border-default transition-colors cursor-pointer group" onClick={toggleSearch} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSearch(); } }} aria-label="Open search (Ctrl+K)">
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
                aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
                aria-expanded={notifOpen}
                aria-haspopup="dialog"
              >
                <Bell className="w-5 h-5 text-text-secondary" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-cyan rounded-full" aria-hidden="true" />
                )}
              </motion.button>
              <NotificationsPanel
                open={notifOpen}
                onClose={handleNotifClose}
                notifications={notificationsWithRead}
                onMarkRead={(id) => setReadIds(prev => new Set(prev).add(id))}
                onMarkAllRead={() => setReadIds(new Set(notifications.map(n => n.id)))}
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
              aria-expanded={settingsOpen}
              aria-haspopup="dialog"
            >
              <Settings className="w-5 h-5 text-text-secondary" />
            </motion.button>

            {/* Theme toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={cycleTheme}
              className="p-2 rounded-lg hover:bg-bg-elevated transition-colors"
              aria-label={`Current theme: ${theme}. Click to cycle through dark, light, and system.`}
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
        onSettingsChange={onSettingsChange}
      />
    </>
  );
}
