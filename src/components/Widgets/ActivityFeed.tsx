import { motion } from 'framer-motion';
import { Activity, Award, Pin, Folder, Sparkles, Plus, MapPin, ExternalLink } from 'lucide-react';
import type { ActivityItem } from '../../lib/types';

interface ActivityFeedProps {
  activities: ActivityItem[];
  loading: boolean;
  onAddCertificate?: () => void;
  onPinRepo?: () => void;
}

const typeConfig = {
  cert: {
    icon: Award,
    color: 'text-primary-violet',
    bg: 'bg-primary-violet/10',
    dot: 'bg-primary-violet',
    label: 'Cert',
  },
  feature: {
    icon: Pin,
    color: 'text-primary-amber',
    bg: 'bg-primary-amber/10',
    dot: 'bg-primary-amber',
    label: 'Feature',
  },
  project: {
    icon: Folder,
    color: 'text-primary-cyan',
    bg: 'bg-primary-cyan/10',
    dot: 'bg-primary-cyan',
    label: 'Project',
  },
  update: {
    icon: Sparkles,
    color: 'text-primary-emerald',
    bg: 'bg-primary-emerald/10',
    dot: 'bg-primary-emerald',
    label: 'Update',
  },
} as const;

function relativeTime(date: Date): string {
  const now = Date.now();
  const then = date.getTime();
  const diffMs = now - then;

  if (diffMs < 0) return 'just now';

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return 'just now';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks === 1 ? '' : 's'} ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;

  const years = Math.floor(days / 365);
  return `${years} year${years === 1 ? '' : 's'} ago`;
}

export function ActivityFeed({
  activities,
  loading,
  onAddCertificate,
  onPinRepo,
}: ActivityFeedProps) {
  const showPinSuggestion = !loading && activities.length === 0;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-emerald/10 rounded-xl">
            <Activity className="w-5 h-5 text-primary-emerald" />
          </div>
          <div>
            <h3 className="text-text-primary font-semibold">Recent Updates</h3>
            <p className="text-xs text-text-muted">Latest changes</p>
          </div>
        </div>
        {onAddCertificate && (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onAddCertificate}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary-emerald/10 text-primary-emerald border border-primary-emerald/20 rounded-lg hover:bg-primary-emerald/20 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Certificate
          </motion.button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-lg bg-bg-elevated flex-shrink-0" />
              <div className="flex-1">
                <div className="h-3 bg-bg-elevated rounded w-2/3 mb-2" />
                <div className="h-2 bg-bg-elevated rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : showPinSuggestion ? (
        <div className="py-6 text-center">
          <MapPin className="w-8 h-8 mx-auto mb-3 text-text-dim" />
          <p className="text-sm text-text-muted mb-3">No pinned repositories yet.</p>
          {onPinRepo && (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onPinRepo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary-amber/10 text-primary-amber border border-primary-amber/20 rounded-lg hover:bg-primary-amber/20 transition-colors"
            >
              <Pin className="w-3.5 h-3.5" />
              Pin Repository
            </motion.button>
          )}
        </div>
      ) : (
        <div className="relative">
          {activities.map((activity, index) => {
            const config = typeConfig[activity.type] || typeConfig.update;
            const Icon = config.icon;
            const isFirst = index === 0;
            const isLast = index === activities.length - 1;

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                className="flex gap-3 group relative"
              >
                {/* Timeline connector */}
                {!isLast && (
                  <div
                    className="absolute left-[15px] top-[36px] w-[2px] h-[calc(100%-12px)]"
                    style={{
                      background: isFirst
                        ? 'linear-gradient(to bottom, var(--color-primary-emerald), var(--color-border-subtle))'
                        : 'var(--color-border-subtle)',
                    }}
                  />
                )}

                {/* Icon node */}
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className={`p-2 rounded-lg ${config.bg} ring-4 ring-bg-card ${
                      isFirst ? 'ring-2 ring-primary-emerald/20' : ''
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 py-1 pb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm text-text-primary font-medium">
                      {activity.title}
                    </p>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${config.bg} ${config.color} font-medium`}
                    >
                      {config.label}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted truncate mt-0.5">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <time className="text-[11px] text-text-dim">
                      {relativeTime(activity.timestamp)}
                    </time>
                    {activity.url && (
                      <a
                        href={activity.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-text-dim hover:text-primary-cyan transition-colors inline-flex items-center gap-0.5"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
