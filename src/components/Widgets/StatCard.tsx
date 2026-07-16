import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import { memo, useEffect, useRef } from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  suffix?: string;
  icon: LucideIcon;
  color: 'cyan' | 'violet' | 'emerald' | 'amber' | 'rose';
  description?: string;
}

const colorMap = {
  cyan: {
    icon: 'text-primary-cyan',
    bg: 'bg-primary-cyan/10',
    glow: 'shadow-[0_0_20px_rgba(6,182,212,0.2)]',
    line: 'from-primary-cyan/50 via-primary-cyan/20 to-transparent',
    gradient: 'from-primary-cyan to-primary-cyan/50',
    ring: 'ring-primary-cyan/30',
  },
  violet: {
    icon: 'text-primary-violet',
    bg: 'bg-primary-violet/10',
    glow: 'shadow-[0_0_20px_rgba(139,92,246,0.2)]',
    line: 'from-primary-violet/50 via-primary-violet/20 to-transparent',
    gradient: 'from-primary-violet to-primary-violet/50',
    ring: 'ring-primary-violet/30',
  },
  emerald: {
    icon: 'text-primary-emerald',
    bg: 'bg-primary-emerald/10',
    glow: 'shadow-[0_0_20px_rgba(16,185,129,0.2)]',
    line: 'from-primary-emerald/50 via-primary-emerald/20 to-transparent',
    gradient: 'from-primary-emerald to-primary-emerald/50',
    ring: 'ring-primary-emerald/30',
  },
  amber: {
    icon: 'text-primary-amber',
    bg: 'bg-primary-amber/10',
    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.2)]',
    line: 'from-primary-amber/50 via-primary-amber/20 to-transparent',
    gradient: 'from-primary-amber to-primary-amber/50',
    ring: 'ring-primary-amber/30',
  },
  rose: {
    icon: 'text-primary-rose',
    bg: 'bg-primary-rose/10',
    glow: 'shadow-[0_0_20px_rgba(244,63,94,0.2)]',
    line: 'from-primary-rose/50 via-primary-rose/20 to-transparent',
    gradient: 'from-primary-rose to-primary-rose/50',
    ring: 'ring-primary-rose/30',
  },
};

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const display = useTransform(rounded, (latest) => `${latest}${suffix}`);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      count.set(value);
      return;
    }

    const controls = animate(count, value, {
      duration: 1.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    });
    return controls.stop;
  }, [value, count, isInView]);

  return <motion.span ref={ref}>{display}</motion.span>;
}

function FloatingOrb({ color, delay = 0, style }: { color: 'cyan' | 'violet' | 'emerald'; delay?: number; style?: React.CSSProperties }) {
  // Use CSS animations instead of framer-motion animate() for better performance.
  // CSS animations are GPU-composited and don't require React re-renders or
  // continuous JS animation loops. The prefers-reduced-motion media query in
  // index.css already disables all CSS animations for users who prefer it.

  const colors = {
    cyan: 'bg-primary-cyan/10',
    violet: 'bg-primary-violet/10',
    emerald: 'bg-primary-emerald/10',
  };

  return (
    <div
      style={{ ...style, animation: `float-orb 8s ease-in-out ${delay}s infinite` }}
      className={`absolute rounded-full blur-2xl pointer-events-none ${colors[color]}`}
      aria-hidden="true"
    />
  );
}

export const StatCard = memo(function StatCard({
  title,
  value,
  suffix,
  icon: Icon,
  color,
  description,
}: StatCardProps) {
  const colors = colorMap[color];
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={cardRef}
      whileHover={{ scale: 1.02, y: -3 }}
      transition={{ type: 'spring' as const, stiffness: 300, damping: 25 }}
      className="relative p-6 bg-gradient-to-br from-bg-elevated to-bg-card rounded-2xl border border-border-subtle hover:border-border-default transition-all duration-500 group overflow-hidden"
    >
      {/* Animated background orbs */}
      <FloatingOrb color={color as 'cyan' | 'violet' | 'emerald'} delay={0} style={{ width: '80px', height: '80px', top: '-40px', right: '-40px' }} />
      <FloatingOrb color={color as 'cyan' | 'violet' | 'emerald'} delay={2} style={{ width: '60px', height: '60px', bottom: '-30px', left: '-30px' }} />

      <div className="relative z-10 flex items-start justify-between">
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
          transition={{ type: 'spring' as const, stiffness: 300, damping: 20 }}
          className={`p-3 rounded-xl ${colors.bg} ${colors.glow}`}
        >
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </motion.div>
      </div>

      {/* Animated gradient line at bottom */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r ${colors.line} origin-left`}
        style={{ transformOrigin: 'left center' }}
      />

      {/* Shimmer effect on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${colors.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none`}
        aria-hidden="true"
      />
    </motion.div>
  );
});
