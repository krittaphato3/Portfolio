import { motion, useInView } from 'framer-motion';
import { Pin, ExternalLink, Star, GitFork, ArrowUpRight } from 'lucide-react';
import { useRef } from 'react';
import type { PinnedRepo } from '../../lib/github';
import { useSettings } from '../../hooks/useSettings';

interface ProjectsWidgetProps {
  repos: PinnedRepo[];
  loading: boolean;
}

interface RepoCardProps {
  repo: PinnedRepo;
  index: number;
  animationsEnabled: boolean;
}

type RepoTopic = { topic: { name: string } };
type RepoLanguage = { name: string; color: string } | null;

function RepoCard({ repo, index, animationsEnabled }: RepoCardProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const topics: RepoTopic[] = repo.repositoryTopics?.nodes?.slice(0, 3) || [];
  const lang: RepoLanguage = repo.primaryLanguage;

  if (!animationsEnabled) {
    return (
      <a
        ref={ref}
        href={repo.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open GitHub repository: ${repo.name}`}
        className="group block p-4 bg-bg-elevated rounded-xl border border-border-subtle hover:border-border-default transition-all duration-300 cursor-pointer"
      >
        <RepoCardContent repo={repo} topics={topics} lang={lang} />
      </a>
    );
  }

  return (
    <motion.a
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.98 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 260, damping: 24 }}
      whileHover={{ x: 3, y: -3, scale: 1.01, transition: { type: 'spring' as const, stiffness: 300, damping: 25 } }}
      whileTap={{ scale: 0.99 }}
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open GitHub repository: ${repo.name}`}
      className="group block p-4 bg-bg-elevated rounded-xl border border-border-subtle hover:border-primary-cyan/30 hover:shadow-[0_12px_40px_rgba(6,182,212,0.08)] transition-all duration-300 cursor-pointer"
    >
      <RepoCardContent repo={repo} topics={topics} lang={lang} />
    </motion.a>
  );
}

function RepoCardContent({ repo, topics, lang }: { repo: PinnedRepo; topics: RepoTopic[]; lang: RepoLanguage }) {
  return (
    <>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Pin className="w-4 h-4 text-primary-amber flex-shrink-0" />
            <h4 className="text-sm font-medium text-text-primary truncate">{repo.name}</h4>
            <ArrowUpRight className="w-4 h-4 text-text-dim group-hover:text-primary-cyan transition-colors flex-shrink-0" />
          </div>
          <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
            {repo.description || 'No description provided.'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        {lang && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium bg-bg-card text-text-muted rounded-md border border-border-subtle">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: lang.color }} />
            {lang.name}
          </span>
        )}
        {topics.map((t) => (
          <span
            key={t.topic.name}
            className="px-2 py-0.5 text-[10px] font-medium bg-bg-card text-text-muted rounded-md border border-border-subtle"
          >
            {t.topic.name}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {repo.stargazerCount > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-text-dim">
              <Star className="w-3 h-3" /> {repo.stargazerCount}
            </span>
          )}
          {repo.forkCount > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-text-dim">
              <GitFork className="w-3 h-3" /> {repo.forkCount}
            </span>
          )}
        </div>
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          {repo.homepageUrl && (
            <motion.a
              href={repo.homepageUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Live demo for ${repo.name}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-4 h-4 text-text-dim hover:text-primary-cyan transition-colors" />
            </motion.a>
          )}
        </div>
      </div>
    </>
  );
}

export function ProjectsWidget({ repos, loading }: ProjectsWidgetProps) {
  const { settings } = useSettings();
  const animationsEnabled = settings.display.animations;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-amber/10 rounded-xl">
            <Pin className="w-5 h-5 text-primary-amber" />
          </div>
          <div>
            <h3 className="text-text-primary font-semibold">Feature Work</h3>
            <p className="text-xs text-text-muted">Pinned on GitHub profile</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 bg-bg-elevated rounded-xl border border-border-subtle animate-pulse">
              <div className="h-4 bg-bg-card rounded w-1/3 mb-2" />
              <div className="h-3 bg-bg-card rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : repos.length === 0 ? (
        <div className="py-8 text-center">
          <Pin className="w-8 h-8 mx-auto mb-3 text-text-dim" />
          <p className="text-sm text-text-muted">No pinned repositories found.</p>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: animationsEnabled ? 0.06 : 0 },
            },
          }}
          className="space-y-3"
        >
          {repos.map((repo, index) => (
            <RepoCard key={repo.name} repo={repo} index={index} animationsEnabled={animationsEnabled} />
          ))}
        </motion.div>
      )}
    </div>
  );
}