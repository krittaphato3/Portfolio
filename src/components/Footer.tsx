import React from 'react';
import { Github, Linkedin, Mail, ArrowUp, FileText, Instagram } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface FooterProps {
  onOpenCVModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCVModal }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="relative border-t border-white/[0.08] bg-obsidian-950 pt-16 pb-12 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/[0.08]">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500/20 to-obsidian-800 border border-gold-500/30 flex items-center justify-center font-mono font-bold text-gold-400">
                KP
              </div>
              <div>
                <div className="font-bold text-white text-base">
                  {PERSONAL_INFO.fullName}
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  Computer Engineering @ KMUTT
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
              Focusing on autonomous AI agent loops, low-level server architectures, and world-class digital experiences. Open for summer internships and engineering collaborations.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-obsidian-900 border border-white/[0.08] hover:border-gold-500/40 hover:text-white flex items-center justify-center text-slate-400 transition-all"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>

              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-obsidian-900 border border-white/[0.08] hover:border-brand-cyan/40 hover:text-brand-cyan flex items-center justify-center text-slate-400 transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>

              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                className="w-9 h-9 rounded-xl bg-obsidian-900 border border-white/[0.08] hover:border-gold-500/40 hover:text-gold-300 flex items-center justify-center text-slate-400 transition-all"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>

              <a
                href={PERSONAL_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-obsidian-900 border border-white/[0.08] hover:border-pink-500/40 hover:text-pink-400 flex items-center justify-center text-slate-400 transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-semibold text-gold-400 uppercase tracking-wider">
              Navigation
            </div>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <a href="#projects" className="hover:text-white transition-colors">
                  Featured Projects
                </a>
              </li>
              <li>
                <a href="#terminal" className="hover:text-white transition-colors">
                  Recruiter Terminal Sim
                </a>
              </li>
              <li>
                <a href="#certificates" className="hover:text-white transition-colors">
                  Certificates & Awards
                </a>
              </li>
              <li>
                <a href="#skills" className="hover:text-white transition-colors">
                  Technical Stack
                </a>
              </li>
            </ul>
          </div>

          {/* Direct Recruiter Access */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-semibold text-gold-400 uppercase tracking-wider">
              Recruitment Fast Track
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Need an official copy of Krittaphat&apos;s Curriculum Vitae for candidate review or ATS ingestion?
            </p>
            <button
              onClick={onOpenCVModal}
              className="px-4 py-2 rounded-xl bg-gold-500/15 border border-gold-500/35 text-gold-300 hover:bg-gold-500/25 text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-gold-400" />
              <span>Open & Download CV</span>
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-4">
          <div>
            &copy; {new Date().getFullYear()} {PERSONAL_INFO.fullName}. Crafted with React &amp; TypeScript.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-gold-300 transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
