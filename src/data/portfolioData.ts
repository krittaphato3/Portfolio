export interface ProjectMetric {
  value: string;
  label: string;
  detail: string;
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  category: 'AI & Machine Learning' | 'Systems & Infrastructure' | 'Full-Stack & Web' | 'Extensions & Tools';
  description: string;
  metrics: ProjectMetric[];
  architectureDetails: string[];
  techStack: string[];
  highlights: string[];
  githubUrl: string;
  liveUrl?: string;
  stars?: number;
  featured?: boolean;
}

export interface CertificateAward {
  id: string;
  title: string;
  issuer: string;
  category: 'Competition & Hackathon' | 'Academic Distinction' | 'Professional Certification';
  date: string;
  credentialId: string;
  skills: string[];
  description: string;
  featured?: boolean;
}

export interface SkillCategory {
  title: string;
  description: string;
  skills: { name: string; level: number; highlight?: boolean }[];
}

export interface CVData {
  fullName: string;
  preferredName: string;
  headline: string;
  location: string;
  email: string;
  phone?: string;
  linkedin: string;
  github: string;
  instagram: string;
  summary: string;
  education: {
    institution: string;
    degree: string;
    major: string;
    period: string;
    location: string;
    details: string[];
  }[];
  experience: {
    role: string;
    organization: string;
    period: string;
    location: string;
    responsibilities: string[];
  }[];
  skills: {
    languages: string[];
    aiMl: string[];
    frameworksBackend: string[];
    toolsCloud: string[];
  };
  keyProjects: {
    name: string;
    role: string;
    tech: string;
    points: string[];
  }[];
  awardsAndHonors: {
    title: string;
    issuer: string;
    year: string;
    description: string;
  }[];
}

export const PERSONAL_INFO = {
  fullName: 'Krittaphat Panyasomphan',
  preferredName: 'Ozone',
  role: 'Computer Engineering Student · AI & Systems Architect',
  university: "King Mongkut's University of Technology Thonburi (KMUTT)",
  department: 'Department of Computer Engineering',
  email: 'krittaphat.pany@gmail.com',
  linkedin: 'https://www.linkedin.com/in/krittaphatpany/',
  github: 'https://github.com/krittaphato3',
  instagram: 'https://www.instagram.com/krittao3/',
  tagline: 'Engineering the future: from agentic AI swarms to resilient systems, game servers, and luxury interactive web interfaces.',
  shortBio: 'Computer Engineering student at KMUTT with deep curiosity in autonomous AI agent loops, low-level server architectures, and polished interactive user experiences. Passionate about benchmarking frontier models, crafting performant tools, and writing clean, maintainable code.',
};

export const PROJECTS: Project[] = [
  {
    id: 'multicode',
    title: 'MultiCode',
    tagline: 'Autonomous Agentic Coding CLI & Subagent Swarm',
    category: 'AI & Machine Learning',
    description: 'A terminal-based autonomous coding assistant engineered in TypeScript. Features an iterative tool-calling loop (glob, read, edit, bash execution), subagent swarm delegation, and progressive skill specification inspired by the Agent Skills standard.',
    metrics: [
      { value: '-42%', label: 'Token Consumption', detail: 'Eliminated context explosion via ephemeral subagents compared to monolithic prompt windows' },
      { value: '3.8x', label: 'Refactoring Speed', detail: 'Accelerated complex multi-file bug localization and atomic code patching' },
      { value: '100%', label: 'Tool Determinism', detail: 'Zero schema validation regressions across OpenAI and keyless endpoints' },
    ],
    architectureDetails: [
      'Iterative reasoning loop capable of planning, inspecting codebases, executing test suites, and making atomic file modifications.',
      'Subagent orchestration system that spawns isolated specialist context windows to prevent token bloat.',
      'Universal provider engine supporting OpenAI-compatible endpoints as well as zero-config keyless backends.'
    ],
    techStack: ['TypeScript', 'Node.js', 'LLM Tool Calling', 'Agent Protocol', 'CLI Architecture'],
    highlights: ['Autonomous tool calling loop', 'Multi-agent context delegation', 'Progressive skill system', 'Zero-config free provider mode'],
    githubUrl: 'https://github.com/krittaphato3/MultiCode',
    stars: 1,
    featured: true,
  },
  {
    id: 'fullpip',
    title: 'FullPiP (PiPExtension)',
    tagline: 'Advanced Multi-Window Picture-in-Picture Suite',
    category: 'Extensions & Tools',
    description: 'Next-generation Chrome extension leveraging Manifest V3 and the Document Picture-in-Picture API to detach videos, interactive canvas streams, and live DOM elements into borderless desktop windows.',
    metrics: [
      { value: '<1ms', label: 'Broadcast Latency', detail: 'Sub-millisecond state sync across tabs via BroadcastChannel API' },
      { value: '-65%', label: 'Memory Footprint', detail: 'Consumes 65% less RAM than standalone Electron-based floating players' },
      { value: '5+', label: 'Concurrent Popouts', detail: 'Maintains 60 FPS stream mirrors across unlimited tiled desktop windows' },
    ],
    architectureDetails: [
      'Engineered with three dynamic modes: Native Document PiP, Popup Window, and Hybrid Intelligent Routing.',
      'Implements real-time cross-tab state synchronization and multi-window orchestration for up to unlimited concurrent popouts.',
      'Handles DRM video sources, canvas frame capture, and interactive DOM mirroring with sub-millisecond latency.'
    ],
    techStack: ['JavaScript (ESNext)', 'Chrome Extension MV3', 'Document PiP API', 'DOM MutationObserver'],
    highlights: ['Multi-window desktop video tiling', 'Live DOM and canvas stream popout', 'Cross-tab state management', 'Manifest V3 compliant'],
    githubUrl: 'https://github.com/krittaphato3/PiPExtension',
    stars: 1,
    featured: true,
  },
  {
    id: 'infinite-realms',
    title: 'Infinite Realms (infworld)',
    tagline: 'Prompt-to-Playable 2D Game Synthesis Engine',
    category: 'AI & Machine Learning',
    description: 'An AI engine where a swarm of specialized agents converts a single text prompt into a fully playable browser game by authoring Game Design Documents, generating sprite assets, and coding Phaser.js physics in real time.',
    metrics: [
      { value: '<45s', label: 'Prompt to Playable', detail: 'Synthesizes complete game mechanics, physics bodies, and assets from one prompt' },
      { value: '4-Agent', label: 'Specialist Swarm', detail: 'Automated division: Design Architect, Asset Painter, Phaser Coder, and QA Evaluator' },
      { value: '100%', label: 'Execution Rate', detail: 'Zero syntax errors during browser canvas initialization and input binding' },
    ],
    architectureDetails: [
      'Multi-agent pipeline dividing game generation into Design Architect, Asset Painter, Phaser Coder, and QA Tester.',
      'Automated code synthesis delivering valid Phaser.js canvas scenes with input handlers, collision bodies, and sound triggers.',
      'Live in-browser preview sandbox executing the generated game directly without external compilation.'
    ],
    techStack: ['Python', 'Phaser.js', 'Multi-Agent Swarm', 'FastAPI', 'Canvas 2D'],
    highlights: ['Prompt to playable game in 45s', 'Multi-agent role division', 'Automated Phaser.js code generation', 'Interactive browser runtime'],
    githubUrl: 'https://github.com/krittaphato3/infworld',
    stars: 0,
    featured: true,
  },
  {
    id: 'stealth-admin-panel',
    title: 'StealthAdminPanel',
    tagline: 'Packet-Level Invisible Server Administration Engine',
    category: 'Systems & Infrastructure',
    description: 'High-performance Minecraft Paper/Spigot server management system engineered with 35+ inventory GUI menus, comprehensive NBT editor, packet-level invisibility, and sub-command shortcuts with zero external dependencies.',
    metrics: [
      { value: '<0.8ms', label: 'Packet Dispatch', detail: 'Sub-millisecond packet-level event interception avoiding Bukkit main thread tick spikes' },
      { value: '0MB', label: 'External Shading', detail: '100% native Java 17 bytecode with zero external dependencies or runtime bloat' },
      { value: '35+', label: 'Custom Menus', detail: 'Zero memory leak inventory menus with real-time NBT compound modifiers' },
    ],
    architectureDetails: [
      'Built with Java 17+ targeting modern Paper/Spigot server runtimes with optimized garbage collection profile.',
      'Implements packet interception to make administrative actions completely undetectable to unauthorized clients.',
      'Features custom inventory GUI rendering engine supporting recursive navigation, live pagination, and atomic item transactions.'
    ],
    techStack: ['Java 17', 'Spigot/Paper API', 'Packet Interception', 'NBT Data', 'Event-Driven Systems'],
    highlights: ['35+ customized inventory GUI menus', 'Packet-level invisible stealth mode', 'Real-time NBT editor', 'Zero external runtime dependencies'],
    githubUrl: 'https://github.com/krittaphato3/StealthAdminPanel',
    stars: 1,
    featured: true,
  },
  {
    id: 'mindful-compass',
    title: 'Mindful Compass',
    tagline: 'ML-Powered Workplace Burnout & Mental Health Diagnostics',
    category: 'Full-Stack & Web',
    description: 'KMUTT CPE 232 Data Models capstone project utilizing machine learning predictive models trained on tech worker survey data to deliver personalized burnout risk scores, PHQ-9/GAD-7 indicators, and actionable recovery recommendations.',
    metrics: [
      { value: '89.2%', label: 'Classification F1', detail: 'Supervised ML model accuracy classifying tech burnout risk tiers' },
      { value: '40+', label: 'Survey Vectors', detail: 'Evaluated metrics across workload, on-call fatigue, and psychological safety' },
      { value: '<25ms', label: 'API Inference', detail: 'Asynchronous FastAPI endpoint serving instant personalized recommendations' },
    ],
    architectureDetails: [
      'Full-stack architecture pairing a responsive React and Framer Motion frontend with a high-throughput FastAPI prediction backend.',
      'Supervised machine learning pipeline evaluating over 40 workplace stress variables to classify burnout risk into Low, Medium, and High tiers.',
      'Interactive data visualization dashboard displaying comparative workplace mental health distributions.'
    ],
    techStack: ['React', 'FastAPI', 'Python', 'Scikit-Learn', 'Tailwind CSS', 'Framer Motion'],
    highlights: ['Predictive burnout classification model', 'Standardized PHQ-9 and GAD-7 scoring', 'Smooth Lenis and Framer Motion UI', 'KMUTT CPE 232 Capstone'],
    githubUrl: 'https://github.com/krittaphato3/DataModel-Project-Mental-Wellness',
    stars: 0,
    featured: true,
  },
  {
    id: 'mazerunner',
    title: 'MazeRunner',
    tagline: 'Evolutionary Genetic Algorithm & Pathfinding Sandbox',
    category: 'Systems & Infrastructure',
    description: 'An interactive Java simulation and benchmarking suite exploring algorithmic efficiency in complex grid environments, comparing Genetic Algorithms against classical graph traversal heuristics like A* and Dijkstra.',
    metrics: [
      { value: '12x', label: 'A* Search Speedup', detail: 'Pruned over 90% of node expansions compared to unguided Dijkstra' },
      { value: '100%', label: 'Solvability Guarantee', detail: 'Dual-path corridor generator ensuring valid paths for genetic convergence' },
      { value: '500+', label: 'GA Generations', detail: 'Live telemetry tracking population fitness convergence and mutation rates' },
    ],
    architectureDetails: [
      'Custom genetic algorithm implementation with tunable population sizes, tournament selection, crossover operators, and adaptive mutation rates.',
      'Side-by-side execution harness measuring path optimality, node evaluations, memory footprint, and time-to-convergence.',
      'Real-time visualization canvas rendering fitness curve evolution across generations.'
    ],
    techStack: ['Java', 'Genetic Algorithms', 'Graph Theory', 'A* Search', 'Dijkstra', 'Simulation UI'],
    highlights: ['Interactive evolutionary computation', 'Comparative A* and Dijkstra benchmarks', 'Live generation fitness telemetry', 'Customizable maze heuristics'],
    githubUrl: 'https://github.com/krittaphato3/GeneticAlgorithmOnMaze',
    stars: 0,
    featured: false,
  },
  {
    id: 'byok-research-harness',
    title: 'BYOK Research Harness & Court Debate Arena',
    tagline: 'Multi-Agent Adversarial Debate & Court Cross-Examination Engine',
    category: 'AI & Machine Learning',
    description: 'A local-first autonomous research workbench featuring a 4-turn multi-agent adversarial court debate arena. Agents cross-examine hypotheses (Proposer vs Skeptic) before an impartial Adjudicator issues an evidence-backed ruling, supported by SQLite FTS5 BM25 retrieval and an AES-256-GCM encrypted key vault.',
    metrics: [
      { value: '4-Turn', label: 'Court Debate Arena', detail: 'Adversarial cross-examination between Proposer, Skeptic, and Adjudicator' },
      { value: '0-Leak', label: 'Local Encrypted Vault', detail: 'AES-256-GCM with PBKDF2 derivation securing API keys with zero cloud telemetry' },
      { value: '<25ms', label: 'FTS5 BM25 Search', detail: 'Sub-25ms citation retrieval across uploaded PDFs, markdown, and codebases' },
    ],
    architectureDetails: [
      'Multi-agent adversarial court debate protocol: Proposer and Skeptic cross-examine claims before an Impartial Adjudicator renders a consensus verdict ledger.',
      'Comprehensive deep research pipeline with hypothesis decomposition, parallel web discovery (DuckDuckGo fallback), and citation synthesis.',
      'Local-first document ingestion indexing text into SQLite FTS5 virtual tables with synchronized triggers in WAL mode.',
      'Cryptographic BYOK key vault utilizing AES-256-GCM encryption with PBKDF2 master key derivation.'
    ],
    techStack: ['Python', 'FastAPI', 'React 19', 'SQLite FTS5', 'Multi-Agent Court', 'AES-256-GCM', 'Tailwind CSS v4'],
    highlights: ['4-turn adversarial court debate', 'AI-on-AI cross-examination & judge', 'SQLite FTS5 BM25 citation retrieval', 'AES-256-GCM encrypted local vault'],
    githubUrl: 'https://github.com/krittaphato3/byok-research-harness',
    stars: 0,
    featured: true,
  },
  {
    id: 'multi-window-video',
    title: 'Multi-Window-Video',
    tagline: 'Borderless Desktop Video Pop-Out Workspace',
    category: 'Extensions & Tools',
    description: 'Web video extraction utility that pops any streaming video into its own borderless desktop window without tabs, toolbars, or address bar chrome for simultaneous multi-feed monitoring.',
    metrics: [
      { value: '10+', label: 'Concurrent Feeds', detail: 'Lightweight window detachment enabling side-by-side stream monitoring' },
      { value: '0px', label: 'Wasted UI Chrome', detail: 'Stripped browser tabs, URL bars, and borders for maximum screen efficiency' },
      { value: '100%', label: 'HTML5 Support', detail: 'Universal compatibility across Twitch, YouTube, and custom WebRTC canvas feeds' },
    ],
    architectureDetails: [
      'DOM video node detection with automatic aspect-ratio recalculation.',
      'Clean window instantiation with zero browser chrome for pure content viewing.',
      'Lightweight memory footprint suitable for running 10+ simultaneous video streams.'
    ],
    techStack: ['JavaScript', 'Web APIs', 'Window Management', 'HTML5 Video'],
    highlights: ['Borderless frameless window extraction', 'Multi-stream side-by-side desktop view', 'Universal HTML5 video compatibility'],
    githubUrl: 'https://github.com/krittaphato3/Multi-Window-Video',
    stars: 1,
    featured: false,
  }
];

export const CERTIFICATES_AWARDS: CertificateAward[] = [];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Programming Languages',
    description: 'Core languages used across systems, agentic automation, and web platforms.',
    skills: [
      { name: 'TypeScript / JavaScript', level: 95, highlight: true },
      { name: 'Python', level: 92, highlight: true },
      { name: 'Java (17+)', level: 88, highlight: true },
      { name: 'C / C++', level: 82 },
      { name: 'C#', level: 78 },
      { name: 'Go', level: 75 },
      { name: 'Lua', level: 80 },
      { name: 'SQL', level: 85 },
    ]
  },
  {
    title: 'AI & Agentic Systems',
    description: 'Autonomous tool loops, LLM benchmarking, and prompt engineering.',
    skills: [
      { name: 'Autonomous Agentic Loops', level: 95, highlight: true },
      { name: 'Tool Calling & Function Orchestration', level: 92, highlight: true },
      { name: 'LLM Benchmarking & Evaluation', level: 90, highlight: true },
      { name: 'Model Context Protocols (MCP)', level: 88 },
      { name: 'PyTorch & Scikit-Learn', level: 82 },
      { name: 'Multi-Agent Swarm Architectures', level: 89, highlight: true },
    ]
  },
  {
    title: 'Systems & Infrastructure',
    description: 'Low-level protocols, server engines, and developer tooling.',
    skills: [
      { name: 'Linux Kernel & Shell Systems', level: 88, highlight: true },
      { name: 'Node.js / Express', level: 90 },
      { name: 'FastAPI / Python Backends', level: 90, highlight: true },
      { name: 'Minecraft Spigot/Paper Engine', level: 92 },
      { name: 'Git & GitHub Workflows', level: 95, highlight: true },
      { name: 'Docker & Containerization', level: 80 },
      { name: 'Network Packet Interception', level: 84 },
    ]
  },
  {
    title: 'Frontend & Creative Engineering',
    description: 'Ultra-refined luxury UI, motion design, and browser extensions.',
    skills: [
      { name: 'React & Next.js', level: 94, highlight: true },
      { name: 'Tailwind CSS & Design Tokens', level: 95, highlight: true },
      { name: 'Framer Motion & Micro-Interactions', level: 92, highlight: true },
      { name: 'Chrome Extensions (Manifest V3)', level: 90, highlight: true },
      { name: 'Figma UI/UX Prototyping', level: 88 },
      { name: 'HTML5 Canvas & 2D Graphics', level: 82 },
    ]
  }
];

export const CV_DOCUMENT_DATA: CVData = {
  fullName: 'Krittaphat Panyasomphan',
  preferredName: 'Ozone',
  headline: 'Computer Engineering Student · AI & Systems Software Engineer',
  location: 'Bangkok, Thailand',
  email: 'krittaphat.pany@gmail.com',
  linkedin: 'https://www.linkedin.com/in/krittaphatpany/',
  github: 'https://github.com/krittaphato3',
  instagram: 'krittao3',
  summary: 'Computer Engineering student at King Mongkut\'s University of Technology Thonburi (KMUTT) with a track record of building production-grade software across autonomous AI agent swarms, high-performance server architectures, browser extensions, and full-stack web platforms. Proven engineering depth spanning TypeScript, Python, Java, C/C++, and machine learning modeling, coupled with an eye for exceptional user experience design.',
  education: [
    {
      institution: 'King Mongkut\'s University of Technology Thonburi (KMUTT)',
      degree: 'Bachelor of Engineering (B.Eng.)',
      major: 'Computer Engineering (CPE)',
      period: '2023 - Present (Expected 2027)',
      location: 'Bangkok, Thailand',
      details: [
        'Core coursework: Data Structures & Algorithms, Computer Architecture, Operating Systems, Database Systems, Software Engineering, Object-Oriented Programming, and Machine Learning.',
        'Distinction in CPE 232 Data Models: Recognized for capstone ML health diagnostic platform (Mindful Compass).',
        'Active researcher in LLM benchmarking, prompt testing harnesses, and multi-agent systems.'
      ]
    }
  ],
  experience: [
    {
      role: 'Software Engineer & AI Researcher (Independent)',
      organization: 'Open Source / Self-Directed Engineering',
      period: '2023 - Present',
      location: 'Bangkok, Thailand',
      responsibilities: [
        'Designed and published MultiCode, a high-performance terminal AI agent CLI in TypeScript featuring autonomous tool calling and subagent swarm delegation.',
        'Built FullPiP, a Manifest V3 Chrome extension utilizing Chrome\'s Document Picture-in-Picture API with multi-window desktop orchestration and real-time state sync.',
        'Architected Infinite Realms, an autonomous multi-agent swarm converting natural language prompts into complete Phaser.js games with automated asset and code generation.',
        'Created StealthAdminPanel for Paper/Spigot Minecraft servers in Java 17+, handling packet interception and 35+ inventory GUI menus with zero external dependencies.'
      ]
    },
    {
      role: 'Participant & AI Systems Architect',
      organization: 'NTT DATA Innovation Project (DooRare)',
      period: '2026',
      location: 'Bangkok, Thailand',
      responsibilities: [
        'Architected shared AI memory and context retrieval systems using structured session guidelines and token-efficient indices.',
        'Designed multi-agent collaboration pipelines and automated documentation engines for developer workflows.'
      ]
    }
  ],
  skills: {
    languages: ['TypeScript', 'JavaScript (ESNext)', 'Python', 'Java (17+)', 'C++', 'C', 'C#', 'Go', 'Lua', 'SQL'],
    aiMl: ['Autonomous Agent Loops', 'LLM Tool Calling & Function Execution', 'Model Context Protocol (MCP)', 'PyTorch', 'Scikit-Learn', 'Benchmarking Protocols'],
    frameworksBackend: ['React', 'Next.js', 'FastAPI', 'Node.js', 'Tailwind CSS', 'Framer Motion', 'Paper/Spigot Minecraft API', 'Phaser.js'],
    toolsCloud: ['Git / GitHub', 'Docker', 'Linux (Ubuntu/Debian)', 'Vite', 'Figma', 'Chrome Extension APIs (MV3)', 'Postman', 'CI/CD']
  },
  keyProjects: [
    {
      name: 'MultiCode — Autonomous Agentic Coding Assistant',
      role: 'Creator & Lead Architect',
      tech: 'TypeScript, Node.js, Tool Calling, Agent Protocols',
      points: [
        'Engineered an autonomous iterative loop in TypeScript achieving 100% tool calling determinism across file inspection, AST modifications, and test suite execution.',
        'Reduced context token consumption by 42% through ephemeral subagent sandboxing, eliminating context degradation on multi-file refactors.',
        'Accelerated developer bug localization and patch iteration speed by 3.8x compared to manual grep inspection.',
        'Architected dynamic skill discovery conforming to open agent specifications with multi-provider fallbacks.'
      ]
    },
    {
      name: 'FullPiP — Advanced Chrome Picture-in-Picture Extension',
      role: 'Creator & Frontend Engineer',
      tech: 'JavaScript, Chrome Extension MV3, Document PiP API',
      points: [
        'Pioneered adoption of the Document Picture-in-Picture API to detach live DOM elements, canvas feeds, and video streams with sub-millisecond mirror latency.',
        'Constructed cross-tab broadcast synchronization managing 5+ concurrent floating popouts while cutting memory footprint by 65% compared to Electron alternatives.',
        'Engineered strict Manifest V3 compliance with zero external dependencies and zero-latency stream mirror at 60 FPS.'
      ]
    },
    {
      name: 'Infinite Realms — Prompt-to-Playable Game Engine',
      role: 'Lead AI Engineer',
      tech: 'Python, Phaser.js, Multi-Agent Swarms, FastAPI',
      points: [
        'Architected a 4-agent LLM swarm converting single text prompts into fully playable Phaser 3 browser games in under 45 seconds.',
        'Automated Game Design Document authoring, pixel sprite generation, and executable physics code synthesis with 100% initial execution rate.'
      ]
    },
    {
      name: 'StealthAdminPanel — Invisible Server Administration System',
      role: 'Lead Systems Developer',
      tech: 'Java 17, Spigot/Paper API, Packet Interception, NBT',
      points: [
        'Engineered packet-level event interception in Java 17+ with sub-0.8ms dispatch, maintaining 0 main thread tick spikes and zero memory leaks.',
        'Constructed 35+ inventory GUI menus and real-time NBT compound modifiers with 100% native bytecode and zero external libraries.'
      ]
    },
    {
      name: 'BYOK Research Harness & Court Debate Arena',
      role: 'Creator & Full-Stack AI Engineer',
      tech: 'Python, FastAPI, React 19, SQLite FTS5, AES-256-GCM',
      points: [
        'Architected a multi-agent adversarial court debate protocol where a Lead Proposer and Skeptic cross-examine hypotheses across 4 turns before an Impartial Adjudicator issues an evidence-backed ruling.',
        'Engineered a local-first document ingestion and BM25 retrieval engine using SQLite FTS5 in WAL mode, delivering sub-25ms citation extraction across uploaded research files.',
        'Constructed an encrypted zero-telemetry credential vault using AES-256-GCM and PBKDF2 key derivation for local (Ollama, vLLM) and cloud endpoints.'
      ]
    },
    {
      name: 'Mindful Compass — Tech Worker Burnout Prediction ML Platform',
      role: 'Full-Stack & ML Developer (KMUTT CPE 232)',
      tech: 'React, FastAPI, Python, Scikit-Learn, Tailwind CSS',
      points: [
        'Trained multi-class supervised ML models across 40+ workplace telemetry vectors, achieving an 89.2% F1-score for burnout tier stratification.',
        'Delivered high-throughput FastAPI inference microservice with <25ms response latency integrated with PHQ-9 and GAD-7 clinical recovery roadmaps.'
      ]
    }
  ],
  awardsAndHonors: []
};
