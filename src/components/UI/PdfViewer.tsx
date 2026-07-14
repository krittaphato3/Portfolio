'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Download, LinkIcon, Building2, Calendar } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  fileUrl: string;
  onClose: () => void;
  certLink?: string;
  description?: string;
  issuer?: string;
  date?: string;
}

export function PdfViewer({ fileUrl, onClose, certLink, description, issuer, date }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const onDocumentLoadError = (err: Error) => {
    setError('Failed to load PDF. Please try again.');
    setLoading(false);
    console.error('PDF load error:', err);
  };

  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 3));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));
  const prevPage = () => setCurrentPage(p => Math.max(1, p - 1));
  const nextPage = () => setCurrentPage(p => Math.min(numPages, p + 1));

  return (
    <AnimatePresence>
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
                onClick={zoomOut}
                disabled={scale <= 0.5}
                className="p-2 rounded-lg hover:bg-bg-elevated disabled:opacity-30 transition-colors"
                aria-label="Zoom out"
              >
                <ZoomOut className="w-4 h-4 text-text-secondary" />
              </button>
              <span className="text-xs text-text-muted font-medium min-w-[50px] text-center">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={zoomIn}
                disabled={scale >= 3}
                className="p-2 rounded-lg hover:bg-bg-elevated disabled:opacity-30 transition-colors"
                aria-label="Zoom in"
              >
                <ZoomIn className="w-4 h-4 text-text-secondary" />
              </button>
            </div>

            {numPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={prevPage}
                  disabled={currentPage <= 1}
                  className="p-2 rounded-lg hover:bg-bg-elevated disabled:opacity-30 transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4 text-text-secondary" />
                </button>
                <span className="text-xs text-text-muted font-medium">
                  Page {currentPage} of {numPages}
                </span>
                <button
                  onClick={nextPage}
                  disabled={currentPage >= numPages}
                  className="p-2 rounded-lg hover:bg-bg-elevated disabled:opacity-30 transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4 text-text-secondary" />
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              {certLink && (
                <a
                  href={certLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary-cyan bg-primary-cyan/10 border border-primary-cyan/30 rounded-lg hover:bg-primary-cyan/20 transition-colors"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  View Certificate
                </a>
              )}
              <a
                href={fileUrl}
                download
                className="p-2 rounded-lg hover:bg-bg-elevated transition-colors"
                aria-label="Download PDF"
              >
                <Download className="w-4 h-4 text-text-secondary" />
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
            {loading && (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-primary-cyan border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {error && (
              <div className="text-center py-20">
                <p className="text-red-400 text-sm">{error}</p>
                <button
                  onClick={onClose}
                  className="mt-4 px-4 py-2 bg-bg-elevated rounded-lg text-text-secondary text-sm hover:bg-bg-hover transition-colors"
                >
                  Close
                </button>
              </div>
            )}
            {!loading && !error && (
              <Document
                file={fileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={null}
              >
                <Page
                  pageNumber={currentPage}
                  scale={scale}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  className="shadow-2xl"
                />
              </Document>
            )}
          </div>

          {/* Metadata footer */}
          {(description || issuer || date) && (
            <div className="px-5 py-4 border-t border-border-subtle bg-bg-elevated/50">
              {description && <h4 className="text-sm font-semibold text-text-primary mb-2">{description}</h4>}
              <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted">
                {issuer && (
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-text-dim" />
                    {issuer}
                  </span>
                )}
                {date && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-text-dim" />
                    {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
