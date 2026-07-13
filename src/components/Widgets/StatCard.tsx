import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  suffix?: string;
  icon: LucideIcon;
  color: 'cyan' | 'violet' | 'emerald';
  description?: string;
}

const colorMap = {
  cyan: {
    icon: 'text-primary-cyan',
    bg: 'bg-primary-cyan/10',
    glow: 'shadow-[0_0_20px_rgba(6,182,212,0.2)]',
    line: 'from-primary-cyan/50 via-primary-cyan/20 to-transparent',
  },
  violet: {
    icon: 'text-primary-violet',
    bg: 'bg-primary-violet/10',
    glow: 'shadow-[0_0_20px_rgba(139,92,246,0.2)]',
    line: 'from-primary-violet/50 via-primary-violet/20 to-transparent',
  },
  emerald: {
    icon: 'text-primary-emerald',
    bg: 'bg-primary-emerald/10',
    glow: 'shadow-[0_0_20px_rgba(16,185,129,0.2)]',
    line: 'from-primary-emerald/50 via-primary-emerald/20 to-transparent',
  },
};

function AnimatedNumber({
  value,
  suffix = '',
}: {
  value: number;
  suffix?: string;
}) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const display = useTransform(rounded, (latest) => `${latest}${suffix}`);

  useEffect(() => {
    // Respect prefers-reduced-motion for accessibility (WCAG 2.1 SC 2.3.3)
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      count.set(value);
      return;
    }

    const controls = animate(count, value, {
      duration: 2,
      ease: [0.25, 0.46, 0.45, 0.94],
    });
    return controls.stop;
  }, [value, count]);

  return <motion.span>{display}</motion.span>;
}

export function StatCard({
  title,
  value,
  suffix,
  icon: Icon,
  color,
  description,
}: StatCardProps) {
  const colors = colorMap[color];

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring' as const, stiffness: 300, damping: 20 }}
      className="relative p-6 bg-gradient-to-br from-bg-elevated to-bg-card rounded-2xl border border-border-subtle hover:border-border-default transition-all duration-300 group"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-text-secondary font-medium">{title}</p>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-4xl font-bold text-text-primary tracking-tight">
              <AnimatedNumber value={value} suffix={suffix} />
            </span>
          </div>
          {description && (
            <p className="mt-2 text-xs text-text-muted">{description}</p>
          )}
        </div>
        <motion.div
          whileHover={{ rotate: 12, scale: 1.1 }}
          transition={{ type: 'spring' as const, stiffness: 400, damping: 15 }}
          className={`p-3 rounded-xl ${colors.bg} ${colors.glow}`}
        >
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </motion.div>
      </div>

      {/* Decorative gradient line at bottom */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${colors.line} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />
    </motion.div>
  );
}
