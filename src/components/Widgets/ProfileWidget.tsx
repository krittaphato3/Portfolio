import { motion } from 'framer-motion';
import { MapPin, Calendar, GitBranch } from 'lucide-react';

export function ProfileWidget() {
  return (
    <div className="relative p-6 h-full overflow-hidden min-h-[320px]">
      {/* Background gradient orbs */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-cyan/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary-violet/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 h-full flex flex-col">
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring' as const, stiffness: 200, damping: 15 }}
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-cyan via-primary-violet to-primary-emerald p-[2px] mb-5 shadow-[0_0_30px_rgba(6,182,212,0.2)]"
        >
          <div className="w-full h-full rounded-2xl bg-bg-card flex items-center justify-center">
            <span className="text-3xl font-bold text-gradient-mixed">KP</span>
          </div>
        </motion.div>

        {/* Name & Role */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold text-text-primary tracking-tight mb-1">
            Krittaphat Panyasomphan
          </h2>
          <p className="text-text-secondary text-sm mb-4">
            Senior Software Engineer
          </p>
        </motion.div>

        {/* Meta */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-3 mb-6"
        >
          <span className="flex items-center gap-1.5 text-xs text-text-muted">
            <MapPin className="w-3.5 h-3.5" /> Bangkok, Thailand
          </span>
          <span className="flex items-center gap-1.5 text-xs text-text-muted">
            <Calendar className="w-3.5 h-3.5" /> Joined 2021
          </span>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-2 mt-auto"
        >
          {[
            { icon: GitBranch, href: 'https://github.com/krittaphato3', label: 'GitHub' },
          ].map(({ icon: Icon, href, label }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 rounded-xl bg-bg-elevated border border-border-subtle hover:border-border-default hover:bg-bg-hover transition-all"
              aria-label={label}
            >
              <Icon className="w-4 h-4 text-text-secondary" />
            </motion.a>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
