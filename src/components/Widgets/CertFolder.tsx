import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  ExternalLink,
  FileImage,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  LayoutList,
  Folder,
} from 'lucide-react';
import type { CategoryData } from '../../lib/types';

/* ----------------------------------------------------------------
   TYPES
   ---------------------------------------------------------------- */
interface CertFolderProps {
  categories: CategoryData[];
  loading: boolean;
  /** Default number of visible certs before "View All". */
  limit?: number;
}

/* ----------------------------------------------------------------
   SAFE URL UTILITIES
   ---------------------------------------------------------------- */
function safeUrl(url: string | undefined): string {
  if (!url) return '#';
  try {
    const parsed = new URL(url);
    if (['http:', 'https:'].includes(parsed.protocol)) return url;
    return '#';
  } catch {
    return '#';
  }
}

function safeImageUrl(url: string | undefined): string {
  if (!url) return '';
  try {
    const parsed = new URL(url, window.location.origin);
    if (['http:', 'https:', 'data:'].includes(parsed.protocol)) {
      if (parsed.protocol === 'data:' && url.includes('text/html')) return '';
      return url;
    }
    return '';
  } catch {
    return url;
  }
}

/* ----------------------------------------------------------------
   SKELETON LOADING
   ---------------------------------------------------------------- */
function CertSkeleton({ compact }: { compact: boolean }) {
  return (
    <div
      className={`animate-pulse rounded-xl border border-border-subtle bg-bg-elevated ${
        compact ? 'p-3' : 'p-4'
      }`}
    >
      <div
        className={`bg-bg-card rounded-lg mb-3 ${compact ? 'aspect-[3/2]' : 'aspect-video'}`}
      />
      <div className="h-3 bg-bg-card rounded w-3/4 mb-2" />
      <div className="h-2.5 bg-bg-card rounded w-1/2" />
    </div>
  );
}

/* ----------------------------------------------------------------
   COMPONENT
   ---------------------------------------------------------------- */
export function CertFolder({
  categories,
  loading,
  limit = 6,
}: CertFolderProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [expanded, setExpanded] = useState(false);
  const [compact, setCompact] = useState(false);

  // All certs flattened
  const allCerts = useMemo(
    () => categories.flatMap((cat) => cat.certificates),
    [categories]
  );

  // Filtered certs by category
  const filteredCerts = useMemo(() => {
    if (activeCategory === 'all') return allCerts;
    return allCerts.filter((cert) => cert.categorySlug === activeCategory);
  }, [allCerts, activeCategory]);

  // Visible certs based on expand state
  const visibleCerts = useMemo(
    () => (expanded ? filteredCerts : filteredCerts.slice(0, limit)),
    [filteredCerts, expanded, limit]
  );

  const hasMore = filteredCerts.length > limit;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-cyan/10 rounded-xl">
            <Folder className="w-5 h-5 text-primary-cyan" />
          </div>
          <div>
            <h3 className="text-text-primary font-semibold">Certifications</h3>
            <p className="text-xs text-text-muted">
              {allCerts.length} professional credential{allCerts.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Compact/Normal Toggle */}
        <div className="flex items-center gap-1 bg-bg-elevated rounded-lg border border-border-subtle p-0.5">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setCompact(false)}
            className={`p-1.5 rounded-md transition-colors ${
              !compact
                ? 'bg-bg-card text-primary-cyan border border-border-subtle'
                : 'text-text-muted hover:text-text-secondary'
            }`}
            aria-label="Normal view"
            aria-pressed={!compact}
          >
            <LayoutGrid className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setCompact(true)}
            className={`p-1.5 rounded-md transition-colors ${
              compact
                ? 'bg-bg-card text-primary-cyan border border-border-subtle'
                : 'text-text-muted hover:text-text-secondary'
            }`}
            aria-label="Compact view"
            aria-pressed={compact}
          >
            <LayoutList className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Category Tabs */}
      {loading ? (
        <div className="flex gap-2 mb-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-8 w-20 rounded-full bg-bg-elevated animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div
          className="flex gap-2 mb-5 overflow-x-auto pb-1"
          role="tablist"
          aria-label="Certificate categories"
        >
          <motion.button
            role="tab"
            aria-selected={activeCategory === 'all'}
            onClick={() => {
              setActiveCategory('all');
              setExpanded(false);
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`
              px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap
              ${
                activeCategory === 'all'
                  ? 'bg-primary-cyan/20 text-primary-cyan border border-primary-cyan/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                  : 'bg-bg-elevated text-text-secondary border border-border-subtle hover:border-border-default'
              }
            `}
          >
            All
            <span className="ml-1.5 text-text-dim">({allCerts.length})</span>
          </motion.button>
          {categories.map((cat) => (
            <motion.button
              key={cat.slug}
              role="tab"
              aria-selected={activeCategory === cat.slug}
              onClick={() => {
                setActiveCategory(cat.slug);
                setExpanded(false);
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`
                px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap
                ${
                  activeCategory === cat.slug
                    ? 'bg-primary-cyan/20 text-primary-cyan border border-primary-cyan/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                    : 'bg-bg-elevated text-text-secondary border border-border-subtle hover:border-border-default'
                }
              `}
            >
              {cat.name}
              <span className="ml-1.5 text-text-dim">
                ({cat.certificates.length})
              </span>
            </motion.button>
          ))}
        </div>
      )}

      {/* Certificates Grid */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`grid gap-3 ${
              compact
                ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {Array.from({ length: compact ? 8 : 6 }).map((_, i) => (
              <CertSkeleton key={i} compact={compact} />
            ))}
          </motion.div>
        ) : visibleCerts.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="py-12 text-center"
          >
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-bg-elevated flex items-center justify-center">
              <Award className="w-7 h-7 text-text-dim" />
            </div>
            <p className="text-sm text-text-muted font-medium">
              No certificates found
            </p>
            <p className="text-xs text-text-dim mt-1">
              {activeCategory === 'all'
                ? 'Add certificates to your portfolio'
                : 'Try selecting a different category'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={`${activeCategory}-${compact}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`grid gap-3 ${
              compact
                ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {visibleCerts.map((cert, index) => {
              const imageUrl = safeImageUrl(cert.imageUrl);
              const linkUrl = safeUrl(cert.link);

              return (
                <motion.a
                  key={cert.id}
                  href={linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.04 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className={`
                    group relative rounded-xl border border-border-subtle
                    hover:border-primary-cyan/30 transition-all duration-300
                    bg-bg-elevated overflow-hidden
                    ${compact ? 'p-3' : 'p-4'}
                  `}
                  aria-label={`Certificate: ${cert.description.split(' - ')[0]}`}
                >
                  {/* Certificate Image */}
                  <div
                    className={`bg-bg-card rounded-lg mb-3 overflow-hidden ${
                      compact ? 'aspect-[3/2]' : 'aspect-video'
                    }`}
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={cert.description}
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileImage className="w-8 h-8 text-text-dim" />
                      </div>
                    )}
                  </div>

                  {/* Certificate Info */}
                  <p
                    className={`text-text-primary font-medium line-clamp-2 mb-1.5 ${
                      compact ? 'text-xs' : 'text-sm'
                    }`}
                  >
                    {cert.description.split(' - ')[0]}
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-text-muted truncate ${
                        compact ? 'text-[10px]' : 'text-xs'
                      }`}
                    >
                      {cert.issuer}
                    </span>
                    <ExternalLink
                      className={`text-text-dim group-hover:text-primary-cyan transition-colors flex-shrink-0 ${
                        compact ? 'w-3.5 h-3.5' : 'w-4 h-4'
                      }`}
                    />
                  </div>

                  {/* Category badge */}
                  {cert.category && !compact && (
                    <span className="absolute top-3 right-3 px-1.5 py-0.5 text-[9px] font-medium rounded-md bg-bg-dark/80 backdrop-blur-sm text-text-dim border border-border-subtle/50">
                      {cert.category}
                    </span>
                  )}

                  {/* Hover glow */}
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 rounded-xl shadow-[inset_0_0_30px_rgba(6,182,212,0.08)]" />
                  </div>
                </motion.a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* View All / Show Less */}
      {!loading && hasMore && filteredCerts.length > 0 && (
        <div className="flex justify-center mt-5">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-primary-cyan bg-primary-cyan/10 border border-primary-cyan/30 rounded-xl hover:bg-primary-cyan/15 transition-colors"
            aria-expanded={expanded}
            aria-label={
              expanded ? 'Show fewer certificates' : 'Show all certificates'
            }
          >
            {expanded ? (
              <>
                Show Less
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                View All ({filteredCerts.length})
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </motion.button>
        </div>
      )}
    </div>
  );
}
