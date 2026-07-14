import { useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sun,
  Moon,
  Monitor,
  Bell,
  BellOff,
  Minimize2,
  Sparkles,
  Cloud,
  Palette,
  Layout,
} from 'lucide-react';

/* ----------------------------------------------------------------
   TYPES
   ---------------------------------------------------------------- */
export type ThemeMode = 'dark' | 'light' | 'system';

export interface SettingsState {
  theme: ThemeMode;
  notifications: {
    projectUpdates: boolean;
    certAlerts: boolean;
    systemStatus: boolean;
  };
  display: {
    compactMode: boolean;
    animations: boolean;
    ambientEffects: boolean;
  };
}

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
  settings: SettingsState;
  onSettingsChange: (settings: SettingsState) => void;
}

/* ----------------------------------------------------------------
   DEFAULT SETTINGS
   ---------------------------------------------------------------- */
export const defaultSettings: SettingsState = {
  theme: 'dark',
  notifications: {
    projectUpdates: true,
    certAlerts: true,
    systemStatus: false,
  },
  display: {
    compactMode: false,
    animations: true,
    ambientEffects: true,
  },
};

/* ----------------------------------------------------------------
   PANEL ANIMATION
   ---------------------------------------------------------------- */
const panelVariants = {
  hidden: {
    x: '100%',
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: 'easeIn' as const,
    },
  },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

/* ----------------------------------------------------------------
   TOGGLE COMPONENT
   ---------------------------------------------------------------- */
function Toggle({
  checked,
  onChange,
  label,
  disabled = false,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors duration-200
        ${checked ? 'bg-primary-cyan' : 'bg-bg-elevated border border-border-subtle'}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <motion.span
        layout
        transition={{ type: 'spring' as const, stiffness: 500, damping: 30 }}
        className={`
          inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm
          ${checked ? 'ml-[18px]' : 'ml-[3px]'}
        `}
      />
    </button>
  );
}

/* ----------------------------------------------------------------
   SETTINGS PANEL
   ---------------------------------------------------------------- */
export function SettingsPanel({
  open,
  onClose,
  settings,
  onSettingsChange,
}: SettingsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  // Focus trap
  useEffect(() => {
    if (open && panelRef.current) {
      panelRef.current.focus();
    }
  }, [open]);

  const updateTheme = useCallback(
    (theme: ThemeMode) => {
      onSettingsChange({ ...settings, theme });
    },
    [settings, onSettingsChange]
  );

  const toggleNotification = useCallback(
    (key: keyof SettingsState['notifications']) => {
      onSettingsChange({
        ...settings,
        notifications: {
          ...settings.notifications,
          [key]: !settings.notifications[key],
        },
      });
    },
    [settings, onSettingsChange]
  );

  const toggleDisplay = useCallback(
    (key: keyof SettingsState['display']) => {
      onSettingsChange({
        ...settings,
        display: {
          ...settings.display,
          [key]: !settings.display[key],
        },
      });
    },
    [settings, onSettingsChange]
  );

  const themeOptions: { value: ThemeMode; icon: React.ReactNode; label: string }[] = [
    { value: 'dark', icon: <Moon className="w-4 h-4" />, label: 'Dark' },
    { value: 'light', icon: <Sun className="w-4 h-4" />, label: 'Light' },
    { value: 'system', icon: <Monitor className="w-4 h-4" />, label: 'System' },
  ];

  const notifItems: {
    key: keyof SettingsState['notifications'];
    icon: React.ReactNode;
    label: string;
    description: string;
  }[] = [
    {
      key: 'projectUpdates',
      icon: <Sparkles className="w-4 h-4 text-primary-cyan" />,
      label: 'Project Updates',
      description: 'New commits, releases, and PR activity',
    },
    {
      key: 'certAlerts',
      icon: <Bell className="w-4 h-4 text-primary-violet" />,
      label: 'Certification Alerts',
      description: 'Expiry reminders and new credentials',
    },
    {
      key: 'systemStatus',
      icon: <BellOff className="w-4 h-4 text-primary-emerald" />,
      label: 'System Status',
      description: 'Service health and uptime reports',
    },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70]"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Settings"
            tabIndex={-1}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-y-0 right-0 w-full max-w-md bg-bg-card/95 backdrop-blur-xl border-l border-border-subtle shadow-[-24px_0_80px_rgba(0,0,0,0.4)] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-border-subtle bg-bg-card/90 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-cyan/10 rounded-xl">
                  <Palette className="w-5 h-5 text-primary-cyan" />
                </div>
                <div>
                  <h2 className="text-text-primary font-semibold text-base">
                    Settings
                  </h2>
                  <p className="text-xs text-text-muted">
                    Customize your experience
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-bg-elevated transition-colors text-text-muted hover:text-text-primary"
                aria-label="Close settings"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="px-6 py-6 space-y-8">
              {/* ---- Theme Section ---- */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Moon className="w-4 h-4 text-primary-violet" />
                  <h3 className="text-sm font-semibold text-text-primary">
                    Theme
                  </h3>
                </div>
                <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Theme selection">
                  {themeOptions.map((opt) => (
                    <motion.button
                      key={opt.value}
                      role="radio"
                      aria-checked={settings.theme === opt.value}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => updateTheme(opt.value)}
                      className={`
                        flex flex-col items-center gap-2 py-3 px-2 rounded-xl border text-xs font-medium transition-all duration-200
                        ${
                          settings.theme === opt.value
                            ? 'bg-primary-cyan/10 border-primary-cyan/30 text-primary-cyan shadow-[0_0_16px_rgba(6,182,212,0.12)]'
                            : 'bg-bg-elevated border-border-subtle text-text-secondary hover:border-border-default'
                        }
                      `}
                    >
                      {opt.icon}
                      {opt.label}
                    </motion.button>
                  ))}
                </div>
              </section>

              {/* ---- Notifications Section ---- */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Bell className="w-4 h-4 text-primary-emerald" />
                  <h3 className="text-sm font-semibold text-text-primary">
                    Notifications
                  </h3>
                </div>
                <div className="space-y-3">
                  {notifItems.map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between p-3 rounded-xl bg-bg-elevated border border-border-subtle"
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <div>
                          <p className="text-sm text-text-primary font-medium">
                            {item.label}
                          </p>
                          <p className="text-xs text-text-muted">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <Toggle
                        checked={settings.notifications[item.key]}
                        onChange={() => toggleNotification(item.key)}
                        label={`Toggle ${item.label}`}
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* ---- Display Section ---- */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Layout className="w-4 h-4 text-primary-amber" />
                  <h3 className="text-sm font-semibold text-text-primary">
                    Display
                  </h3>
                </div>
                <div className="space-y-3">
                  {/* Compact Mode */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-bg-elevated border border-border-subtle">
                    <div className="flex items-center gap-3">
                      <Minimize2 className="w-4 h-4 text-primary-amber" />
                      <div>
                        <p className="text-sm text-text-primary font-medium">
                          Compact Mode
                        </p>
                        <p className="text-xs text-text-muted">
                          Reduce spacing and card sizes
                        </p>
                      </div>
                    </div>
                    <Toggle
                      checked={settings.display.compactMode}
                      onChange={() => toggleDisplay('compactMode')}
                      label="Toggle compact mode"
                    />
                  </div>

                  {/* Animations */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-bg-elevated border border-border-subtle">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-4 h-4 text-primary-emerald" />
                      <div>
                        <p className="text-sm text-text-primary font-medium">
                          Animations
                        </p>
                        <p className="text-xs text-text-muted">
                          Enable motion and transitions
                        </p>
                      </div>
                    </div>
                    <Toggle
                      checked={settings.display.animations}
                      onChange={() => toggleDisplay('animations')}
                      label="Toggle animations"
                    />
                  </div>

                  {/* Ambient Effects */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-bg-elevated border border-border-subtle">
                    <div className="flex items-center gap-3">
                      <Cloud className="w-4 h-4 text-primary-cyan" />
                      <div>
                        <p className="text-sm text-text-primary font-medium">
                          Ambient Effects
                        </p>
                        <p className="text-xs text-text-muted">
                          Noise grain and floating gradient orbs
                        </p>
                      </div>
                    </div>
                    <Toggle
                      checked={settings.display.ambientEffects}
                      onChange={() => toggleDisplay('ambientEffects')}
                      label="Toggle ambient effects"
                    />
                  </div>
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 px-6 py-4 border-t border-border-subtle bg-bg-card/90 backdrop-blur-xl">
              <p className="text-xs text-text-dim text-center">
                Settings are saved to local storage
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
