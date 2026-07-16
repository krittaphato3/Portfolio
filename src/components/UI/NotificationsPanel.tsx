import { useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Check,
  CheckCheck,
  GitBranch,
  Award,
  Server,
  AlertCircle,
  Inbox,
  ExternalLink,
} from 'lucide-react';

/* ----------------------------------------------------------------
   TYPES
   ---------------------------------------------------------------- */
type NotificationType = 'project' | 'cert' | 'system' | 'alert';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  url?: string;
}

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

/* ----------------------------------------------------------------
   TYPE CONFIG
   ---------------------------------------------------------------- */
const typeConfig: Record<
  NotificationType,
  { icon: React.ReactNode; color: string; bgColor: string }
> = {
  project: {
    icon: <GitBranch className="w-4 h-4" />,
    color: 'text-primary-cyan',
    bgColor: 'bg-primary-cyan/10',
  },
  cert: {
    icon: <Award className="w-4 h-4" />,
    color: 'text-primary-violet',
    bgColor: 'bg-primary-violet/10',
  },
  system: {
    icon: <Server className="w-4 h-4" />,
    color: 'text-primary-emerald',
    bgColor: 'bg-primary-emerald/10',
  },
  alert: {
    icon: <AlertCircle className="w-4 h-4" />,
    color: 'text-primary-rose',
    bgColor: 'bg-primary-rose/10',
  },
};

/* ----------------------------------------------------------------
   RELATIVE TIMESTAMP
   ---------------------------------------------------------------- */
function relativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/* ----------------------------------------------------------------
   ANIMATION VARIANTS
   ---------------------------------------------------------------- */
const panelVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 400, damping: 30 },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.98,
    transition: { duration: 0.15, ease: 'easeIn' as const },
  },
};

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

/* ----------------------------------------------------------------
   COMPONENT
   ---------------------------------------------------------------- */
export function NotificationsPanel({
  open,
  onClose,
  notifications,
  onMarkRead,
  onMarkAllRead,
}: NotificationsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close on Escape or click outside
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKey);
    window.addEventListener('mousedown', handleClick);
    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('mousedown', handleClick);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          role="dialog"
          aria-label="Notifications"
          className="absolute top-full right-0 mt-2 w-[380px] max-h-[480px] rounded-2xl border border-border-subtle bg-bg-card/95 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.5),0_0_1px_rgba(255,255,255,0.05)] overflow-hidden z-[60]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-subtle">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary-cyan" />
              <h3 className="text-sm font-semibold text-text-primary">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-primary-cyan/20 text-primary-cyan rounded-full border border-primary-cyan/30">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllRead}
                className="flex items-center gap-1 text-xs text-primary-cyan hover:text-primary-cyan/80 transition-colors"
                aria-label="Mark all notifications as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div
            className="overflow-y-auto overscroll-contain max-h-[380px]"
            role="list"
            aria-label="Notification list"
          >
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="p-3 bg-bg-elevated rounded-2xl mb-3">
                  <Inbox className="w-6 h-6 text-text-dim" />
                </div>
                <p className="text-sm text-text-muted font-medium">
                  All caught up
                </p>
                <p className="text-xs text-text-dim mt-1">
                  No new notifications
                </p>
              </div>
            ) : (
              <motion.div
                variants={listVariants}
                initial="hidden"
                animate="visible"
              >
                {notifications.map((notif) => {
                  const config = typeConfig[notif.type];
                  return (
                    <motion.div
                      key={notif.id}
                      variants={itemVariants}
                      role="listitem"
                      className={`
                        relative flex gap-3 px-5 py-3.5 transition-colors duration-150
                        ${
                          notif.read
                            ? 'hover:bg-bg-elevated/30'
                            : 'bg-primary-cyan/[0.03] hover:bg-bg-elevated/50'
                        }
                        border-b border-border-subtle/50 last:border-b-0
                      `}
                    >
                      {/* Unread indicator */}
                      {!notif.read && (
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary-cyan" />
                      )}

                      {/* Icon */}
                      <div
                        className={`flex-shrink-0 p-2 rounded-xl ${config.bgColor} self-start`}
                      >
                        <span className={config.color}>{config.icon}</span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={`text-sm font-medium leading-snug ${
                              notif.read
                                ? 'text-text-secondary'
                                : 'text-text-primary'
                            }`}
                          >
                            {notif.title}
                          </p>
                          <span className="flex-shrink-0 text-[10px] text-text-dim whitespace-nowrap mt-0.5">
                            {relativeTime(notif.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs text-text-muted mt-0.5 line-clamp-2 leading-relaxed">
                          {notif.description}
                        </p>

                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-2">
                          {!notif.read && (
                            <button
                              onClick={() => onMarkRead(notif.id)}
                              className="flex items-center gap-1 text-[10px] text-text-dim hover:text-primary-cyan transition-colors"
                              aria-label={`Mark "${notif.title}" as read`}
                            >
                              <Check className="w-3 h-3" />
                              Mark read
                            </button>
                          )}
                          {notif.url && (
                            <a
                              href={notif.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-[10px] text-text-dim hover:text-primary-cyan transition-colors"
                              aria-label={`Open "${notif.title}" in new tab`}
                            >
                              <ExternalLink className="w-3 h-3" />
                              Open
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ----------------------------------------------------------------
   HOOK: Generate sample notifications from app data
   ---------------------------------------------------------------- */
export function useSampleNotifications(): Notification[] {
  return useMemo(
    () => [
      {
        id: 'n-1',
        type: 'project',
        title: 'New commit on portfolio',
        description: 'feat: Add search modal component with Cmd+K support',
        timestamp: new Date(Date.now() - 1000 * 60 * 12),
        read: false,
        url: 'https://github.com',
      },
      {
        id: 'n-2',
        type: 'cert',
        title: 'Certification renewed',
        description: 'AWS Solutions Architect Associate renewed successfully',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
        read: false,
      },
      {
        id: 'n-3',
        type: 'system',
        title: 'System status healthy',
        description: 'All portfolio services are operational and responding',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
        read: true,
      },
      {
        id: 'n-4',
        type: 'alert',
        title: 'Token expiring soon',
        description: 'GitHub personal access token expires in 14 days',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        read: true,
      },
      {
        id: 'n-5',
        type: 'project',
        title: 'PR merged',
        description: 'Refactor skills widget to use category grouping',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
        read: true,
      },
    ],
    []
  );
}
