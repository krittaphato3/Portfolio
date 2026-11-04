import React, { useState, useEffect } from 'react';
import { FileText, Github, Linkedin, Menu, X, ArrowUpRight, Search } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface NavbarProps {
  onOpenCVModal: () => void;
  onOpenCommandPalette?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCVModal, onOpenCommandPalette }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Projects', href: '#projects' },
    { name: 'Terminal', href: '#terminal' },
    { name: 'Certificates', href: '#certificates' },
    { name: 'Skills', href: '#skills' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-4 transition-all duration-300">
      <nav
        className={`max-w-7xl mx-auto flex items-center justify-between px-5 py-3 rounded-2xl transition-all duration-300 ${
          scrolled
            ? 'bg-obsidian-900/85 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.6)]'
            : 'bg-obsidian-900/40 backdrop-blur-md border border-white/[0.04]'
        }`}
      >
        {/* Brand / Monogram */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500/20 via-obsidian-800 to-obsidian-900 border border-gold-500/30 flex items-center justify-center font-mono font-bold text-gold-400 group-hover:border-gold-400 group-hover:shadow-[0_0_16px_rgba(212,175,55,0.3)] transition-all">
            KP
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-semibold tracking-wide text-slate-100 flex items-center gap-1.5">
              <span>{PERSONAL_INFO.fullName}</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-gold-500/10 text-gold-400 border border-gold-500/20 font-mono">
                Ozone
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse" />
              KMUTT Computer Engineering
            </div>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 bg-obsidian-950/60 p-1 rounded-xl border border-white/[0.05]">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Action Controls */}
        <div className="hidden sm:flex items-center gap-2.5">
          {onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              className="px-2.5 py-1.5 rounded-lg bg-obsidian-800/80 hover:bg-obsidian-750 border border-white/[0.08] text-slate-400 hover:text-white text-xs font-mono flex items-center gap-2 transition-all"
              title="Search commands and projects (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-gold-400" />
              <span className="text-[11px] text-slate-500">Ctrl+K</span>
            </button>
          )}

          <a
            href={PERSONAL_INFO.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="w-9 h-9 rounded-lg bg-obsidian-800/80 hover:bg-obsidian-700/80 border border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-white hover:border-gold-500/30 transition-all"
          >
            <Github className="w-4 h-4" />
          </a>

          <a
            href={PERSONAL_INFO.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className="w-9 h-9 rounded-lg bg-obsidian-800/80 hover:bg-obsidian-700/80 border border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-brand-cyan hover:border-brand-cyan/30 transition-all"
          >
            <Linkedin className="w-4 h-4" />
          </a>

          <button
            onClick={onOpenCVModal}
            className="relative group px-4 py-2 rounded-xl bg-gradient-to-r from-gold-500/15 via-gold-400/25 to-gold-600/15 border border-gold-500/40 hover:border-gold-400 hover:shadow-[0_0_24px_rgba(212,175,55,0.25)] text-gold-300 hover:text-gold-200 text-xs font-semibold tracking-wide flex items-center gap-2 transition-all active:scale-[0.98]"
          >
            <FileText className="w-3.5 h-3.5 text-gold-400" />
            <span>Curriculum Vitae</span>
            <ArrowUpRight className="w-3 h-3 text-gold-400/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={onOpenCVModal}
            className="px-3 py-1.5 rounded-lg bg-gold-500/20 border border-gold-500/40 text-gold-300 text-xs font-medium flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>CV</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-9 h-9 rounded-lg bg-obsidian-800 border border-white/[0.08] flex items-center justify-center text-slate-300"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden mt-2 max-w-7xl mx-auto p-4 rounded-2xl bg-obsidian-900/95 backdrop-blur-xl border border-white/[0.1] shadow-2xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-obsidian-800/60 border border-white/[0.05] text-sm font-medium text-slate-200 hover:text-gold-300 hover:border-gold-500/20"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
            <div className="flex gap-2">
              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-obsidian-800 border border-white/[0.08] text-xs text-slate-300 flex items-center gap-1.5"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-obsidian-800 border border-white/[0.08] text-xs text-slate-300 flex items-center gap-1.5"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCVModal();
              }}
              className="px-3 py-1.5 rounded-lg bg-gold-500/20 border border-gold-500/40 text-gold-300 text-xs font-semibold flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Full CV</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
