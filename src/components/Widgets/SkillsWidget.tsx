import { motion, useInView } from 'framer-motion';
import { Code2, Database, Cpu, Shield, Brain, Palette, Wrench, ChevronDown, ChevronUp } from 'lucide-react';
import { useRef, useState } from 'react';
import type { Skill } from '../../lib/types';
import { useSettings } from '../../hooks/useSettings';

interface SkillsWidgetProps {
  skills: Skill[];
  loading?: boolean;
}

const categoryIcons = {
  frontend: Code2,
  backend: Database,
  systems: Cpu,
  security: Shield,
  ai: Brain,
  design: Palette,
  tools: Wrench,
} as const;

type CategoryKey = keyof typeof categoryIcons;

const categoryStyles: Record<CategoryKey, {
  iconColor: string;
  chipBg: string;
  chipText: string;
  chipBorder: string;
  chipHover: string;
  glow: string;
}> = {
  frontend: {
    iconColor: 'text-primary-cyan',
    chipBg: 'bg-primary-cyan/10',
    chipText: 'text-primary-cyan',
    chipBorder: 'border-primary-cyan/20',
    chipHover: 'hover:bg-primary-cyan/20',
    glow: 'shadow-[0_0_15px_rgba(6,182,212,0.15)]',
  },
  backend: {
    iconColor: 'text-primary-violet',
    chipBg: 'bg-primary-violet/10',
    chipText: 'text-primary-violet',
    chipBorder: 'border-primary-violet/20',
    chipHover: 'hover:bg-primary-violet/20',
    glow: 'shadow-[0_0_15px_rgba(139,92,246,0.15)]',
  },
  systems: {
    iconColor: 'text-primary-amber',
    chipBg: 'bg-primary-amber/10',
    chipText: 'text-primary-amber',
    chipBorder: 'border-primary-amber/20',
    chipHover: 'hover:bg-primary-amber/20',
    glow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]',
  },
  security: {
    iconColor: 'text-primary-rose',
    chipBg: 'bg-primary-rose/10',
    chipText: 'text-primary-rose',
    chipBorder: 'border-primary-rose/20',
    chipHover: 'hover:bg-primary-rose/20',
    glow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)]',
  },
  ai: {
    iconColor: 'text-purple-400',
    chipBg: 'bg-purple-500/10',
    chipText: 'text-purple-400',
    chipBorder: 'border-purple-500/20',
    chipHover: 'hover:bg-purple-500/20',
    glow: 'shadow-[0_0_15px_rgba(168,85,247,0.15)]',
  },
  design: {
    iconColor: 'text-primary-emerald',
    chipBg: 'bg-primary-emerald/10',
    chipText: 'text-primary-emerald',
    chipBorder: 'border-primary-emerald/20',
    chipHover: 'hover:bg-primary-emerald/20',
    glow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]',
  },
  tools: {
    iconColor: 'text-primary-amber',
    chipBg: 'bg-primary-amber/10',
    chipText: 'text-primary-amber',
    chipBorder: 'border-primary-amber/20',
    chipHover: 'hover:bg-primary-amber/20',
    glow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]',
  },
};

const categoryOrder: CategoryKey[] = ['frontend', 'backend', 'systems', 'security', 'ai', 'design', 'tools'];
const categoryLabels: Record<CategoryKey, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  systems: 'Systems & Low-Level',
  security: 'Cyber Security',
  ai: 'AI / ML Engineering',
  design: 'Design',
  tools: 'Tools & DevOps',
};

interface SkillChipProps {
  skill: Skill;
  styles: typeof categoryStyles.frontend;
  index: number;
  animationsEnabled: boolean;
}

function SkillChip({ skill, styles, index, animationsEnabled }: SkillChipProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  if (!animationsEnabled) {
    return (
      <div
        ref={ref}
        className={`
          px-2.5 py-1 rounded-lg text-xs font-medium cursor-default
          ${styles.chipBg} ${styles.chipText}
          border ${styles.chipBorder}
          ${styles.chipHover} transition-colors duration-200
        `}
      >
        {skill.name}
        <span className="ml-1.5 text-text-dim opacity-70">{skill.level}%</span>
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 20 }}
      transition={{ delay: index * 0.04, type: 'spring', stiffness: 300, damping: 25 }}
      whileHover={{ scale: 1.05, y: -2, boxShadow: styles.glow, transition: { type: 'spring' as const, stiffness: 300, damping: 25 } }}
      className={`
        px-2.5 py-1 rounded-lg text-xs font-medium cursor-default
        ${styles.chipBg} ${styles.chipText}
        border ${styles.chipBorder}
        ${styles.chipHover} transition-all duration-200
      `}
    >
      {skill.name}
      <span className="ml-1.5 text-text-dim opacity-70">{skill.level}%</span>
    </motion.div>
  );
}

interface CategorySectionProps {
  category: CategoryKey;
  skills: Skill[];
  index: number;
  animationsEnabled: boolean;
}

function CategorySection({ category, skills, index, animationsEnabled }: CategorySectionProps) {
  const Icon = categoryIcons[category];
  const styles = categoryStyles[category];
  const label = categoryLabels[category];

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  if (!Icon || !styles) return null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ delay: index * 0.12, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="space-y-2.5"
    >
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-lg ${styles.chipBg} ${styles.glow}`}>
          <Icon className={`w-4 h-4 ${styles.iconColor}`} />
        </div>
        <span className="text-[11px] text-text-secondary capitalize font-medium">{label}</span>
        <span className="text-[11px] text-text-dim font-normal">
          ({skills.length} skills)
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, skillIndex) => (
          <SkillChip
            key={skill.name}
            skill={skill}
            styles={styles}
            index={skillIndex}
            animationsEnabled={animationsEnabled}
          />
        ))}
      </div>
    </motion.div>
  );
}

export function SkillsWidget({ skills, loading = false }: SkillsWidgetProps) {
  const { settings } = useSettings();
  const animationsEnabled = settings.display.animations;
  const [expanded, setExpanded] = useState(false);

  // Group skills by category
  const grouped = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>
  );

  const activeCategories = categoryOrder.filter((cat) => grouped[cat] && grouped[cat].length > 0);
  const COLLAPSED_LIMIT = 3;
  const hasMore = activeCategories.length > COLLAPSED_LIMIT;
  const visibleCategories = expanded ? activeCategories : activeCategories.slice(0, COLLAPSED_LIMIT);
  const totalSkills = skills.length;

  const content = loading ? (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i}>
          <div className="h-3 w-16 bg-bg-elevated rounded mb-2.5 animate-pulse" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, j) => (
              <div key={j} className="h-7 w-24 bg-bg-elevated rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      ))}
    </div>
  ) : Object.keys(grouped).length === 0 ? (
    <div className="py-8 text-center">
      <Code2 className="w-8 h-8 mx-auto mb-3 text-text-dim" />
      <p className="text-sm text-text-muted">No skills loaded yet.</p>
    </div>
  ) : (
    <>
      <div className={`flex-1 min-h-0 ${expanded ? 'max-h-[600px] overflow-y-auto pr-1 scrollbar-thin' : ''}`}>
        <div className="space-y-4">
          {visibleCategories.map((category, index) => (
            <CategorySection
              key={category}
              category={category}
              skills={grouped[category]}
              index={index}
              animationsEnabled={animationsEnabled}
            />
          ))}
        </div>
      </div>

      {hasMore && (
        <div className="flex justify-center mt-auto pt-4 border-t border-border-subtle/50">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-primary-violet bg-primary-violet/10 border border-primary-violet/20 rounded-xl hover:bg-primary-violet/15 transition-colors"
          >
            {expanded ? (
              <>
                Show Less
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                All Skills ({totalSkills})
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </motion.button>
        </div>
      )}
    </>
  );

  return (
    <div className="h-full p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-primary-violet/10 rounded-xl">
          <Code2 className="w-5 h-5 text-primary-violet" />
        </div>
        <div>
          <h3 className="text-text-primary font-semibold">Skills</h3>
          <p className="text-xs text-text-muted">Technical expertise</p>
        </div>
      </div>

      {content}
    </div>
  );
}