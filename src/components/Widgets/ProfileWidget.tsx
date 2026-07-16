import { motion } from 'framer-motion';
import { MapPin, Calendar, GitBranch, ExternalLink, Mail, CircleDot } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { GitHubUserProfile } from '../../lib/github';

const roles = [
  'Senior Software Engineer',
  'Full Stack Developer',
  'Cyber Security Engineer',
  'AI / ML Engineer',
  'Cloud Solutions Architect',
];

interface ProfileWidgetProps {
  githubProfile?: GitHubUserProfile | null;
}

export function ProfileWidget({ githubProfile }: ProfileWidgetProps) {
  const avatarUrl = githubProfile?.avatar_url;
  const githubUrl = githubProfile?.html_url || 'https://github.com/krittaphato3';
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter effect
  useEffect(() => {
    const currentRole = roles[roleIndex];
    const speed = isDeleting ? 30 : 60;

    if (!isDeleting && displayText === currentRole) {
      // Pause before deleting
      const timeout = setTimeout(() => setIsDeleting(true), 2500);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && displayText === '') {
      // Move to next role
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
      return;
    }

    const timeout = setTimeout(() => {
      if (isDeleting) {
        setDisplayText(currentRole.slice(0, displayText.length - 1));
      } else {
        setDisplayText(currentRole.slice(0, displayText.length + 1));
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, roleIndex]);

  return (
    <div className="relative p-6 h-full overflow-hidden min-h-[380px]">
      {/* Background gradient orbs */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-cyan/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary-violet/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 h-full flex flex-col">
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary-cyan via-primary-violet to-primary-emerald p-[2px] mb-5 shadow-[0_0_30px_rgba(6,182,212,0.2)] relative group cursor-pointer"
          onClick={() => window.open(githubUrl, '_blank', 'noopener,noreferrer')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.open(githubUrl, '_blank', 'noopener,noreferrer'); } }}
          aria-label={`View GitHub profile: ${githubUrl}`}
        >
          <div className="w-full h-full rounded-2xl bg-bg-card flex items-center justify-center overflow-hidden relative">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Krittaphat Panyasomphan - GitHub Profile"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <span className="text-3xl font-bold text-gradient-mixed">KP</span>
            )}
          </div>
          {/* GitHub link indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 400, damping: 15 }}
            className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-primary-cyan flex items-center justify-center shadow-lg border-2 border-bg-card"
          >
            <ExternalLink className="w-3.5 h-3.5 text-white" />
          </motion.div>
        </motion.div>

        {/* Name & Role */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold text-text-primary tracking-tight mb-1 overflow-hidden">
            {"Krittaphat Panyasomphan".split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: 0.3 + i * 0.03,
                  duration: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="inline-block"
                style={{ whiteSpace: char === " " ? "pre" : "normal" }}
              >
                {char}
              </motion.span>
            ))}
          </h2>
          <p className="text-text-secondary text-sm mb-4 h-5">
            <span>{displayText}</span>
            <span className="inline-block w-[2px] h-4 bg-primary-cyan ml-0.5 animate-pulse" />
          </p>
        </motion.div>

        {/* Meta */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-3 mb-4"
        >
          <span className="flex items-center gap-1.5 text-xs text-text-muted">
            <MapPin className="w-3.5 h-3.5" /> Bangkok, Thailand
          </span>
          <span className="flex items-center gap-1.5 text-xs text-text-muted">
            <Calendar className="w-3.5 h-3.5" /> Joined 2021
          </span>
        </motion.div>

        {/* Status & Email */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="flex flex-wrap gap-2 mb-5"
        >
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-primary-emerald/10 text-primary-emerald border border-primary-emerald/20">
            <CircleDot className="w-3 h-3" />
            Open for Offers
          </span>
          <a
            href="mailto:krittaphat.pany@gmail.com"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-primary-cyan/10 text-primary-cyan border border-primary-cyan/20 hover:bg-primary-cyan/20 transition-colors"
          >
            <Mail className="w-3 h-3" />
            krittaphat.pany@gmail.com
          </a>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-2 mt-auto"
        >
          <motion.a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.08, y: -2, transition: { type: 'spring' as const, stiffness: 300, damping: 25 } }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 rounded-xl bg-bg-elevated border border-border-subtle hover:border-border-default hover:bg-bg-hover transition-all"
            aria-label="GitHub"
          >
            <GitBranch className="w-4 h-4 text-text-secondary" />
          </motion.a>
          <motion.a
            href="https://www.instagram.com/krittao3"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.08, y: -2, transition: { type: 'spring' as const, stiffness: 300, damping: 25 } }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 rounded-xl bg-bg-elevated border border-border-subtle hover:border-pink-400/30 hover:bg-bg-hover transition-all"
            aria-label="Instagram"
          >
            <svg className="w-4 h-4 text-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
          </motion.a>
          <motion.a
            href="https://www.linkedin.com/in/krittaphatpany/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.08, y: -2, transition: { type: 'spring' as const, stiffness: 300, damping: 25 } }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 rounded-xl bg-bg-elevated border border-border-subtle hover:border-blue-400/30 hover:bg-bg-hover transition-all"
            aria-label="LinkedIn"
          >
            <svg className="w-4 h-4 text-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect width="4" height="12" x="2" y="9" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
}