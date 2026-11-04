import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Github, 
  Cpu, 
  CheckCircle2, 
  Layers, 
  FileText, 
  Copy, 
  Check, 
  Code2
} from 'lucide-react';
import { Project } from '../data/portfolioData';
import { PROJECT_READMES } from '../data/projectReadmes';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState<'readme' | 'blueprint'>('readme');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!project) return;
    setActiveTab('readme');
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [project]);

  if (!project) return null;

  const readmeMarkdown = PROJECT_READMES[project.id] || `# ${project.title}\n\n${project.description}\n\n## Architecture\n${project.architectureDetails.join('\n\n')}`;

  const handleCopyReadme = () => {
    navigator.clipboard.writeText(readmeMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to render basic markdown elements cleanly into styled JSX
  const renderMarkdownContent = (md: string) => {
    const lines = md.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];
    let codeLanguage = '';

    lines.forEach((line, index) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // Closing code block
          elements.push(
            <div key={`code-${index}`} className="my-3 rounded-xl bg-obsidian-950 border border-white/[0.08] p-4 font-mono text-xs text-slate-300 overflow-x-auto">
              {codeLanguage && (
                <div className="text-[10px] text-gold-400/80 uppercase mb-2 border-b border-white/[0.06] pb-1 font-semibold">
                  {codeLanguage}
                </div>
              )}
              <pre className="leading-relaxed whitespace-pre font-mono">{codeBlockContent.join('\n')}</pre>
            </div>
          );
          codeBlockContent = [];
          inCodeBlock = false;
          codeLanguage = '';
        } else {
          // Opening code block
          inCodeBlock = true;
          codeLanguage = line.replace('```', '').trim();
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }

      const trimmed = line.trim();

      if (trimmed.startsWith('# ')) {
        elements.push(
          <h1 key={index} className="text-xl sm:text-2xl font-bold font-display text-white mt-4 mb-2 pb-2 border-b border-white/[0.08]">
            {trimmed.replace('# ', '')}
          </h1>
        );
      } else if (trimmed.startsWith('## ')) {
        elements.push(
          <h2 key={index} className="text-lg sm:text-xl font-bold font-display text-gold-300 mt-5 mb-2 pb-1 border-b border-white/[0.06]">
            {trimmed.replace('## ', '')}
          </h2>
        );
      } else if (trimmed.startsWith('### ')) {
        elements.push(
          <h3 key={index} className="text-sm sm:text-base font-semibold text-brand-cyan mt-4 mb-1.5">
            {trimmed.replace('### ', '')}
          </h3>
        );
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        elements.push(
          <div key={index} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300 ml-2 my-1 leading-relaxed">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-2 shrink-0" />
            <span>{trimmed.substring(2)}</span>
          </div>
        );
      } else if (trimmed.startsWith('> ')) {
        elements.push(
          <blockquote key={index} className="p-3 my-2 rounded-r-xl border-l-2 border-gold-400 bg-obsidian-950/60 text-xs sm:text-sm text-slate-300 italic">
            {trimmed.replace('> ', '')}
          </blockquote>
        );
      } else if (trimmed === '---') {
        elements.push(<hr key={index} className="my-4 border-white/[0.08]" />);
      } else if (trimmed.length > 0) {
        elements.push(
          <p key={index} className="text-xs sm:text-sm text-slate-300 my-2 leading-relaxed">
            {trimmed}
          </p>
        );
      }
    });

    return elements;
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-200 overscroll-contain print:hidden"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl h-[88vh] flex flex-col rounded-3xl bg-[#0a0b12] border border-white/[0.15] shadow-[0_30px_90px_rgba(0,0,0,0.98)] overflow-hidden overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="px-6 py-4 bg-obsidian-950 border-b border-white/[0.08] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-obsidian-800 border border-white/[0.08] text-gold-400">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-display text-white">
                  {project.title}
                </h3>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider bg-gold-500/15 text-gold-300 border border-gold-500/30">
                  {project.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {project.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyReadme}
              className="p-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 border border-white/[0.08] text-slate-300 hover:text-white text-xs transition-all"
              title="Copy Raw README.md"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-obsidian-800 hover:bg-gold-500/20 border border-white/[0.08] hover:border-gold-500/40 text-slate-300 hover:text-gold-300 transition-all"
              title="Open GitHub Repo"
            >
              <Github className="w-4 h-4" />
            </a>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 border border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-white transition-all ml-1"
              aria-label="Close project modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs: Full README vs Architecture Blueprint */}
        <div className="px-6 py-2.5 bg-obsidian-950/60 border-b border-white/[0.04] flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('readme')}
            className={`px-3 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
              activeTab === 'readme'
                ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-gold-400" />
            <span>Full GitHub README.md</span>
          </button>
          <button
            onClick={() => setActiveTab('blueprint')}
            className={`px-3 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
              activeTab === 'blueprint'
                ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-brand-cyan" />
            <span>Architecture Specs</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {activeTab === 'readme' ? (
            /* Rendered Markdown README View */
            <div className="prose prose-invert max-w-none font-sans text-slate-200">
              <div className="rounded-2xl bg-obsidian-950/70 border border-white/[0.06] p-5 sm:p-7 space-y-2">
                {renderMarkdownContent(readmeMarkdown)}
              </div>
            </div>
          ) : (
            /* Structured Architecture Blueprint View */
            <div className="space-y-6">
              {/* Description */}
              <div className="text-slate-300 text-sm leading-relaxed bg-obsidian-950/60 p-4 rounded-2xl border border-white/[0.06]">
                {project.description}
              </div>

              {/* Quantifiable Benchmarks & Performance Metrics */}
              {project.metrics && project.metrics.length > 0 && (
                <div className="space-y-3">
                  <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400 inline-block" />
                    <span>Quantifiable Benchmarks &amp; Performance Telemetry</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {project.metrics.map((metric, mi) => (
                      <div 
                        key={mi}
                        className="p-3.5 rounded-xl bg-obsidian-950/90 border border-white/[0.08] text-left"
                      >
                        <div className="text-xl sm:text-2xl font-extrabold text-gold-400 font-mono tracking-tight">
                          {metric.value}
                        </div>
                        <div className="text-xs font-bold text-white font-mono mt-0.5">
                          {metric.label}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 leading-snug">
                          {metric.detail}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Architecture Details */}
              <div className="space-y-3">
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-semibold">
                  <Layers className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>Architecture &amp; Engineering Deep Dive</span>
                </div>
                <div className="space-y-2">
                  {project.architectureDetails.map((detail, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 rounded-xl bg-obsidian-950/70 border border-white/[0.06] text-xs sm:text-sm text-slate-200 flex items-start gap-2.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-2 shrink-0" />
                      <span className="leading-relaxed">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              <div className="space-y-2">
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald" />
                  <span>Technical Capabilities &amp; Deliverables</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {project.highlights.map((h, i) => (
                    <div key={i} className="text-xs text-slate-300 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div className="space-y-2 pt-2 border-t border-white/[0.08]">
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-semibold">
                  <Cpu className="w-3.5 h-3.5 text-brand-violet" />
                  <span>Technologies &amp; Libraries</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-lg bg-obsidian-800 text-xs font-mono text-slate-200 border border-white/[0.08]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Bar */}
        <div className="px-6 py-3.5 bg-obsidian-950 border-t border-white/[0.08] flex items-center justify-between shrink-0">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 font-bold text-xs flex items-center gap-2 hover:from-gold-400 hover:to-gold-500 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]"
          >
            <Github className="w-4 h-4" />
            <span>Open Repository on GitHub</span>
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-obsidian-800 text-xs font-medium text-slate-300 hover:text-white border border-white/[0.08]"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
