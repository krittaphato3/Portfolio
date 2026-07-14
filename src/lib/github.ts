const GITHUB_USERNAME = 'krittaphato3';
const GITHUB_API = 'https://api.github.com';

// GitHub REST API types
export interface GitHubUser {
  login: string;
  name: string;
  bio: string;
  location: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  avatar_url: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
}

export interface PinnedRepo {
  name: string;
  description: string | null;
  url: string;
  homepageUrl: string | null;
  stargazerCount: number;
  forkCount: number;
  isArchived: boolean;
  isFork: boolean;
  pushedAt?: string;
  primaryLanguage: {
    name: string;
    color: string;
  } | null;
  languages: {
    edges: Array<{
      node: {
        name: string;
        color: string;
      };
    }>;
  };
  repositoryTopics: {
    nodes: Array<{
      topic: {
        name: string;
      };
    }>;
  };
}

// Fetch GitHub user profile (unauthenticated, 60 req/hour limit)
export async function fetchGitHubUser(): Promise<GitHubUser> {
  const res = await fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}`);
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
}

// Fetch total repo count (unauthenticated)
export async function fetchRepoCount(): Promise<number> {
  const user = await fetchGitHubUser();
  return user.public_repos;
}

// Fetch pinned repos via GraphQL (requires VITE_GITHUB_TOKEN)
export async function fetchPinnedRepos(): Promise<PinnedRepo[]> {
  const token = import.meta.env.VITE_GITHUB_TOKEN;

  // If no token, fall back to fetching recent repos via REST
  if (!token) {
    console.warn('VITE_GITHUB_TOKEN not set — using recent repos instead of pinned');
    return fetchRecentReposAsPinned();
  }

  const query = `
    query($username: String!) {
      user(login: $username) {
        pinnedItems(first: 6, types: REPOSITORY) {
          nodes {
            ... on Repository {
              name
              description
              url
              homepageUrl
              stargazerCount
              forkCount
              isArchived
              isFork
              pushedAt
              primaryLanguage {
                name
                color
              }
              languages(first: 100) {
                edges {
                  node {
                    name
                    color
                  }
                }
              }
              repositoryTopics(first: 20) {
                nodes {
                  topic {
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables: { username: GITHUB_USERNAME } }),
  });

  if (!res.ok) {
    console.error(`GraphQL error: ${res.status}`);
    return fetchRecentReposAsPinned();
  }

  const data = await res.json();
  const nodes = data?.data?.user?.pinnedItems?.nodes;

  if (!nodes || nodes.length === 0) {
    return fetchRecentReposAsPinned();
  }

  return nodes.filter((n: PinnedRepo) => !n.isFork && !n.isArchived);
}

// Fallback: use most recently pushed repos as "pinned"
async function fetchRecentReposAsPinned(): Promise<PinnedRepo[]> {
  const res = await fetch(
    `${GITHUB_API}/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=6&type=owner`
  );
  if (!res.ok) return [];

  const repos: GitHubRepo[] = await res.json();

  return repos
    .filter((r) => !r.fork)
    .map((r) => ({
      name: r.name,
      description: r.description,
      url: r.html_url,
      homepageUrl: r.homepage,
      stargazerCount: r.stargazers_count,
      forkCount: r.forks_count,
      isArchived: false,
      isFork: false,
      pushedAt: r.pushed_at,
      primaryLanguage: r.language
        ? { name: r.language, color: getLanguageColor(r.language) }
        : null,
      languages: {
        edges: r.language
          ? [{ node: { name: r.language, color: getLanguageColor(r.language) } }]
          : [],
      },
      repositoryTopics: {
        nodes: (r.topics || []).map((t) => ({ topic: { name: t } })),
      },
    }));
}

// Basic language color map (subset)
function getLanguageColor(lang: string): string {
  const colors: Record<string, string> = {
    TypeScript: '#3178c6',
    JavaScript: '#f1e05a',
    Python: '#3572A5',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Java: '#b07219',
    Go: '#00ADD8',
    Rust: '#dea584',
    'C++': '#f34b7d',
    C: '#555555',
    Ruby: '#701516',
    PHP: '#4F5D95',
    Swift: '#F05138',
    Kotlin: '#A97BFF',
    Dart: '#00B4AB',
    Vue: '#41b883',
    Shell: '#89e051',
  };
  return colors[lang] || '#8b8b8b';
}

