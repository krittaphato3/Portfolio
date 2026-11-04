import React, { useState, useEffect } from 'react';
import { 
  ArrowDown, 
  FileText, 
  Terminal, 
  Code2, 
  ExternalLink,
  Github,
  Linkedin,
  Mail
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface HeroProps {
  onOpenCVModal: () => void;
}

const ROLES = [
  'Autonomous AI Agent Architect',
  'Low-Level Systems & Game Server Engineer',
  'Chrome MV3 Architecture & Web Extension Dev',
  'Frontier LLM Benchmarking & Research',
  'Full-Stack Machine Learning Engineer',
];

export const Hero: React.FC<HeroProps> = ({ onOpenCVModal }) => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = ROLES[roleIndex];
    let timer: NodeJS.Timeout;

    if (!isDeleting && displayedText !== currentRole) {
      timer = setTimeout(() => {
        setDisplayedText(currentRole.slice(0, displayedText.length + 1));
      }, 55);
    } else if (!isDeleting && displayedText === currentRole) {
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 2200);
    } else if (isDeleting && displayedText !== '') {
      timer = setTimeout(() => {
        setDisplayedText(currentRole.slice(0, displayedText.length - 1));
      }, 30);
    } else if (isDeleting && displayedText === '') {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, roleIndex]);

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Decorative ambient radial lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-brand-violet/15 via-gold-500/10 to-brand-cyan/15 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-5xl mx-auto w-full relative z-10 text-center flex flex-col items-center">
        {/* Availability Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-obsidian-900/80 border border-gold-500/30 text-xs font-mono text-gold-300 shadow-[0_0_20px_rgba(212,175,55,0.15)] mb-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500"></span>
          </span>
          <span className="tracking-wide">KMUTT Computer Engineering · Available for High-Impact Roles</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-display mb-4 text-white leading-[1.1]">
          <span className="block text-slate-300 font-light text-2xl sm:text-3xl md:text-4xl mb-2 font-sans tracking-normal">
            Hello, I am
          </span>
          <span className="gold-gradient-text gold-glow tracking-tight uppercase">
            {PERSONAL_INFO.fullName}
          </span>
        </h1>

        {/* Dynamic Role Ticker */}
        <div className="h-10 sm:h-12 flex items-center justify-center font-mono text-lg sm:text-2xl text-slate-300 mb-6">
          <span className="text-brand-cyan font-bold mr-2">&gt;</span>
          <span className="text-white border-b-2 border-gold-400 pb-0.5 min-w-[20px]">
            {displayedText}
          </span>
          <span className="animate-pulse ml-0.5 text-gold-400 font-bold">|</span>
        </div>

        {/* Bio statement */}
        <p className="max-w-2xl text-base sm:text-lg text-slate-400 font-normal leading-relaxed mb-10 text-balance">
          Engineering intelligent systems at the intersection of{' '}
          <span className="text-slate-200 font-medium">autonomous AI agent swarms</span>,{' '}
          <span className="text-slate-200 font-medium">low-level server runtimes</span>, and{' '}
          <span className="text-slate-200 font-medium">bespoke interactive interfaces</span>.
          Studying at <span className="text-gold-300 font-medium">KMUTT</span>.
        </p>

        {/* Primary Call to Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
          <a
            href="#projects"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-obsidian-950 font-bold text-sm tracking-wide shadow-[0_0_30px_rgba(212,175,55,0.35)] hover:shadow-[0_0_40px_rgba(212,175,55,0.55)] transition-all flex items-center gap-2 group active:scale-[0.98]"
          >
            <Code2 className="w-4 h-4 text-obsidian-950 group-hover:rotate-12 transition-transform" />
            <span>Explore Engineering Projects</span>
            <ArrowDown className="w-4 h-4 text-obsidian-950 group-hover:translate-y-0.5 transition-transform" />
          </a>

          <button
            onClick={onOpenCVModal}
            className="px-6 py-3.5 rounded-xl bg-obsidian-900/90 hover:bg-obsidian-800 border border-gold-500/40 hover:border-gold-400 text-gold-300 hover:text-white text-sm font-semibold tracking-wide shadow-lg transition-all flex items-center gap-2.5 group active:scale-[0.98]"
          >
            <FileText className="w-4 h-4 text-gold-400 group-hover:scale-110 transition-transform" />
            <span>View & Download CV</span>
            <ExternalLink className="w-3.5 h-3.5 text-gold-400/60" />
          </button>

          <a
            href="#terminal"
            className="px-5 py-3.5 rounded-xl bg-obsidian-950/80 hover:bg-obsidian-900 border border-white/[0.08] hover:border-brand-cyan/40 text-slate-300 hover:text-brand-cyan text-sm font-mono flex items-center gap-2 transition-all"
          >
            <Terminal className="w-4 h-4 text-brand-cyan" />
            <span>Interactive Terminal</span>
          </a>
        </div>

        {/* Quick Engineering Metrics Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-4xl pt-6 border-t border-white/[0.08]">
          <div className="p-4 rounded-xl bg-obsidian-900/60 border border-white/[0.06] backdrop-blur-sm text-left group hover:border-gold-500/30 transition-colors">
            <div className="text-2xl sm:text-3xl font-bold font-display text-white group-hover:text-gold-300 transition-colors">
              27+
            </div>
            <div className="text-xs text-slate-400 font-mono mt-0.5">GitHub Repositories</div>
          </div>

          <div className="p-4 rounded-xl bg-obsidian-900/60 border border-white/[0.06] backdrop-blur-sm text-left group hover:border-brand-cyan/30 transition-colors">
            <div className="text-2xl sm:text-3xl font-bold font-display text-white group-hover:text-brand-cyan transition-colors">
              KMUTT
            </div>
            <div className="text-xs text-slate-400 font-mono mt-0.5">Computer Engineering</div>
          </div>

          <div className="p-4 rounded-xl bg-obsidian-900/60 border border-white/[0.06] backdrop-blur-sm text-left group hover:border-brand-violet/30 transition-colors">
            <div className="text-2xl sm:text-3xl font-bold font-display text-white group-hover:text-brand-violet transition-colors">
              2027
            </div>
            <div className="text-xs text-slate-400 font-mono mt-0.5">Expected B.Eng.</div>
          </div>

          <div className="p-4 rounded-xl bg-obsidian-900/60 border border-white/[0.06] backdrop-blur-sm text-left group hover:border-gold-500/30 transition-colors">
            <div className="text-2xl sm:text-3xl font-bold font-display text-white group-hover:text-gold-300 transition-colors">
              10+
            </div>
            <div className="text-xs text-slate-400 font-mono mt-0.5">Core Languages & Stacks</div>
          </div>
        </div>

        {/* Social Fast Connect Strip */}
        <div className="flex items-center gap-5 mt-10 text-slate-400 text-xs font-mono">
          <span className="text-slate-500">Connect directly:</span>
          <a
            href={PERSONAL_INFO.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
          <span className="text-slate-700">·</span>
          <a
            href={PERSONAL_INFO.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-cyan transition-colors flex items-center gap-1.5"
          >
            <Linkedin className="w-3.5 h-3.5" />
            <span>LinkedIn</span>
          </a>
          <span className="text-slate-700">·</span>
          <a
            href={`mailto:${PERSONAL_INFO.email}`}
            className="hover:text-gold-300 transition-colors flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email</span>
          </a>
        </div>
      </div>
    </section>
  );
};
