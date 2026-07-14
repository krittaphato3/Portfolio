import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  ArrowUp,
  ArrowDown,
  CornerDownLeft,
  Command,
  FileText,
  Folder,
  Award,
  Settings,
} from 'lucide-react';

/* ----------------------------------------------------------------
   TYPES
   ---------------------------------------------------------------- */
interface SearchItem {
  id: string;
  title: string;
  description: string;
  category: 'page' | 'project' | 'cert' | 'setting';
  url?: string;
  icon?: React.ReactNode;
}

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  /** External items to search through. Falls back to built-in items when empty. */
  items?: SearchItem[];
}

/* ----------------------------------------------------------------
   DEFAULT SEARCH ITEMS
   ---------------------------------------------------------------- */
const defaultItems: SearchItem[] = [
  {
    id: 'nav-dashboard',
    title: 'Dashboard',
    description: 'Main portfolio overview',
    category: 'page',
    icon: <Folder className="w-4 h-4" />,
  },
  {
    id: 'nav-certs',
    title: 'Certifications',
    description: 'Professional credentials',
    category: 'page',
    icon: <Award className="w-4 h-4" />,
  },
  {
    id: 'nav-projects',
    title: 'Projects',
    description: 'GitHub pinned repositories',
    category: 'project',
    icon: <Folder className="w-4 h-4" />,
  },
  {
    id: 'nav-settings',
    title: 'Settings',
    description: 'Theme, notifications, display',
    category: 'setting',
    icon: <Settings className="w-4 h-4" />,
  },
  {
    id: 'nav-skills',
    title: 'Skills & Technologies',
    description: 'Technical proficiency overview',
    category: 'page',
    icon: <FileText className="w-4 h-4" />,
  },
];

/* ----------------------------------------------------------------
   CATEGORY CONFIG
   ---------------------------------------------------------------- */
const categoryConfig: Record<
  SearchItem['category'],
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  page: {
    label: 'Page',
    color: 'text-primary-cyan',
    bgColor: 'bg-primary-cyan/10',
    borderColor: 'border-primary-cyan/30',
  },
  project: {
    label: 'Project',
    color: 'text-primary-violet',
    bgColor: 'bg-primary-violet/10',
    borderColor: 'border-primary-violet/30',
  },
  cert: {
    label: 'Cert',
    color: 'text-primary-emerald',
    bgColor: 'bg-primary-emerald/10',
    borderColor: 'border-primary-emerald/30',
  },
  setting: {
    label: 'Setting',
    color: 'text-primary-amber',
    bgColor: 'bg-primary-amber/10',
    borderColor: 'border-primary-amber/30',
  },
};

/* ----------------------------------------------------------------
   ANIMATION VARIANTS
   ---------------------------------------------------------------- */
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 400, damping: 30 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: { duration: 0.15, ease: 'easeIn' as const },
  },
};

const resultListVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03, delayChildren: 0.05 },
  },
};

const resultItemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0 },
};

/* ----------------------------------------------------------------
   COMPONENT
   ---------------------------------------------------------------- */
export function SearchModal({ open, onClose, items }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const allItems = useMemo(() => items ?? defaultItems, [items]);

  // Filter results
  const results = useMemo(() => {
    if (!query.trim()) return allItems;
    const lower = query.toLowerCase();
    return allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(lower) ||
        item.description.toLowerCase().includes(lower) ||
        item.category.toLowerCase().includes(lower)
    );
  }, [query, allItems]);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      // Focus input after a tick to ensure the modal is mounted
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [open]);

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(0);
  }, [results.length]);

  // Scroll active item into view
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const activeEl = list.children[activeIndex] as HTMLElement | undefined;
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [activeIndex]);

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case 'Enter':
          e.preventDefault();
          if (results[activeIndex]?.url) {
            window.open(results[activeIndex].url, '_blank', 'noopener,noreferrer');
            onClose();
          }
          break;
      }
    },
    [results, activeIndex, onClose]
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center pt-[15vh]"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label="Search"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-xl mx-4 overflow-hidden rounded-2xl border border-border-subtle bg-bg-card/95 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.5),0_0_1px_rgba(255,255,255,0.05)]"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onKeyDown={handleKeyDown}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border-subtle">
              <Search className="w-5 h-5 text-text-muted flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages, projects, settings..."
                className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-dim outline-none"
                aria-label="Search input"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                onClick={onClose}
                className="flex-shrink-0 p-1 rounded-md text-text-dim hover:text-text-secondary hover:bg-bg-elevated transition-colors"
                aria-label="Close search"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results */}
            <div
              ref={listRef}
              className="max-h-[340px] overflow-y-auto overscroll-contain py-2"
              role="listbox"
              aria-label="Search results"
            >
              {results.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <Search className="w-8 h-8 mx-auto mb-3 text-text-dim" />
                  <p className="text-sm text-text-muted">No results found for</p>
                  <p className="text-sm text-text-primary font-medium mt-1">
                    "{query}"
                  </p>
                </div>
              ) : (
                <motion.div variants={resultListVariants} initial="hidden" animate="visible">
                  {results.map((item, index) => {
                    const cat = categoryConfig[item.category];
                    const isActive = index === activeIndex;
                    return (
                      <motion.button
                        key={item.id}
                        variants={resultItemVariants}
                        role="option"
                        aria-selected={isActive}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => {
                          if (item.url) {
                            window.open(item.url, '_blank', 'noopener,noreferrer');
                          }
                          onClose();
                        }}
                        className={`
                          w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-150
                          ${
                            isActive
                              ? 'bg-bg-elevated'
                              : 'hover:bg-bg-elevated/50'
                          }
                        `}
                      >
                        {/* Icon */}
                        <div
                          className={`flex-shrink-0 p-1.5 rounded-lg ${cat.bgColor}`}
                        >
                          <span className={cat.color}>{item.icon}</span>
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-text-primary font-medium truncate">
                            {item.title}
                          </p>
                          <p className="text-xs text-text-muted truncate">
                            {item.description}
                          </p>
                        </div>

                        {/* Category badge */}
                        <span
                          className={`flex-shrink-0 px-2 py-0.5 text-[10px] font-medium rounded-md border ${cat.bgColor} ${cat.color} ${cat.borderColor}`}
                        >
                          {cat.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-4 px-4 py-2.5 border-t border-border-subtle text-text-dim">
              <span className="flex items-center gap-1 text-[10px]">
                <ArrowUp className="w-3 h-3" />
                <ArrowDown className="w-3 h-3" />
                <span className="ml-0.5">Navigate</span>
              </span>
              <span className="flex items-center gap-1 text-[10px]">
                <CornerDownLeft className="w-3 h-3" />
                <span className="ml-0.5">Select</span>
              </span>
              <span className="flex items-center gap-1 text-[10px]">
                <kbd className="px-1 py-0.5 bg-bg-elevated rounded text-[9px] border border-border-subtle">
                  Esc
                </kbd>
                <span className="ml-0.5">Close</span>
              </span>
              <span className="flex items-center gap-1 text-[10px] ml-auto">
                <Command className="w-3 h-3" />
                <kbd className="px-1 py-0.5 bg-bg-elevated rounded text-[9px] border border-border-subtle">
                  K
                </kbd>
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ----------------------------------------------------------------
   HOOK: Global Cmd+K shortcut
   ---------------------------------------------------------------- */
export function useSearchShortcut(onToggle: () => void) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onToggle();
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onToggle]);
}
