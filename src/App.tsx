import { useState, useEffect, useMemo } from 'react';
import { Routes, Route } from 'react-router';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Dashboard, BentoItem } from './components/Layout/Dashboard';
import { ProfileWidget } from './components/Widgets/ProfileWidget';
import { StatCard } from './components/Widgets/StatCard';
import { CertPanel } from './components/Widgets/CertPanel';
import { SkillsWidget } from './components/Widgets/SkillsWidget';
import { ActivityFeed } from './components/Widgets/ActivityFeed';
import { ProjectsWidget } from './components/Widgets/ProjectsWidget';
import { SystemStatusWidget } from './components/Widgets/SystemStatusWidget';
import { useToast } from './components/UI/Toast';
import { SettingsProvider } from './hooks/useSettings';
import { Folder, Award, Code2, Rocket } from 'lucide-react';
import type { Skill, ActivityItem, CategoryData } from './lib/types';
import { getAllCertificates, getCertificateStats } from './lib/certificates';
import { loadSkillsFromYaml } from './lib/skills';
import {
  fetchRepoCount,
  fetchPinnedRepos,
  type PinnedRepo,
} from './lib/github';
import { defaultSettings, type SettingsState } from './components/UI/SettingsPanel';
import { CertificatesPage } from './pages/CertificatesPage';

/* ============================================================
   APP COMPONENT
   ============================================================ */
function App() {
  const { showToast } = useToast();

  // GitHub data
  const [repoCount, setRepoCount] = useState(0);
  const [pinnedRepos, setPinnedRepos] = useState<PinnedRepo[]>([]);
  const [pinnedUpdates, setPinnedUpdates] = useState<ActivityItem[]>([]);

  // Certificate data
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [certCount, setCertCount] = useState(0);
  const [certUpdates, setCertUpdates] = useState<ActivityItem[]>([]);

  // Skills from YAML
  const [skills, setSkills] = useState<Skill[]>([]);

  // Settings state (lifted for context)
  const [settings, setSettings] = useState<SettingsState>(() => {
    const saved = localStorage.getItem('portfolio-settings');
    if (saved) {
      try {
        return { ...defaultSettings, ...JSON.parse(saved) };
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  // Persist settings to localStorage
  useEffect(() => {
    localStorage.setItem('portfolio-settings', JSON.stringify(settings));
  }, [settings]);

  // Loading states
  const [loading, setLoading] = useState({
    github: true,
    certs: true,
    skills: true,
  });

  // Derived: unique languages count from skills
  const languagesCount = useMemo(() => {
    return new Set(skills.map((s) => s.name)).size;
  }, [skills]);

  // Derived: years coding from GitHub join date (fallback 5)
  const yearsCoding = useMemo(() => {
    const joinYear = 2021;
    return new Date().getFullYear() - joinYear;
  }, []);

  // Derived: merge cert + pinned + github events, sorted by timestamp descending
  const recentUpdates = useMemo(
    () =>
      [...certUpdates, ...pinnedUpdates]
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 5),
    [certUpdates, pinnedUpdates]
  );

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

        // Build recent updates from pinned repos using pushed_at when available
        const updates: ActivityItem[] = pinned.slice(0, 4).map((repo) => ({
          id: `pin-${repo.name}`,
          type: 'feature' as const,
          title: `Pinned: ${repo.name}`,
          description: repo.description || 'Featured project on profile',
          timestamp: repo.pushedAt ? new Date(repo.pushedAt) : new Date(),
          url: repo.url,
        }));
        setPinnedUpdates(updates);
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

        // Build cert updates into separate state (Fix 3)
        const updates: ActivityItem[] = cats
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

        setCertUpdates(updates);
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
    <SettingsProvider settings={settings} updateSettings={setSettings}>
      <div className="min-h-screen bg-bg-dark flex flex-col">
        <Header settings={settings} onSettingsChange={setSettings} />

        <main className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                <div id="dashboard">
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
                        value={languagesCount || 17}
                        icon={Code2}
                        color="emerald"
                        description="Technologies used"
                      />
                    </BentoItem>

                    {/* Row 2: Feature Work (spans 2 cols) + Recent Updates (spans 2 cols) */}
                    <BentoItem span={{ col: 2, row: 1 }}>
                      <div id="feature-work">
                        <ProjectsWidget repos={pinnedRepos} loading={loading.github} />
                      </div>
                    </BentoItem>

                    <BentoItem span={{ col: 2, row: 1 }}>
                      <div id="recent-updates">
                        <ActivityFeed activities={recentUpdates} loading={loading.github || loading.certs} />
                      </div>
                    </BentoItem>

                    {/* Row 3: Skills (spans 2 cols) + Tech Proficiency (spans 1) + Deploy (spans 1) */}
                    <BentoItem span={{ col: 2, row: 1 }}>
                      <div id="skills">
                        <SkillsWidget skills={skills} />
                      </div>
                    </BentoItem>

                    <BentoItem span={{ col: 1, row: 1 }}>
                      <SystemStatusWidget />
                    </BentoItem>

                    <BentoItem span={{ col: 1, row: 1 }}>
                      <StatCard
                        title="Years Coding"
                        value={yearsCoding}
                        icon={Rocket}
                        color="cyan"
                        description="Building projects"
                      />
                    </BentoItem>

                    {/* Row 4: Certifications compact */}
                    <BentoItem span={{ col: 4, row: 1 }}>
                      <div id="certifications">
                        <CertPanel categories={categories} loading={loading.certs} compact />
                      </div>
                    </BentoItem>
                  </Dashboard>
                </div>
              }
            />
            <Route path="/certificates" element={<CertificatesPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </SettingsProvider>
  );
}

export default App;
