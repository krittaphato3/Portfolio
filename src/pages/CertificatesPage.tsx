import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowLeft, Award } from 'lucide-react';
import { CertPanel } from '../components/Widgets/CertPanel';
import { getAllCertificates, getCertificateStats } from '../lib/certificates';
import type { CategoryData } from '../lib/types';

export function CertificatesPage() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [certCount, setCertCount] = useState(0);

  useEffect(() => {
    async function loadCerts() {
      try {
        const [cats, stats] = await Promise.all([
          getAllCertificates(),
          getCertificateStats(),
        ]);
        setCategories(cats);
        setCertCount(stats.total);
      } catch {
        // Errors handled silently; CertPanel shows empty state
      } finally {
        setLoading(false);
      }
    }
    loadCerts();
  }, []);

  return (
    <div className="min-h-screen bg-bg-dark">
      {/* Hero Header */}
      <div className="border-b border-border-subtle bg-bg-card/50 backdrop-blur-sm">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary-cyan transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring' as const, stiffness: 300, damping: 30 }}
            className="flex items-center gap-4"
          >
            <div className="p-3 bg-primary-violet/10 rounded-2xl">
              <Award className="w-7 h-7 text-primary-violet" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">
                Certifications
              </h1>
              <p className="text-sm text-text-muted">
                {loading
                  ? 'Loading credentials...'
                  : `${certCount} professional credential${certCount !== 1 ? 's' : ''}`}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Certificates Grid */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-6">
        <CertPanel categories={categories} loading={loading} />
      </div>
    </div>
  );
}
