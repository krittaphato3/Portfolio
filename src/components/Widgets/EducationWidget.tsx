import { motion, useInView } from 'framer-motion';
import { GraduationCap, MapPin, Cpu } from 'lucide-react';
import { useRef, useState } from 'react';

interface EducationEntry {
  institution: string;
  degree: string;
  period: string;
  location: string;
  status: 'completed' | 'pursuing';
  logoUrl?: string;
  logoFallback: React.ElementType;
}

const educationData: EducationEntry[] = [
  {
    institution: 'KMUTT',
    degree: 'Bachelor of Engineering in Computer Engineering',
    period: '2024 – Present',
    location: 'Bang Mot, Thung Khru, Bangkok',
    status: 'pursuing',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Sublogo_of_King_Mongkut%27s_University_of_Technology_Thonburi.svg/960px-Sublogo_of_King_Mongkut%27s_University_of_Technology_Thonburi.svg.png',
    logoFallback: Cpu,
  },
  {
    institution: 'Sarasas Witaed Samut Prakan',
    degree: 'High School Diploma (Matayom 6)',
    period: '2021 – 2024',
    location: 'Samut Prakan, Thailand',
    status: 'completed',
    logoFallback: GraduationCap,
  },
];

const statusStyles = {
  pursuing: {
    label: 'Currently Pursuing',
    bg: 'bg-primary-cyan/10',
    text: 'text-primary-cyan',
    border: 'border-primary-cyan/20',
  },
  completed: {
    label: 'Completed',
    bg: 'bg-primary-emerald/10',
    text: 'text-primary-emerald',
    border: 'border-primary-emerald/20',
  },
} as const;

function LogoIcon({ entry, index }: { entry: EducationEntry; index: number }) {
  const [imgError, setImgError] = useState(false);
  const FallbackIcon = entry.logoFallback;
  const showImage = entry.logoUrl && !imgError;

  return (
    <motion.div
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2 + index * 0.15, type: 'spring', stiffness: 260, damping: 20 }}
      className="relative shrink-0"
    >
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-cyan via-primary-violet to-primary-emerald p-[2px]">
        <div className="w-full h-full rounded-full bg-bg-elevated flex items-center justify-center overflow-hidden">
          {showImage ? (
            <img
              src={entry.logoUrl}
              alt={`${entry.institution} logo`}
              className="w-8 h-8 object-contain"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <FallbackIcon className="w-5 h-5 text-text-secondary" />
          )}
        </div>
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: EducationEntry['status'] }) {
  const styles = statusStyles[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${styles.bg} ${styles.text} ${styles.border}`}>
      {styles.label}
    </span>
  );
}

export function EducationWidget() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <div ref={containerRef} className="p-6 h-full flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex items-center gap-3 mb-5"
      >
        <div className="p-2 bg-primary-cyan/10 rounded-xl">
          <GraduationCap className="w-5 h-5 text-primary-cyan" />
        </div>
        <div>
          <h3 className="text-text-primary font-semibold">Education</h3>
          <p className="text-xs text-text-muted">Academic background</p>
        </div>
      </motion.div>

      {/* Timeline */}
      <div className="relative flex-1">
        {/* Vertical timeline line */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute left-[23px] top-2 bottom-2 w-px bg-gradient-to-b from-primary-cyan/40 via-primary-violet/30 to-primary-emerald/20 origin-top"
          style={{ transformOrigin: 'top' }}
        />

        {/* Entries */}
        <div className="space-y-6">
          {educationData.map((entry, index) => (
            <motion.div
              key={entry.institution}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{
                delay: 0.35 + index * 0.15,
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="relative pl-16"
            >
              {/* Logo positioned on the timeline line */}
              <div className="absolute left-0 top-0">
                <LogoIcon entry={entry} index={index} />
              </div>

              {/* Card content */}
              <div className="p-4 bg-bg-elevated rounded-xl border border-border-subtle">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-sm font-semibold text-text-primary leading-tight">
                    {entry.institution}
                  </h4>
                  <StatusBadge status={entry.status} />
                </div>

                <p className="text-xs text-text-secondary mb-2">
                  {entry.degree}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-text-dim">
                  <span className="font-medium">{entry.period}</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {entry.location}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
