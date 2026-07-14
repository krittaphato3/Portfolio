import { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Award,
  ExternalLink,
  FileImage,
  ChevronDown,
  ChevronUp,
  Grid3x3,
  LayoutGrid,
  Columns3,
  FileText,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { PdfViewer } from '../UI/PdfViewer';
import { useSettings } from '../../hooks/useSettings';
import type { Certificate, CategoryData } from '../../lib/types';

/* ----------------------------------------------------------------
   TYPES
   ---------------------------------------------------------------- */
interface CertPanelProps {
  categories: CategoryData[];
  loading: boolean;
  limit?: number;
  compact?: boolean;
}

type GridSize = 'small' | 'medium' | 'large';

const GRID_CONFIG: Record<GridSize, { cols: string; label: string; icon: typeof Grid3x3 }> = {
  small: { cols: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4', label: 'S', icon: Grid3x3 },
  medium: { cols: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', label: 'M', icon: LayoutGrid },
  large: { cols: 'grid-cols-1 sm:grid-cols-2', label: 'L', icon: Columns3 },
};

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
   IMAGE LIGHTBOX
   ---------------------------------------------------------------- */
function ImageLightbox({
  cert,
  onClose,
}: {
  cert: Certificate;
  onClose: () => void;
}) {
  const [imgScale, setImgScale] = useState(1);
  const imageUrl = safeImageUrl(cert.imageUrl);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-bg-card rounded-2xl border border-border-subtle overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setImgScale(s => Math.max(0.5, s - 0.2))}
              disabled={imgScale <= 0.5}
              className="p-2 rounded-lg hover:bg-bg-elevated disabled:opacity-30 transition-colors"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-4 h-4 text-text-secondary" />
            </button>
            <span className="text-xs text-text-muted font-medium min-w-[50px] text-center">
              {Math.round(imgScale * 100)}%
            </span>
            <button
              onClick={() => setImgScale(s => Math.min(3, s + 0.2))}
              disabled={imgScale >= 3}
              className="p-2 rounded-lg hover:bg-bg-elevated disabled:opacity-30 transition-colors"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-4 h-4 text-text-secondary" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-bg-elevated transition-colors"
              aria-label="Open in new tab"
            >
              <ExternalLink className="w-4 h-4 text-text-secondary" />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-bg-elevated transition-colors"
              aria-label="Close viewer"
            >
              <X className="w-4 h-4 text-text-secondary" />
            </button>
          </div>
        </div>

        <div className="overflow-auto max-h-[calc(90vh-60px)] flex justify-center p-4">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={cert.description}
              className="max-w-full h-auto object-contain rounded-lg shadow-2xl transition-transform duration-200"
              style={{ transform: `scale(${imgScale})`, transformOrigin: 'center center' }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <FileImage className="w-12 h-12 text-text-dim mb-3" />
              <p className="text-sm text-text-muted">Image not available</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ----------------------------------------------------------------
   CERT CARD
   ---------------------------------------------------------------- */
function CertCard({
  cert,
  compact,
  index,
  onOpen,
}: {
  cert: Certificate;
  compact: boolean;
  index: number;
  onOpen: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const imageUrl = safeImageUrl(cert.imageUrl);
  const _linkUrl = safeUrl(cert.link);
  const isPdf = cert.type === 'pdf';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
      transition={{ delay: index * 0.04, type: 'spring', stiffness: 260, damping: 24 }}
      whileHover={{ scale: 1.02, y: -3, transition: { type: 'spring' as const, stiffness: 300, damping: 25 } }}
      className={`
        group relative rounded-xl border border-border-subtle
        hover:border-primary-cyan/30 transition-all duration-300
        bg-bg-elevated overflow-hidden cursor-pointer
        ${compact ? 'p-3' : 'p-4'}
      `}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onOpen(); }}
      aria-label={`Certificate: ${cert.description.split(' - ')[0]}`}
    >
      <div
        className={`bg-bg-card rounded-lg mb-3 overflow-hidden flex items-center justify-center ${
          compact ? 'aspect-[3/2]' : 'aspect-video'
        }`}
      >
        {isPdf ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-bg-dark">
            <FileText className="w-8 h-8 text-primary-violet" />
            <span className="text-[10px] text-text-dim font-medium uppercase tracking-wider">
              PDF Document
            </span>
          </div>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={cert.description}
            className="w-full h-full object-contain opacity-70 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-500"
            loading="lazy"
            onError={e => {
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

      {cert.category && !compact && (
        <span className="absolute top-3 right-3 px-1.5 py-0.5 text-[9px] font-medium rounded-md bg-bg-dark/80 backdrop-blur-sm text-text-dim border border-border-subtle/50">
          {cert.category}
        </span>
      )}

      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 rounded-xl shadow-[inset_0_0_30px_rgba(6,182,212,0.08)]" />
      </div>

      {/* Hover glow effect */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1, opacity: 0.15 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-cyan/20 via-transparent to-primary-violet/20 pointer-events-none"
      />
    </motion.div>
  );
}

/* ----------------------------------------------------------------
   CERT PANEL (CONSOLIDATED)
   ---------------------------------------------------------------- */
export function CertPanel({
  categories,
  loading,
  limit = 6,
  compact = false,
}: CertPanelProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [expanded, setExpanded] = useState(false);
  const [gridSize, setGridSize] = useState<GridSize>('medium');
  const [viewerCert, setViewerCert] = useState<Certificate | null>(null);
  const { settings } = useSettings();

  const isCompactView = compact;

  const allCerts = useMemo(
    () => categories.flatMap(cat => cat.certificates),
    [categories]
  );

  const filteredCerts = useMemo(() => {
    if (activeCategory === 'all') return allCerts;
    return allCerts.filter(cert => cert.categorySlug === activeCategory);
  }, [allCerts, activeCategory]);

  const visibleCerts = useMemo(
    () => (expanded || isCompactView ? filteredCerts : filteredCerts.slice(0, limit)),
    [filteredCerts, expanded, isCompactView, limit]
  );

  const hasMore = !isCompactView && filteredCerts.length > limit;
  const cardCompact = isCompactView || settings.display.compactMode || gridSize === 'small';

  const handleOpen = (cert: Certificate) => {
    setViewerCert(cert);
  };

  const handleClose = () => {
    setViewerCert(null);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-cyan/10 rounded-xl">
            <Award className="w-5 h-5 text-primary-cyan" />
          </div>
          <div>
            <h3 className="text-text-primary font-semibold">Certifications</h3>
            <p className="text-xs text-text-muted">
              {allCerts.length} professional credential{allCerts.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Grid Size Selector */}
        {!isCompactView && (
          <div className="flex items-center gap-1 bg-bg-elevated rounded-lg border border-border-subtle p-0.5">
            {(Object.keys(GRID_CONFIG) as GridSize[]).map(size => {
              const config = GRID_CONFIG[size];
              const Icon = config.icon;
              return (
                <motion.button
                  key={size}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setGridSize(size)}
                  className={`p-1.5 rounded-md transition-colors ${
                    gridSize === size
                      ? 'bg-bg-card text-primary-cyan border border-border-subtle'
                      : 'text-text-muted hover:text-text-secondary'
                  }`}
                  aria-label={`${config.label} view`}
                  aria-pressed={gridSize === size}
                  title={`${config.label} view`}
                >
                  <Icon className="w-4 h-4" />
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      {/* Category Tabs */}
      {loading ? (
        <div className="flex gap-2 mb-5">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="h-8 w-20 rounded-full bg-bg-elevated animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div
          className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-none"
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
          {categories.map(cat => (
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
            className={`grid gap-3 ${GRID_CONFIG[gridSize].cols}`}
          >
            {Array.from({ length: cardCompact ? 8 : 6 }).map((_, i) => (
              <CertSkeleton key={i} compact={cardCompact} />
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
            key={`${activeCategory}-${gridSize}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`grid gap-3 ${GRID_CONFIG[gridSize].cols}`}
          >
            {visibleCerts.map((cert, index) => (
              <CertCard
                key={cert.id}
                cert={cert}
                compact={cardCompact}
                index={index}
                onOpen={() => handleOpen(cert)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* View All / Show Less */}
      {!loading && !isCompactView && hasMore && filteredCerts.length > 0 && (
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
      {!loading && isCompactView && filteredCerts.length > 0 && (
        <div className="flex justify-center mt-5">
          <Link
            to="/certificates"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-primary-cyan bg-primary-cyan/10 border border-primary-cyan/30 rounded-xl hover:bg-primary-cyan/15 transition-colors"
          >
            View All Certificates ({filteredCerts.length})
            <ChevronDown className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Viewers */}
      <AnimatePresence>
        {viewerCert && viewerCert.type === 'pdf' && (
          <PdfViewer
            fileUrl={safeImageUrl(viewerCert.imageUrl) || viewerCert.imageUrl}
            onClose={handleClose}
          />
        )}
        {viewerCert && viewerCert.type === 'image' && (
          <ImageLightbox cert={viewerCert} onClose={handleClose} />
        )}
      </AnimatePresence>
    </div>
  );
}
