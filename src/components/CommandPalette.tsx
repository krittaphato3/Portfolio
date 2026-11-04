import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Search, 
  Terminal, 
  FileText, 
  FolderGit2, 
  Award, 
  Cpu, 
  Mail, 
  Github, 
  Linkedin, 
  Sparkles
} from 'lucide-react';
import { PERSONAL_INFO, PROJECTS } from '../data/portfolioData';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCVModal: () => void;
}

interface PaletteItem {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onOpenCVModal,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Keyboard navigation & shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Trigger open via parent state or click
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const defaultItems: PaletteItem[] = [
    {
      id: 'cv',
      title: 'Open Curriculum Vitae (Standard SWE Format)',
      category: 'Recruiter Quick Actions',
      icon: <FileText className="w-4 h-4 text-gold-400" />,
      action: () => {
        onClose();
        onOpenCVModal();
      },
    },
    {
      id: 'projects',
      title: 'Navigate to Featured Projects & Systems',
      category: 'Navigation',
      icon: <FolderGit2 className="w-4 h-4 text-brand-cyan" />,
      action: () => {
        onClose();
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'terminal',
      title: 'Launch Interactive Developer Console',
      category: 'Interactive',
      icon: <Terminal className="w-4 h-4 text-brand-emerald" />,
      action: () => {
        onClose();
        document.getElementById('terminal')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'certificates',
      title: 'Inspect Certificates & Verified Honors',
      category: 'Navigation',
      icon: <Award className="w-4 h-4 text-gold-400" />,
      action: () => {
        onClose();
        document.getElementById('certificates')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'skills',
      title: 'View Engineering Tech Stack Matrix',
      category: 'Navigation',
      icon: <Cpu className="w-4 h-4 text-brand-violet" />,
      action: () => {
        onClose();
        document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'email',
      title: `Send Email to ${PERSONAL_INFO.email}`,
      category: 'Contact',
      icon: <Mail className="w-4 h-4 text-slate-300" />,
      action: () => {
        onClose();
        window.location.href = `mailto:${PERSONAL_INFO.email}?subject=Software%20Engineering%20Inquiry`;
      },
    },
    {
      id: 'github',
      title: 'Open GitHub Profile (@krittaphato3)',
      category: 'External',
      icon: <Github className="w-4 h-4 text-slate-300" />,
      action: () => {
        onClose();
        window.open(PERSONAL_INFO.github, '_blank');
      },
    },
    {
      id: 'linkedin',
      title: 'Open LinkedIn Profile',
      category: 'External',
      icon: <Linkedin className="w-4 h-4 text-brand-cyan" />,
      action: () => {
        onClose();
        window.open(PERSONAL_INFO.linkedin, '_blank');
      },
    },
  ];

  // Dynamic project additions
  const projectItems: PaletteItem[] = PROJECTS.map((p) => ({
    id: p.id,
    title: `Project: ${p.title} (${p.tagline})`,
    category: 'Projects',
    icon: <Sparkles className="w-4 h-4 text-brand-cyan" />,
    action: () => {
      onClose();
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    },
  }));

  const allItems = [...defaultItems, ...projectItems];

  const filteredItems = allItems.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyNav = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150 overscroll-contain print:hidden"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-xl rounded-2xl bg-[#0a0b12] border border-white/[0.15] shadow-[0_30px_90px_rgba(0,0,0,0.98)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyNav}
      >
        {/* Search Input Bar */}
        <div className="px-4 py-3.5 bg-obsidian-950/90 border-b border-white/[0.08] flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search commands, projects, skills, or actions (Ctrl+K)..."
            className="flex-1 bg-transparent border-none outline-none text-white font-mono text-xs sm:text-sm placeholder:text-slate-500"
          />
          <kbd className="px-2 py-0.5 rounded bg-white/[0.08] border border-white/[0.1] text-[10px] font-mono text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-white/[0.02]">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`px-3.5 py-2.5 rounded-xl flex items-center justify-between gap-3 cursor-pointer text-xs font-mono transition-colors ${
                    isSelected
                      ? 'bg-gold-500/15 text-white border border-gold-500/30'
                      : 'text-slate-300 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className="p-1.5 rounded-lg bg-obsidian-950 border border-white/[0.06] shrink-0">
                      {item.icon}
                    </div>
                    <span className="truncate">{item.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0 hidden sm:inline">
                    {item.category}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-xs font-mono text-slate-500">
              No matching commands or projects found.
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-obsidian-950/80 border-t border-white/[0.06] text-[11px] font-mono text-slate-500 flex items-center justify-between">
          <span>Navigate with &uarr; &darr; · Select with Enter</span>
          <span className="hidden sm:inline">Ozone OS Spotlight</span>
        </div>
      </div>
    </div>,
    document.body
  );
};
