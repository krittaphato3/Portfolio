import { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router';
import { AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Dashboard, BentoItem } from './components/Layout/Dashboard';
import { ProfileWidget } from './components/Widgets/ProfileWidget';
import { StatCard } from './components/Widgets/StatCard';
import { CertPanel, ImageLightbox, safeUrl, safeImageUrl } from './components/Widgets/CertPanel';
import { PdfViewer } from './components/UI/PdfViewer';
import { SkillsWidget } from './components/Widgets/SkillsWidget';
import { ActivityFeed } from './components/Widgets/ActivityFeed';
import { ProjectsWidget } from './components/Widgets/ProjectsWidget';
import { SystemStatusWidget } from './components/Widgets/SystemStatusWidget';
import { useToast } from './components/UI/Toast';
import { SettingsProvider } from './hooks/useSettings';
import { Folder, Award, Code2, Rocket } from 'lucide-react';
import type { Skill, ActivityItem, CategoryData, Certificate } from './lib/types';
import { getAllCertificates, getCertificateStats } from './lib/certificates';
import { loadSkillsFromYaml } from './lib/skills';
import {
  fetchRepoCount,
  fetchPinnedRepos,
  fetchGitHubUser,
  fetchGitHubEvents,
  type PinnedRepo,
  type GitHubUserProfile,
} from './lib/github';
import { defaultSettings, type SettingsState } from './components/UI/SettingsPanel';

// Lazy load heavy pages
const CertificatesPage = lazy(() => import('./pages/CertificatesPage').then(m => ({ default: m.CertificatesPage })));

/* ============================================================
   APP COMPONENT
   ============================================================ */
function App() {
  const { showToast } = useToast();

  // GitHub data
  const [repoCount, setRepoCount] = useState(0);
  const [pinnedRepos, setPinnedRepos] = useState<PinnedRepo[]>([]);
  const [githubEvents, setGithubEvents] = useState<ActivityItem[]>([]);
  const [githubProfile, setGithubProfile] = useState<GitHubUserProfile | null>(null);

  // Certificate data
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [certCount, setCertCount] = useState(0);
  const [certUpdates, setCertUpdates] = useState<ActivityItem[]>([]);

  // Viewer state (lifted so ActivityFeed can open certs)
  const [viewerCertId, setViewerCertId] = useState<string | null>(null);

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

  // Derived: merge cert + real GitHub events, sorted by timestamp descending
  const recentUpdates = useMemo(
    () =>
      [...certUpdates, ...githubEvents]
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 10),
    [certUpdates, githubEvents]
  );

  // Derived: find cert by ID for viewer
  const viewerCert = useMemo(() => {
    if (!viewerCertId) return null;
    return categories
      .flatMap((cat) => cat.certificates)
      .find((c) => c.id === viewerCertId) || null;
  }, [viewerCertId, categories]);

  // Handler: open cert in viewer from ActivityFeed
  const handleCertClick = (certId: string) => {
    setViewerCertId(certId);
  };

  // Fetch GitHub data (events poll every 5 minutes, profile/repos on mount)
  useEffect(() => {
    let isActive = true;

    async function loadGitHub() {
      try {
        const [count, pinned, profile, events] = await Promise.all([
          fetchRepoCount(),
          fetchPinnedRepos(),
          fetchGitHubUser(),
          fetchGitHubEvents(),
        ]);
        if (!isActive) return;
        setRepoCount(count);
        setPinnedRepos(pinned);
        setGithubProfile(profile);
        setGithubEvents(events);
      } catch {
        if (isActive) {
          showToast(
            'Could not load GitHub data. Check your connection or token.',
            'error'
          );
        }
      } finally {
        if (isActive) setLoading((prev) => ({ ...prev, github: false }));
      }
    }

    loadGitHub();
    // Poll GitHub events every 5 minutes (keep profile/repos on mount only)
    const interval = setInterval(() => {
      fetchGitHubEvents().then((events) => {
        if (isActive) setGithubEvents(events);
      }).catch(() => {});
    }, 300_000);
    return () => { isActive = false; clearInterval(interval); };
  }, [showToast]);

  // Fetch certificates from file-based CMS (polls every 60s for YAML changes)
  useEffect(() => {
    let isActive = true;

    async function loadCerts() {
      try {
        const [cats, stats] = await Promise.all([
          getAllCertificates(),
          getCertificateStats(),
        ]);
        if (!isActive) return;

        setCategories(cats);
        setCertCount(stats.total);

        // Build cert activity items from ALL certs with full metadata
        const updates: ActivityItem[] = cats
          .flatMap((cat) =>
            cat.certificates.map((cert) => ({
              id: `cert-${cert.id}`,
              type: 'cert' as const,
              title: cert.description.split(' - ')[0] || cert.description,
              description: cert.issuer || cat.name,
              timestamp: cert.date ? new Date(cert.date) : new Date(),
              url: cert.link || undefined,
              certificateId: cert.id,
            }))
          )
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        setCertUpdates(updates);
      } catch {
        if (isActive) {
          showToast(
            'Could not load certificates. Check the config files in public/certs/.',
            'error'
          );
        }
      } finally {
        if (isActive) setLoading((prev) => ({ ...prev, certs: false }));
      }
    }

    loadCerts();
    const interval = setInterval(loadCerts, 60_000);
    return () => { isActive = false; clearInterval(interval); };
  }, [showToast]);

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

        <main id="main-content" className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                <div id="dashboard">
                  <Dashboard>
                    {/* Row 1: Profile + 3 Stats */}
                    <BentoItem span={{ col: 1, row: 2 }}>
                      <ProfileWidget githubProfile={githubProfile} />
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
                        <ActivityFeed
                          activities={recentUpdates}
                          loading={loading.github || loading.certs}
                          onCertClick={handleCertClick}
                        />
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
                        <CertPanel
                          categories={categories}
                          loading={loading.certs}
                          compact
                          onCertOpen={handleCertClick}
                        />
                      </div>
                    </BentoItem>
                  </Dashboard>
                </div>
              }
            />
            <Route
              path="/certificates"
              element={
                <Suspense
                  fallback={
                    <div className="min-h-screen bg-bg-dark flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 border-3 border-primary-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-text-secondary">Loading certificates...</p>
                      </div>
                    </div>
                  }
                >
                  <CertificatesPage />
                </Suspense>
              }
            />
          </Routes>
        </main>

        <Footer />

        {/* Certificate viewers — rendered at App level (outside BentoItems)
            to escape CSS transform containing blocks that break fixed positioning */}
        <AnimatePresence>
          {viewerCert && viewerCert.type === 'pdf' && (
            <PdfViewer
              fileUrl={safeImageUrl(viewerCert.imageUrl) || viewerCert.imageUrl}
              onClose={() => setViewerCertId(null)}
              certLink={safeUrl(viewerCert.link)}
              description={viewerCert.description}
              issuer={viewerCert.issuer}
              date={viewerCert.date}
            />
          )}
          {viewerCert && viewerCert.type === 'image' && (
            <ImageLightbox cert={viewerCert} onClose={() => setViewerCertId(null)} />
          )}
        </AnimatePresence>
      </div>
    </SettingsProvider>
  );
}

export default App;