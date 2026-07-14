import * as yaml from 'js-yaml';
import type { Certificate, CertificateConfig, CategoryData } from '../types';

// Dynamic import of all config.yml files in the certs directory
const certModules = import.meta.glob('/public/certs/*/config.yml', {
  query: '?raw',
  import: 'default',
});

// Map of category slugs to their human-readable names
const categoryNames: Record<string, string> = {
  'cyber-security': 'Cyber Security',
  'web-development': 'Web Development',
  'system-analyst': 'System Analyst',
};

const PDF_EXTENSIONS = new Set(['.pdf']);

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function detectFileType(filename: string): 'image' | 'pdf' {
  const ext = filename.slice(filename.lastIndexOf('.')).toLowerCase();
  return PDF_EXTENSIONS.has(ext) ? 'pdf' : 'image';
}

export async function getAllCertificates(): Promise<CategoryData[]> {
  const categories: CategoryData[] = [];

  for (const [path, loader] of Object.entries(certModules)) {
    try {
      const raw = (await loader()) as string;
      const config = yaml.load(raw) as CertificateConfig;

      // Normalize path for Windows compatibility
      const normalizedPath = path.replace(/\\/g, '/');
      const pathMatch = normalizedPath.match(/\/certs\/([^/]+)\//);
      if (!pathMatch) continue;

      const categoryName = pathMatch[1];
      const categorySlug = slugify(categoryName);

      // Validate and filter certificate entries
      const validCerts = (config?.certificates || []).filter(
        (cert) => cert && cert.description && cert.link
      );

      const certificates: Certificate[] = validCerts.map((cert, index) => {
        const imageUrl = cert.image ? `/certs/${categoryName}/${cert.image}` : '';
        const fileType = cert.image ? detectFileType(cert.image) : 'image';

        return {
          id: `${categorySlug}-${index}`,
          image: cert.image,
          imageUrl,
          link: cert.link,
          description: cert.description,
          issuer: cert.issuer || 'Unknown',
          date: cert.date || '',
          category: categoryName,
          categorySlug,
          type: fileType,
        };
      });

      categories.push({
        name: categoryNames[categorySlug] || categoryName,
        slug: categorySlug,
        certificates,
      });
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(`Error loading certificates from ${path}:`, error);
      }
    }
  }

  return categories.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getCertificatesByCategory(
  categorySlug: string
): Promise<Certificate[]> {
  const categories = await getAllCertificates();
  const category = categories.find((c) => c.slug === categorySlug);
  return category?.certificates || [];
}

export async function getCertificateStats(): Promise<{
  total: number;
  byCategory: Record<string, number>;
  recentCount: number;
}> {
  const categories = await getAllCertificates();
  const allCerts = categories.flatMap((c) => c.certificates);

  const byCategory: Record<string, number> = {};
  categories.forEach((cat) => {
    byCategory[cat.name] = cat.certificates.length;
  });

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const recentCount = allCerts.filter((cert) => {
    if (!cert.date) return false;
    return new Date(cert.date) >= sixMonthsAgo;
  }).length;

  return {
    total: allCerts.length,
    byCategory,
    recentCount,
  };
}
