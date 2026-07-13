import * as yaml from 'js-yaml';
import type { Skill } from '../types';

interface YamlSkillCategory {
  name: string;
  icon: string;
  skills: Array<{
    name: string;
    level: number;
  }>;
}

interface YamlSkillsConfig {
  categories: YamlSkillCategory[];
}

const skillModules = import.meta.glob('/public/skills/config.yml', {
  query: '?raw',
  import: 'default',
});

const iconToCategory: Record<string, Skill['category']> = {
  code: 'frontend',
  database: 'backend',
  palette: 'design',
  wrench: 'tools',
};

export async function loadSkillsFromYaml(): Promise<Skill[]> {
  const skills: Skill[] = [];

  for (const [, loader] of Object.entries(skillModules)) {
    try {
      const raw = (await loader()) as string;
      const config = yaml.load(raw) as YamlSkillsConfig;

      if (!config?.categories || !Array.isArray(config.categories)) continue;

      for (const category of config.categories) {
        const categoryKey = iconToCategory[category.icon] ?? 'tools';
        const categorySkills = category.skills || [];

        for (const skill of categorySkills) {
          if (skill && typeof skill.name === 'string' && typeof skill.level === 'number') {
            skills.push({
              name: skill.name,
              level: Math.min(100, Math.max(0, skill.level)),
              category: categoryKey,
            });
          }
        }
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error loading skills from YAML:', error);
      }
    }
  }

  return skills;
}
