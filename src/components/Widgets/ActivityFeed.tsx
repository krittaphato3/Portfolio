import { motion, useInView } from 'framer-motion';
import { Activity, Award, Pin, Folder, Sparkles, Plus, MapPin, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import type { ActivityItem } from '../../lib/types';
import { useSettings } from '../../hooks/useSettings';
import { useRef, useState } from 'react';

interface ActivityFeedProps {
  activities: ActivityItem[];
  loading: boolean;
  onAddCertificate?: () => void;
  onPinRepo?: () => void;
  onCertClick?: (certId: string) => void;
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
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks === 1 ? '' : 's'} ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;

  const years = Math.floor(days / 365);
  return `${years} year${years === 1 ? '' : 's'} ago`;
}

function ActivityItemComponent({ activity, index, isFirst, isLast, animationsEnabled, onCertClick }: {
  activity: ActivityItem;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  animationsEnabled: boolean;
  onCertClick?: (certId: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const config = typeConfig[activity.type] || typeConfig.update;
  const Icon = config.icon;

  if (!animationsEnabled) {
    return (
      <div ref={ref} className="flex gap-3 group relative">
        <ActivityItemContent activity={activity} config={config} Icon={Icon} isFirst={isFirst} isLast={isLast} onCertClick={onCertClick} />
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 260, damping: 24 }}
      className="flex gap-3 group relative"
      layout
    >
      <ActivityItemContent activity={activity} config={config} Icon={Icon} isFirst={isFirst} isLast={isLast} onCertClick={onCertClick} />
    </motion.div>
  );
}

function ActivityItemContent({ activity, config, Icon, isFirst, isLast, onCertClick }: {
  activity: ActivityItem;
  config: typeof typeConfig[keyof typeof typeConfig];
  Icon: React.ElementType;
  isFirst: boolean;
  isLast: boolean;
  onCertClick?: (certId: string) => void;
}) {
  return (
    <>
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
        <div className={`p-2 rounded-lg ${config.bg} ring-4 ring-bg-card ${isFirst ? 'ring-2 ring-primary-emerald/20' : ''}`}>
          <Icon className={`w-4 h-4 ${config.color}`} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 py-1 pb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm text-text-primary font-medium">{activity.title}</p>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${config.bg} ${config.color} font-medium`}>
            {config.label}
          </span>
        </div>
        <p className="text-xs text-text-muted truncate mt-0.5">{activity.description}</p>
        <div className="flex items-center gap-2 mt-1">
          <time className="text-[11px] text-text-dim">{relativeTime(activity.timestamp)}</time>
          {activity.type === 'cert' && activity.certificateId && onCertClick && (
            <button
              onClick={() => onCertClick(activity.certificateId!)}
              className="text-[10px] text-text-dim/70 hover:text-primary-cyan transition-colors inline-flex items-center gap-0.5 cursor-pointer"
            >
              <ExternalLink className="w-3 h-3" />
              View
            </button>
          )}
          {activity.type !== 'cert' && activity.url && (
            <a
              href={activity.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-text-dim/70 hover:text-primary-cyan transition-colors inline-flex items-center gap-0.5"
            >
              <ExternalLink className="w-3 h-3" />
              View
            </a>
          )}
        </div>
      </div>
    </>
  );
}

export function ActivityFeed({
  activities,
  loading,
  onAddCertificate,
  onPinRepo,
  onCertClick,
}: ActivityFeedProps) {
  const { settings } = useSettings();
  const animationsEnabled = settings.display.animations;
  const [expanded, setExpanded] = useState(false);

  const filteredActivities = activities.filter((activity) => {
    if (activity.type === 'cert' && !settings.notifications.certAlerts) return false;
    if ((activity.type === 'project' || activity.type === 'feature') && !settings.notifications.projectUpdates) return false;
    return true;
  });

  const COLLAPSED_LIMIT = 6;
  const hasMore = filteredActivities.length > COLLAPSED_LIMIT;
  const visibleActivities = expanded ? filteredActivities : filteredActivities.slice(0, COLLAPSED_LIMIT);

  const showPinSuggestion = !loading && activities.length === 0;

  return (
    <div className="p-6 flex flex-col h-full">
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
        <>
          <div
            className={`relative flex-auto ${expanded ? 'max-h-[420px] overflow-y-auto pr-1 scrollbar-thin' : ''}`}
          >
            {visibleActivities.map((activity, index) => (
              <ActivityItemComponent
                key={activity.id}
                activity={activity}
                index={index}
                isFirst={index === 0}
                isLast={index === visibleActivities.length - 1}
                animationsEnabled={animationsEnabled}
                onCertClick={onCertClick}
              />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-auto pt-4 border-t border-border-subtle/50">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-primary-emerald bg-primary-emerald/10 border border-primary-emerald/20 rounded-xl hover:bg-primary-emerald/15 transition-colors"
              >
                {expanded ? (
                  <>
                    Show Less
                    <ChevronUp className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    Show All ({filteredActivities.length})
                    <ChevronDown className="w-3.5 h-3.5" />
                  </>
                )}
              </motion.button>
            </div>
          )}
        </>
      )}
    </div>
  );
}