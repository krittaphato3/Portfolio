import React, { useState } from 'react';
import { 
  FolderGit2, 
  Github, 
  Layers, 
  Search, 
  Sparkles, 
  CheckCircle2,
  LayoutGrid,
  ListFilter
} from 'lucide-react';
import { Project, PROJECTS } from '../data/portfolioData';
import { ProjectModal } from './ProjectModal';

const CATEGORIES = [
  'All',
  'AI & Machine Learning',
  'Systems & Infrastructure',
  'Full-Stack & Web',
  'Extensions & Tools',
] as const;

export const ProjectsBento: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'bento' | 'table'>('bento');
  const [sortBy, setSortBy] = useState<'featured' | 'alphabetical' | 'category'>('featured');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const filteredProjects = PROJECTS.filter((project) => {
    const matchesCategory =
      selectedCategory === 'All' || project.category === selectedCategory;
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.techStack.some((tech) =>
        tech.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'featured') {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return (b.stars || 0) - (a.stars || 0);
    } else if (sortBy === 'alphabetical') {
      return a.title.localeCompare(b.title);
    } else {
      return a.category.localeCompare(b.category);
    }
  });

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/25 text-gold-400 text-xs font-mono mb-3">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Curated Engineering Works</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
            Featured Projects &amp; Systems
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mt-2">
            Autonomous AI agent loops, low-level server engines, Chrome MV3 extensions, and high-performance ML platforms built from scratch.
          </p>
        </div>

        {/* Search & View Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="relative min-w-[220px] sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by tech or keyword..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-obsidian-900/90 border border-white/[0.08] focus:border-gold-500/50 text-xs font-mono text-white placeholder:text-slate-500 outline-none transition-all"
            />
          </div>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-obsidian-900/90 border border-white/[0.08] text-xs font-mono text-slate-300 outline-none cursor-pointer hover:border-white/[0.2]"
          >
            <option value="featured">Sort: Featured</option>
            <option value="alphabetical">Sort: Alphabetical</option>
            <option value="category">Sort: Category</option>
          </select>

          {/* View Mode Toggle Button */}
          <div className="flex items-center bg-obsidian-900/90 p-1 rounded-xl border border-white/[0.08]">
            <button
              onClick={() => setViewMode('bento')}
              className={`p-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
                viewMode === 'bento'
                  ? 'bg-gold-500 text-obsidian-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Bento Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
                viewMode === 'table'
                  ? 'bg-gold-500 text-obsidian-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Executive Table View"
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-medium font-mono whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-gold-500 text-obsidian-950 font-bold shadow-[0_0_20px_rgba(212,175,55,0.35)]'
                : 'bg-obsidian-900/60 hover:bg-obsidian-850 text-slate-400 hover:text-white border border-white/[0.06]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* View Mode: Bento Grid vs Executive Table */}
      {viewMode === 'bento' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 grid-flow-dense">
          {filteredProjects.map((project, index) => {
            // Balanced Bento rhythm: index 0 (span 2) + index 1 (span 1) = 3; index 2 (span 1) + index 3 (span 2) = 3.
            // Eliminates empty gaps completely.
            const isWide = selectedCategory === 'All' && searchQuery === '' && (index === 0 || index === 3);

            return (
              <div
                key={project.id}
                className={`group relative rounded-3xl bg-obsidian-900/70 border border-white/[0.08] hover:border-gold-500/40 p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_16px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(212,175,55,0.08)] hover:-translate-y-1 backdrop-blur-md ${
                  isWide ? 'lg:col-span-2 bg-gradient-to-br from-obsidian-900/90 via-obsidian-900/60 to-obsidian-950/80' : ''
                }`}
              >
                {/* Glow Accent */}
                <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-gold-500/10 to-transparent rounded-full blur-3xl pointer-events-none group-hover:from-gold-500/20 transition-all" />

                <div>
                  {/* Meta Header */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-mono tracking-wider uppercase bg-white/[0.05] text-slate-300 border border-white/[0.06]">
                      {project.category}
                    </span>
                    {project.featured && (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-gold-400 px-2 py-0.5 rounded bg-gold-500/10 border border-gold-500/20">
                        <Sparkles className="w-3 h-3" />
                        <span>Flagship</span>
                      </span>
                    )}
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-white group-hover:text-gold-200 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gold-400/90 font-medium mt-1 mb-3">
                    {project.tagline}
                  </p>

                  {/* Description */}
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Quantifiable Impact Metrics HUD */}
                  {project.metrics && project.metrics.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-obsidian-950/90 border border-white/[0.06] mb-4">
                      {project.metrics.map((m, mi) => (
                        <div key={mi} className="text-left font-mono">
                          <div className="text-xs sm:text-sm font-extrabold text-gold-400 tracking-tight">
                            {m.value}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate" title={m.detail}>
                            {m.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Key Highlights */}
                  <div className="space-y-1.5 mb-5">
                    {project.highlights.slice(0, isWide ? 4 : 2).map((h, i) => (
                      <div key={i} className="text-xs text-slate-300 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald shrink-0" />
                        <span className="truncate">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  {/* Tech Stack Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/[0.06] mb-5">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-0.5 rounded-md text-[11px] font-mono text-slate-300 bg-obsidian-950/80 border border-white/[0.06]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action Controls */}
                  <div className="flex items-center justify-between gap-2 pt-2">
                    <button
                      onClick={() => setActiveProject(project)}
                      className="px-3.5 py-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 border border-white/[0.08] hover:border-gold-500/30 text-xs font-semibold text-slate-200 hover:text-white transition-all flex items-center gap-1.5"
                    >
                      <Layers className="w-3.5 h-3.5 text-gold-400" />
                      <span>Inspect Blueprint</span>
                    </button>

                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-obsidian-950/90 hover:bg-gold-500/20 border border-white/[0.08] hover:border-gold-500/40 text-slate-400 hover:text-gold-300 transition-all"
                      aria-label={`View ${project.title} on GitHub`}
                      title="View GitHub Repository"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Executive Compact Table View for Technical Recruiters */
        <div className="rounded-2xl bg-obsidian-900/80 border border-white/[0.08] overflow-hidden backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-obsidian-950/90 border-b border-white/[0.08] text-slate-400 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Project</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Category</th>
                  <th className="py-3.5 px-4 hidden sm:table-cell">Quantifiable Benchmark</th>
                  <th className="py-3.5 px-4 hidden lg:table-cell">Key Innovation</th>
                  <th className="py-3.5 px-4">Core Tech</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredProjects.map((project) => (
                  <tr 
                    key={project.id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white group-hover:text-gold-300 flex items-center gap-1.5">
                        <span>{project.title}</span>
                        {project.featured && (
                          <span className="w-1.5 h-1.5 rounded-full bg-gold-400 inline-block" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 max-w-xs truncate">
                        {project.tagline}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 hidden md:table-cell">
                      <span className="px-2 py-0.5 rounded bg-white/[0.04] text-[10px] text-slate-300 border border-white/[0.06]">
                        {project.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 hidden sm:table-cell">
                      {project.metrics && project.metrics[0] ? (
                        <span className="px-2 py-0.5 rounded bg-gold-500/10 text-gold-300 font-mono text-[11px] font-bold border border-gold-500/20 whitespace-nowrap">
                          {project.metrics[0].value} {project.metrics[0].label}
                        </span>
                      ) : null}
                    </td>
                    <td className="py-3.5 px-4 hidden lg:table-cell text-slate-300 max-w-sm truncate">
                      {project.architectureDetails[0] || project.highlights[0]}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {project.techStack.slice(0, 3).map((t) => (
                          <span key={t} className="px-1.5 py-0.5 rounded bg-obsidian-950 text-[10px] text-slate-400 border border-white/[0.05]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setActiveProject(project)}
                          className="px-2.5 py-1 rounded-lg bg-obsidian-800 hover:bg-gold-500/20 text-slate-300 hover:text-gold-300 border border-white/[0.08]"
                        >
                          Specs
                        </button>
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-obsidian-950 hover:bg-gold-500/20 text-slate-400 hover:text-gold-300 border border-white/[0.06]"
                          title="Open GitHub"
                        >
                          <Github className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Blueprint Deep Dive Modal */}
      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </section>
  );
};
