import * as yaml from 'js-yaml';
import type { Certificate, CertificateConfig, CategoryData } from '../types';

// Dynamic import of all config files in src/config/certs/
const certModules = import.meta.glob('/config/certs/*.yml', {
  query: '?raw',
  import: 'original',
});

// Map filename slug → display name and public directory name
const certConfigMap: Record<string, { name: string; dir: string }> = {
  'cyber-security': { name: 'Cyber Security', dir: 'Cyber Security' },
  'internship-forage': { name: 'Internship (Forage)', dir: 'Internship (Forage)' },
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

      // Extract slug from path like "/config/certs/cyber-security.yml"
      const normalizedPath = path.replace(/\\/g, '/');
      const slugMatch = normalizedPath.match(/\/config\/certs\/([^/]+)\.yml$/);
      if (!slugMatch) continue;

      const fileSlug = slugMatch[1];
      const meta = certConfigMap[fileSlug];
      if (!meta) continue;

      const categoryName = meta.name;
      const categorySlug = slugify(categoryName);
      const publicDir = meta.dir;

      // Validate and filter certificate entries
      const validCerts = (config?.certificates || []).filter(
        (cert) => cert && cert.description && cert.link
      );

      const certificates: Certificate[] = validCerts.map((cert, index) => {
        const imageUrl = cert.image ? `/certs/${publicDir}/${cert.image}` : '';
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
        name: categoryName,
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
