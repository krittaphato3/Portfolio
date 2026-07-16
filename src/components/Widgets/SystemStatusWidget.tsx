import { motion } from 'framer-motion';
import { memo } from 'react';
import { Cpu, HardDrive, Wifi, Zap } from 'lucide-react';

interface SystemMetric {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
  progress: number;
}

const metrics: SystemMetric[] = [
  {
    label: 'TypeScript',
    value: 'Expert',
    icon: Cpu,
    color: 'cyan',
    progress: 95,
  },
  {
    label: 'React / Next.js',
    value: 'Advanced',
    icon: Zap,
    color: 'violet',
    progress: 88,
  },
  {
    label: 'Node.js',
    value: 'Advanced',
    icon: HardDrive,
    color: 'emerald',
    progress: 85,
  },
  {
    label: 'DevOps',
    value: 'Intermediate',
    icon: Wifi,
    color: 'amber',
    progress: 72,
  },
];

const colorStyles = {
  cyan: {
    icon: 'text-primary-cyan',
    barFrom: 'from-primary-cyan',
    barTo: 'to-primary-cyan/60',
    glow: 'shadow-[0_0_8px_rgba(6,182,212,0.4)]',
  },
  violet: {
    icon: 'text-primary-violet',
    barFrom: 'from-primary-violet',
    barTo: 'to-primary-violet/60',
    glow: 'shadow-[0_0_8px_rgba(139,92,246,0.4)]',
  },
  emerald: {
    icon: 'text-primary-emerald',
    barFrom: 'from-primary-emerald',
    barTo: 'to-primary-emerald/60',
    glow: 'shadow-[0_0_8px_rgba(16,185,129,0.4)]',
  },
  amber: {
    icon: 'text-primary-amber',
    barFrom: 'from-primary-amber',
    barTo: 'to-primary-amber/60',
    glow: 'shadow-[0_0_8px_rgba(245,158,11,0.4)]',
  },
} as const;

export const SystemStatusWidget = memo(function SystemStatusWidget() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary-cyan/10 rounded-xl">
          <Cpu className="w-5 h-5 text-primary-cyan" />
        </div>
        <div>
          <h3 className="text-text-primary font-semibold">Tech Proficiency</h3>
          <p className="text-xs text-text-muted">Skill levels</p>
        </div>
      </div>

      <div className="space-y-5">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const styles =
            colorStyles[metric.color as keyof typeof colorStyles];

          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${styles.icon}`} />
                  <span className="text-sm text-text-secondary">
                    {metric.label}
                  </span>
                </div>
                <span className="text-xs text-text-muted font-medium">
                  {metric.value}
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-border-subtle rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.progress}%` }}
                  transition={{
                    duration: 1.2,
                    delay: 0.4 + index * 0.12,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className={`h-full bg-gradient-to-r ${styles.barFrom} ${styles.barTo} rounded-full ${styles.glow}`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});
