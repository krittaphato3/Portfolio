import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Award, ExternalLink, ChevronRight, FileImage } from 'lucide-react';
import type { CategoryData } from '../../lib/types';

// Sanitize URLs to prevent javascript: URI XSS
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

// Validate image URLs for safe rendering
function safeImageUrl(url: string | undefined): string {
  if (!url) return '';
  try {
    const parsed = new URL(url, window.location.origin);
    if (['http:', 'https:', 'data:'].includes(parsed.protocol)) {
      // Block data:text/html URIs that could be used for phishing
      if (parsed.protocol === 'data:' && url.includes('text/html')) return '';
      return url;
    }
    return '';
  } catch {
    // Relative URLs are safe
    return url;
  }
}

interface CertGridProps {
  categories: CategoryData[];
  loading: boolean;
}

export function CertGrid({ categories, loading }: CertGridProps) {
  const [activeCategory, setActiveCategory] = useState(
    categories[0]?.slug || ''
  );

  const activeCerts =
    categories.find((c) => c.slug === activeCategory)?.certificates || [];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-cyan/10 rounded-xl">
            <Award className="w-5 h-5 text-primary-cyan" />
          </div>
          <div>
            <h3 className="text-text-primary font-semibold">Certifications</h3>
            <p className="text-xs text-text-muted">Professional credentials</p>
          </div>
        </div>
        <motion.button
          whileHover={{ x: 3 }}
          className="flex items-center gap-1 text-xs text-primary-cyan hover:text-primary-cyan/80 transition-colors"
        >
          View All <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Category Tabs */}
      {loading ? (
        <div className="flex gap-2 mb-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 w-24 rounded-full bg-bg-elevated animate-pulse" />
          ))}
        </div>
      ) : (
      <div className="flex gap-2 mb-5 overflow-x-auto pb-2 scrollbar-none" role="tablist" aria-label="Certificate categories">
        {categories.map((cat) => (
          <motion.button
            key={cat.slug}
            id={`tab-${cat.slug}`}
            role="tab"
            aria-selected={activeCategory === cat.slug}
            aria-controls={`panel-${cat.slug}`}
            onClick={() => setActiveCategory(cat.slug)}
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
            <span className="ml-1.5 text-text-dim">({cat.certificates.length})</span>
          </motion.button>
        ))}
      </div>
      )}

      {/* Certificates Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          role="tabpanel"
          aria-labelledby={`tab-${activeCategory}`}
        >
          {activeCerts.length === 0 ? (
            <div className="col-span-2 py-8 text-center">
              <FileImage className="w-10 h-10 mx-auto mb-3 text-text-dim" />
              <p className="text-sm text-text-muted">No certificates found in this category.</p>
            </div>
          ) : (
            activeCerts.map((cert, index) => {
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
                  whileHover={{ scale: 1.02 }}
                  className="group relative p-4 bg-bg-elevated rounded-xl border border-border-subtle hover:border-primary-cyan/30 transition-all duration-300"
                  aria-label={`Certificate: ${cert.description.split(' - ')[0]}`}
                >
                  {/* Certificate Image */}
                  <div className="aspect-video bg-bg-dark rounded-lg mb-3 overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={cert.description}
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300"
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
                  <p className="text-sm text-text-primary font-medium line-clamp-2 mb-2">
                    {cert.description.split(' - ')[0]}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-muted">{cert.issuer}</span>
                    <ExternalLink className="w-4 h-4 text-text-dim group-hover:text-primary-cyan transition-colors" />
                  </div>

                  {/* Hover glow */}
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 rounded-xl shadow-[inset_0_0_30px_rgba(6,182,212,0.08)]" />
                  </div>
                </motion.a>
              );
            })
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
