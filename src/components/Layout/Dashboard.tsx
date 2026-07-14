import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import type { ReactNode } from 'react';
import { useRef } from 'react';

interface DashboardProps {
  children: ReactNode;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
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

/* ---------------------------------------------------------------
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
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { scrollY } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollY, [0, 1], [0, 20]);

  const colSpan = span?.col ?? 1;
  const rowSpan = span?.row ?? 1;

  return (
    <motion.div
      ref={ref}
      variants={itemVariants}
      initial="hidden"
      animate={isInView ? 'show' : 'hidden'}
      whileHover={{
        y: -2,
        transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
      }}
      style={{ y }}
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

/* ---------------------------------------------------------------
   SCROLL-REVEAL WRAPPER FOR SECTIONS
   ---------------------------------------------------------------- */
interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollReveal({ children, className = '', delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ---------------------------------------------------------------
   STAGGERED CHILDREN CONTAINER
   ---------------------------------------------------------------- */
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}

export function StaggerContainer({ children, className = '', stagger = 0.08, delay = 0 }: StaggerContainerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: stagger,
            delayChildren: delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/* ---------------------------------------------------------------
   STAGGER ITEM
   ---------------------------------------------------------------- */
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className = '' }: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        show: {
          opacity: 1,
          y: 0,
          transition: { type: 'spring' as const, stiffness: 260, damping: 24 },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}