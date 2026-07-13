import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Dashboard, BentoItem } from './components/Layout/Dashboard';
import { ProfileWidget } from './components/Widgets/ProfileWidget';
import { StatCard } from './components/Widgets/StatCard';
import { CertGrid } from './components/Widgets/CertGrid';
import { CertFolder } from './components/Widgets/CertFolder';
import { SkillsWidget } from './components/Widgets/SkillsWidget';
import { ActivityFeed } from './components/Widgets/ActivityFeed';
import { ProjectsWidget } from './components/Widgets/ProjectsWidget';
import { SystemStatusWidget } from './components/Widgets/SystemStatusWidget';
import { useToast } from './components/UI/Toast';
import { Folder, Award, Code2, Rocket } from 'lucide-react';
import type { Skill, ActivityItem, CategoryData } from './lib/types';
import { getAllCertificates, getCertificateStats } from './lib/certificates';
import { loadSkillsFromYaml } from './lib/skills';
import {
  fetchRepoCount,
  fetchPinnedRepos,
  type PinnedRepo,
} from './lib/github';

/* ============================================================
   APP COMPONENT
   ============================================================ */
function App() {
  const { showToast } = useToast();

  // GitHub data
  const [repoCount, setRepoCount] = useState(0);
  const [pinnedRepos, setPinnedRepos] = useState<PinnedRepo[]>([]);
  const [recentUpdates, setRecentUpdates] = useState<ActivityItem[]>([]);

  // Certificate data
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [certCount, setCertCount] = useState(0);

  // Skills from YAML
  const [skills, setSkills] = useState<Skill[]>([]);

  // Loading states
  const [loading, setLoading] = useState({
    github: true,
    certs: true,
    skills: true,
  });

  // Fetch GitHub data
  useEffect(() => {
    async function loadGitHub() {
      try {
        const [count, pinned] = await Promise.all([
          fetchRepoCount(),
          fetchPinnedRepos(),
        ]);
        setRepoCount(count);
        setPinnedRepos(pinned);

        // Build recent updates from pinned repos
        const updates: ActivityItem[] = pinned.slice(0, 4).map((repo) => ({
          id: `pin-${repo.name}`,
          type: 'feature' as const,
          title: `Pinned: ${repo.name}`,
          description: repo.description || 'Featured project on profile',
          timestamp: new Date(), // Pinned repos don't have a timestamp
          url: repo.url,
        }));
        setRecentUpdates(updates);
      } catch (err) {
        showToast(
          'Could not load GitHub data. Check your connection or token.',
          'error'
        );
      } finally {
        setLoading((prev) => ({ ...prev, github: false }));
      }
    }
    loadGitHub();
  }, []);

  // Fetch certificates from file-based CMS
  useEffect(() => {
    async function loadCerts() {
      try {
        const [cats, stats] = await Promise.all([
          getAllCertificates(),
          getCertificateStats(),
        ]);
        setCategories(cats);
        setCertCount(stats.total);

        // Add cert updates to recent activity
        const certUpdates: ActivityItem[] = cats
          .flatMap((cat) =>
            cat.certificates.slice(0, 1).map((cert) => ({
              id: `cert-${cert.id}`,
              type: 'cert' as const,
              title: `New Certification`,
              description: cert.description.split(' - ')[0],
              timestamp: cert.date ? new Date(cert.date) : new Date(),
            }))
          )
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          .slice(0, 2);

        setRecentUpdates((prev) => {
          const combined = [...certUpdates, ...prev];
          return combined.slice(0, 5);
        });
      } catch (err) {
        showToast(
          'Could not load certificates. Check the config files in public/certs/.',
          'error'
        );
      } finally {
        setLoading((prev) => ({ ...prev, certs: false }));
      }
    }
    loadCerts();
  }, []);

  // Fetch skills from YAML config
  useEffect(() => {
    async function loadSkills() {
      try {
        const loaded = await loadSkillsFromYaml();
        setSkills(loaded);
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('Failed to load skills from YAML:', err);
        }
      } finally {
        setLoading((prev) => ({ ...prev, skills: false }));
      }
    }
    loadSkills();
  }, []);

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col">
      <Header />

      <main className="flex-1">
        <Dashboard>
          {/* Row 1: Profile + 3 Stats */}
          <BentoItem span={{ col: 1, row: 2 }}>
            <ProfileWidget />
          </BentoItem>

          <BentoItem span={{ col: 1, row: 1 }}>
            <StatCard
              title="Total Projects"
              value={repoCount}
              icon={Folder}
              color="cyan"
              description="Public repositories"
            />
          </BentoItem>

          <BentoItem span={{ col: 1, row: 1 }}>
            <StatCard
              title="Certifications"
              value={certCount}
              icon={Award}
              color="violet"
              description="Professional credentials"
            />
          </BentoItem>

          <BentoItem span={{ col: 1, row: 1 }}>
            <StatCard
              title="Languages"
              value={17}
              icon={Code2}
              color="emerald"
              description="Technologies used"
            />
          </BentoItem>

          {/* Row 2: Feature Work (spans 2 cols) + Recent Updates (spans 2 cols) */}
          <BentoItem span={{ col: 2, row: 1 }}>
            <ProjectsWidget repos={pinnedRepos} loading={loading.github} />
          </BentoItem>

          <BentoItem span={{ col: 2, row: 1 }}>
            <ActivityFeed activities={recentUpdates} loading={loading.github || loading.certs} />
          </BentoItem>

          {/* Row 3: Skills (spans 2 cols) + Tech Proficiency (spans 1) + Deploy (spans 1) */}
          <BentoItem span={{ col: 2, row: 1 }}>
            <SkillsWidget skills={skills.length > 0 ? skills : []} />
          </BentoItem>

          <BentoItem span={{ col: 1, row: 1 }}>
            <SystemStatusWidget />
          </BentoItem>

          <BentoItem span={{ col: 1, row: 1 }}>
            <StatCard
              title="Years Coding"
              value={5}
              icon={Rocket}
              color="cyan"
              description="Building projects"
            />
          </BentoItem>

          {/* Row 4: Certifications full width */}
          <BentoItem span={{ col: 4, row: 1 }}>
            <CertGrid categories={categories} loading={loading.certs} />
          </BentoItem>

          {/* Row 5: Certificate Folder (general certs view) */}
          <BentoItem span={{ col: 4, row: 1 }}>
            <CertFolder categories={categories} loading={loading.certs} />
          </BentoItem>
        </Dashboard>
      </main>

      <Footer />
    </div>
  );
}

export default App;
