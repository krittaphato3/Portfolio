import { motion } from 'framer-motion';
import { Code2, Database, Palette, Wrench } from 'lucide-react';
import type { Skill } from '../../lib/types';

interface SkillsWidgetProps {
  skills: Skill[];
}

const categoryIcons = {
  frontend: Code2,
  backend: Database,
  design: Palette,
  tools: Wrench,
} as const;

const categoryStyles = {
  frontend: {
    iconColor: 'text-primary-cyan',
    chipBg: 'bg-primary-cyan/10',
    chipText: 'text-primary-cyan',
    chipBorder: 'border-primary-cyan/20',
    chipHover: 'hover:bg-primary-cyan/20',
  },
  backend: {
    iconColor: 'text-primary-violet',
    chipBg: 'bg-primary-violet/10',
    chipText: 'text-primary-violet',
    chipBorder: 'border-primary-violet/20',
    chipHover: 'hover:bg-primary-violet/20',
  },
  design: {
    iconColor: 'text-primary-emerald',
    chipBg: 'bg-primary-emerald/10',
    chipText: 'text-primary-emerald',
    chipBorder: 'border-primary-emerald/20',
    chipHover: 'hover:bg-primary-emerald/20',
  },
  tools: {
    iconColor: 'text-primary-amber',
    chipBg: 'bg-primary-amber/10',
    chipText: 'text-primary-amber',
    chipBorder: 'border-primary-amber/20',
    chipHover: 'hover:bg-primary-amber/20',
  },
} as const;

export function SkillsWidget({ skills }: SkillsWidgetProps) {
  // Group skills by category
  const grouped = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>
  );

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary-violet/10 rounded-xl">
          <Code2 className="w-5 h-5 text-primary-violet" />
        </div>
        <div>
          <h3 className="text-text-primary font-semibold">Skills</h3>
          <p className="text-xs text-text-muted">Technical expertise</p>
        </div>
      </div>

      <div className="space-y-5">
        {Object.entries(grouped).map(([category, catSkills]) => {
          const Icon = categoryIcons[category as keyof typeof categoryIcons];
          const styles =
            categoryStyles[category as keyof typeof categoryStyles];

          if (!Icon || !styles) return null;

          return (
            <div key={category}>
              <div className="flex items-center gap-2 mb-2.5">
                <Icon className={`w-4 h-4 ${styles.iconColor}`} />
                <span className="text-xs text-text-secondary capitalize font-medium">
                  {category}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {catSkills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ scale: 1.06 }}
                    className={`
                      px-3 py-1.5 rounded-lg text-xs font-medium cursor-default
                      ${styles.chipBg} ${styles.chipText}
                      border ${styles.chipBorder}
                      ${styles.chipHover} transition-colors duration-200
                    `}
                  >
                    {skill.name}
                    <span className="ml-1.5 text-text-dim opacity-70">
                      {skill.level}%
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
