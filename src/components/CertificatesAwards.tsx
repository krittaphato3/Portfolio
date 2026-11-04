import React, { useState } from 'react';
import { Award, ShieldCheck, Trophy, GraduationCap, CheckCircle, Calendar, Key } from 'lucide-react';
import { CERTIFICATES_AWARDS } from '../data/portfolioData';

const AWARD_CATEGORIES = [
  'All',
  'Competition & Hackathon',
  'Academic Distinction',
  'Professional Certification',
] as const;

export const CertificatesAwards: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredAwards = CERTIFICATES_AWARDS.filter(
    (item) => activeCategory === 'All' || item.category === activeCategory
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Competition & Hackathon':
        return <Trophy className="w-4 h-4 text-gold-400" />;
      case 'Academic Distinction':
        return <GraduationCap className="w-4 h-4 text-brand-cyan" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-brand-violet" />;
    }
  };

  return (
    <section id="certificates" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/25 text-gold-400 text-xs font-mono mb-3">
          <Award className="w-3.5 h-3.5" />
          <span>Verified Credentials &amp; Honors</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
          Certificates &amp; Honors
        </h2>
        <p className="text-slate-400 text-sm sm:text-base mt-2">
          Recognized distinctions spanning industry hackathons, KMUTT Computer Engineering academic achievements, and professional certifications.
        </p>

        {/* Filter Tabs - Shown if awards are present */}
        {CERTIFICATES_AWARDS.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {AWARD_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-medium font-mono transition-all ${
                  activeCategory === cat
                    ? 'bg-gold-500 text-obsidian-950 font-bold shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                    : 'bg-obsidian-900/60 hover:bg-obsidian-850 text-slate-400 hover:text-white border border-white/[0.06]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid of Credentials or Clean Placeholder State */}
      {filteredAwards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAwards.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-3xl bg-obsidian-900/70 border border-white/[0.08] hover:border-gold-500/40 p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_16px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(212,175,55,0.1)] hover:-translate-y-1 backdrop-blur-md"
            >
              {/* Ambient Corner Flare */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gold-500/10 to-transparent rounded-full blur-2xl pointer-events-none group-hover:from-gold-500/20 transition-all" />

              <div>
                {/* Category Header */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-obsidian-950 border border-white/[0.06]">
                      {getCategoryIcon(item.category)}
                    </div>
                    <span className="text-[11px] font-mono text-slate-300 uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-gold-400/90 font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{item.date}</span>
                  </span>
                </div>

                {/* Title & Issuer */}
                <h3 className="text-lg sm:text-xl font-bold font-display text-white group-hover:text-gold-200 transition-colors">
                  {item.title}
                </h3>
                <div className="text-xs font-mono text-brand-cyan mt-1 mb-3">
                  {item.issuer}
                </div>

                {/* Description */}
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-5">
                  {item.description}
                </p>
              </div>

              <div>
                {/* Competency tags */}
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/[0.06] mb-4">
                  {item.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded-md text-[10px] font-mono text-slate-300 bg-obsidian-950/80 border border-white/[0.06]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Verification Stamp */}
                <div className="flex items-center justify-between pt-2 text-[11px] font-mono text-slate-500 border-t border-white/[0.04]">
                  <div className="flex items-center gap-1.5 truncate">
                    <Key className="w-3 h-3 text-gold-400/70 shrink-0" />
                    <span className="truncate">ID: {item.credentialId}</span>
                  </div>
                  <div className="flex items-center gap-1 text-brand-emerald font-semibold shrink-0">
                    <CheckCircle className="w-3 h-3" />
                    <span>Verified</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-obsidian-900/40 border border-dashed border-white/[0.12] p-10 sm:p-14 text-center max-w-2xl mx-auto backdrop-blur-sm relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-gold-500/10 border border-gold-500/20 text-gold-400 flex items-center justify-center mx-auto mb-4">
            <Award className="w-7 h-7" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold font-display text-white mb-2">
            Credentials Vault Prepared
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed max-w-md mx-auto">
            Certificates, hackathon recognitions, and academic honors will be showcased here once officially issued and verified.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-obsidian-950/80 border border-white/[0.08] text-[11px] font-mono text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
            <span>Actively pursuing hackathons &amp; academic distinctions at KMUTT</span>
          </div>
        </div>
      )}
    </section>
  );
};
