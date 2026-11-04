import React from 'react';
import { Cpu, Code2, Server, Layout, Sparkles } from 'lucide-react';
import { SKILL_CATEGORIES } from '../data/portfolioData';

export const TechStackMatrix: React.FC = () => {
  const getCategoryIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Code2 className="w-5 h-5 text-gold-400" />;
      case 1:
        return <Sparkles className="w-5 h-5 text-brand-cyan" />;
      case 2:
        return <Server className="w-5 h-5 text-brand-emerald" />;
      default:
        return <Layout className="w-5 h-5 text-brand-violet" />;
    }
  };

  return (
    <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/25 text-gold-400 text-xs font-mono mb-3">
          <Cpu className="w-3.5 h-3.5" />
          <span>Engineering Competencies</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
          Technical Stack & Skills
        </h2>
        <p className="text-slate-400 text-sm sm:text-base mt-2">
          From low-level systems programming in C++ and Java to autonomous multi-agent tool calling in TypeScript and Python.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SKILL_CATEGORIES.map((cat, idx) => (
          <div
            key={cat.title}
            className="rounded-3xl bg-obsidian-900/70 border border-white/[0.08] p-6 sm:p-8 backdrop-blur-md relative overflow-hidden group hover:border-gold-500/30 transition-all duration-300"
          >
            {/* Ambient Backlight */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-gold-500/5 to-transparent rounded-full blur-2xl pointer-events-none group-hover:from-gold-500/15 transition-all" />

            {/* Header */}
            <div className="flex items-center gap-3.5 mb-4">
              <div className="p-3 rounded-2xl bg-obsidian-950 border border-white/[0.08] shadow-inner">
                {getCategoryIcon(idx)}
              </div>
              <div>
                <h3 className="text-xl font-bold font-display text-white">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {cat.description}
                </p>
              </div>
            </div>

            {/* Skills Bars / Badges */}
            <div className="space-y-3.5 pt-4 border-t border-white/[0.06]">
              {cat.skills.map((skill) => (
                <div key={skill.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="flex items-center gap-1.5 text-slate-200">
                      {skill.highlight && (
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-400 inline-block" />
                      )}
                      <span className={skill.highlight ? 'font-semibold text-white' : ''}>
                        {skill.name}
                      </span>
                    </span>
                    <span className="text-slate-500 text-[11px]">{skill.level}%</span>
                  </div>
                  {/* Progress Bar Track */}
                  <div className="h-1.5 w-full bg-obsidian-950 rounded-full overflow-hidden border border-white/[0.04]">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        skill.highlight
                          ? 'bg-gradient-to-r from-gold-500 to-gold-400 shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                          : 'bg-slate-600'
                      }`}
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
