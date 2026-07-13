import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface DashboardProps {
  children: ReactNode;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

export function Dashboard({ children }: DashboardProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="min-h-screen bg-bg-dark p-4 md:p-6 lg:p-8"
    >
      <div className="max-w-[1600px] mx-auto">
        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6 auto-rows-min">
          {children}
        </div>
      </div>
    </motion.div>
  );
}

/* ----------------------------------------------------------------
   BENTO ITEM WRAPPER
   ---------------------------------------------------------------- */
interface BentoItemProps {
  children: ReactNode;
  className?: string;
  span?: {
    col?: 1 | 2 | 3 | 4;
    row?: 1 | 2;
  };
}

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 260,
      damping: 24,
    },
  },
};

const spanClasses: Record<number, string> = {
  1: 'md:col-span-1',
  2: 'md:col-span-2',
  3: 'md:col-span-3',
  4: 'md:col-span-4',
};

const rowClasses: Record<number, string> = {
  1: 'md:row-span-1',
  2: 'md:row-span-2',
};

export function BentoItem({ children, className = '', span }: BentoItemProps) {
  const colSpan = span?.col ?? 1;
  const rowSpan = span?.row ?? 1;

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{
        y: -2,
        transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
      }}
      className={`
        ${spanClasses[colSpan]}
        ${rowClasses[rowSpan]}
        gradient-border-wrapper
        bg-bg-card rounded-2xl
        border border-border-subtle
        overflow-hidden
        transition-shadow duration-500
        hover:shadow-[0_8px_40px_rgba(6,182,212,0.07),0_0px_80px_rgba(139,92,246,0.04)]
        relative
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
