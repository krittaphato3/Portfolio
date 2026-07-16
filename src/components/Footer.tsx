import { motion } from 'framer-motion';
import { Heart, GitBranch } from 'lucide-react';

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="border-t border-border-subtle bg-bg-dark mt-4"
    >
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <span>© {new Date().getFullYear()} Krittaphat Panyasomphan. Built with</span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              <Heart className="w-4 h-4 text-primary-rose fill-primary-rose" />
            </motion.span>
            <span>using React + Tailwind + Framer Motion</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/krittaphato3"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              GitHub
            </a>
            <motion.a
              href="https://github.com/krittaphato3"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.08, y: -2, transition: { type: 'spring' as const, stiffness: 300, damping: 25 } }}
              whileTap={{ scale: 0.95 }}
              className="text-text-muted hover:text-text-primary transition-colors"
              aria-label="GitHub"
            >
              <GitBranch className="w-5 h-5" />
            </motion.a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
