export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  status: 'active' | 'completed' | 'in-progress';
  github?: string;
  live?: string;
  image?: string;
}

export interface Skill {
  name: string;
  level: number;
  category: 'frontend' | 'backend' | 'tools' | 'design';
}

export interface ActivityItem {
  id: string;
  type: 'project' | 'update' | 'cert' | 'feature';
  title: string;
  description: string;
  timestamp: Date;
  url?: string;
}

export interface StatsData {
  totalProjects: number;
  totalCommits: number;
  totalCerts: number;
  yearsExperience: number;
}

export interface Certificate {
  id: string;
  image?: string;
  description: string;
  issuer: string;
  imageUrl: string;
  link: string;
  date: string;
  category: string;
  categorySlug: string;
  type: 'image' | 'pdf';
}

export interface CertificateConfig {
  certificates: Array<{
    image: string;
    link: string;
    description: string;
    issuer: string;
    date: string;
  }>;
}

export interface CategoryData {
  slug: string;
  name: string;
  certificates: Certificate[];
}
