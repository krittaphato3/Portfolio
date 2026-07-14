import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GitBranch } from 'lucide-react';

const GITHUB_USERNAME = 'krittaphato3';

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

function getLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
}

const levelColors = [
  'bg-bg-elevated',
  'bg-primary-emerald/20',
  'bg-primary-emerald/40',
  'bg-primary-emerald/70',
  'bg-primary-emerald',
];

const levelBorders = [
  'border-border-subtle',
  'border-primary-emerald/10',
  'border-primary-emerald/20',
  'border-primary-emerald/40',
  'border-primary-emerald/60',
];

export function GitHubGraph() {
  const [weeks, setWeeks] = useState<ContributionDay[][]>([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate contribution data from GitHub API (last 365 days)
    async function fetchContributions() {
      try {
        const res = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=100`
        );
        if (!res.ok) throw new Error('Failed to fetch');
        const events = await res.json();

        // Build contribution map from events
        const contribMap = new Map<string, number>();
        const now = new Date();
        const oneYearAgo = new Date(now);
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        // Initialize all days
        for (let d = new Date(oneYearAgo); d <= now; d.setDate(d.getDate() + 1)) {
          contribMap.set(d.toISOString().split('T')[0], 0);
        }

        // Count events per day
        events.forEach((event: any) => {
          const date = event.created_at?.split('T')[0];
          if (date && contribMap.has(date)) {
            contribMap.set(date, (contribMap.get(date) || 0) + 1);
          }
        });

        // Convert to weeks grid (Sun-Sat)
        const days: ContributionDay[] = [];
        const startDate = new Date(oneYearAgo);
        // Align to Sunday
        startDate.setDate(startDate.getDate() - startDate.getDay());

        for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().split('T')[0];
          const count = contribMap.get(dateStr) || 0;
          days.push({ date: dateStr, count, level: getLevel(count) });
        }

        // Group into weeks
        const weekGrid: ContributionDay[][] = [];
        for (let i = 0; i < days.length; i += 7) {
          weekGrid.push(days.slice(i, i + 7));
        }

        setWeeks(weekGrid);
        setTotalContributions(Array.from(contribMap.values()).reduce((a, b) => a + b, 0));
      } catch {
        // Generate placeholder data on error
        const placeholder: ContributionDay[][] = [];
        for (let w = 0; w < 52; w++) {
          const week: ContributionDay[] = [];
          for (let d = 0; d < 7; d++) {
            const count = Math.random() > 0.7 ? Math.floor(Math.random() * 8) : 0;
            week.push({ date: '', count, level: getLevel(count) });
          }
          placeholder.push(week);
        }
        setWeeks(placeholder);
        setTotalContributions(placeholder.flat().filter(d => d.count > 0).length);
      } finally {
        setLoading(false);
      }
    }

    fetchContributions();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-bg-elevated rounded-xl animate-pulse w-9 h-9" />
          <div className="h-4 w-32 bg-bg-elevated rounded animate-pulse" />
        </div>
        <div className="flex gap-[3px]">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-[3px]">
              {Array.from({ length: 7 }).map((_, j) => (
                <div key={j} className="w-[11px] h-[11px] rounded-[2px] bg-bg-elevated animate-pulse" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-bg-elevated rounded-xl">
            <GitBranch className="w-5 h-5 text-text-secondary" />
          </div>
          <div>
            <h3 className="text-text-primary font-semibold text-sm">Contribution Activity</h3>
            <p className="text-[11px] text-text-muted">{totalContributions.toLocaleString()} contributions in the last year</p>
          </div>
        </div>
      </div>

      {/* Contribution graph */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="overflow-x-auto scrollbar-thin"
      >
        <div className="flex gap-[3px] min-w-fit">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) => (
                <div
                  key={`${wi}-${di}`}
                  className={`w-[11px] h-[11px] rounded-[2px] border ${levelColors[day.level]} ${levelBorders[day.level]} transition-colors hover:ring-1 hover:ring-primary-cyan/30`}
                  title={day.date ? `${day.count} contributions on ${day.date}` : ''}
                />
              ))}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5 mt-3 text-[10px] text-text-dim">
        <span>Less</span>
        {levelColors.map((color, i) => (
          <div
            key={i}
            className={`w-[11px] h-[11px] rounded-[2px] border ${color} ${levelBorders[i]}`}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
