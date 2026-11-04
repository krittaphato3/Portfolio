export const PROJECT_READMES: Record<string, string> = {
  multicode: `# MultiCode — Autonomous Agentic Coding CLI

**Agentic coding CLI** — reads, searches, edits, and runs commands in your workspace until the task is done. Works with **any OpenAI-compatible endpoint**, including fully **free, keyless providers**.

\`\`\`bash
# Zero-config onboarding with free provider (no API key required)
npx tsx src/index.ts --provider pollinations "explain this repo"

# Autonomous bug fixing with your own API key
export OPENAI_API_KEY=sk-...
npx tsx src/index.ts --provider openai "fix the failing tests in src/auth"
\`\`\`

---

## Technical Overview & How It Works

\`\`\`
multicode "fix race condition in atomic write-ahead log"
  > glob        find test files (*.rs, *.toml)
  > read_file   read segment buffer at src/wal/segment.rs:45-120
  > edit_file   apply mutex guard lock prior to buffer flush
  > bash        run regression test suite: cargo test

Task completed autonomously - 3 turns - 4 tool calls - 12.4k tokens
\`\`\`

### Key Architectural Pillars
1. **Real Autonomous Agent Loop**: The model invokes native tools (\`read\`, \`write\`, \`edit\`, \`grep\`, \`glob\`, \`bash\`) iteratively until convergence criteria are met. No brittle regex file writes.
2. **Multi-Agent Orchestration**: The primary model delegates isolated context windows to specialized subagents to prevent token explosion on multi-file refactoring tasks.
3. **Agent Skills (Open Spec)**: Drop a \`SKILL.md\` folder in \`skills/\` and the agent picks it up dynamically with progressive disclosure, loading instructions only when relevant.

---

## Installation & CLI Usage

\`\`\`bash
# Clone the repository
git clone https://github.com/krittaphato3/MultiCode.git
cd MultiCode

# Install dependencies
npm install

# Run the agent CLI
npx tsx src/index.ts "review security vulnerabilities in package.json"
\`\`\`

---

## Supported LLM Providers
- OpenAI (\`gpt-4o\`, \`o3-mini\`, \`gpt-4.5\`)
- Anthropic Claude (\`claude-3-7-sonnet\`, \`claude-3-5-sonnet\`)
- DeepSeek (\`deepseek-chat\`, \`deepseek-reasoner\`)
- Local & Keyless (\`ollama\`, \`pollinations\`, \`groq\`)
`,

  fullpip: `# FullPiP — Next-Generation Chrome Picture-in-Picture Suite

FullPiP is an advanced Chrome extension engineered with **Manifest V3** and the **Chrome Document Picture-in-Picture API**. It goes beyond standard video tags by enabling users to detach live DOM elements, interactive canvas streams, and multi-stream media into borderless, floating desktop popup windows.

---

## Architecture & Operational Modes

FullPiP offers three intelligent operational modes that automatically adapt to content and browser capabilities:

### 1. Native Document PiP Mode
Utilizes Chrome's \`window.documentPictureInPicture.requestWindow()\` API to construct a real top-level browser context inside a native floating window.
- Supports arbitrary HTML/CSS nodes, interactive buttons, and sliders.
- Real-time DOM mirroring with sub-millisecond mutation updates.

### 2. Multi-Window Popup Mode
Creates dedicated frameless popup windows for unlimited side-by-side desktop multitasking.
- Arrange multiple video streams side-by-side on your desktop.
- No browser address bar, tabs, or navigation chrome clutter.

### 3. Hybrid Routing Engine
Intelligently inspects the target media source (DRM protected, WebRTC canvas, HTML5 video) and routes to the optimal detachment pipeline.

---

## Feature Matrix
- **Multi-Window Tiling**: Open up to 5 concurrent floating PiP windows (or unlimited in developer configuration).
- **Cross-Tab Synchronization**: Real-time state broadcasting using \`BroadcastChannel\` and \`chrome.runtime.sendMessage\`.
- **Canvas & WebGL Stream Mirroring**: Capture and stream active game canvases and visualizers into floating windows.
- **Privacy & Security**: Zero external tracking, zero analytics payloads, fully compliant with Chrome Web Store MV3 standards.

---

## Build & Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/krittaphato3/PiPExtension.git
cd PiPExtension

# Load extension in Chrome:
1. Open Chrome and navigate to chrome://extensions/
2. Toggle "Developer mode" in the top right.
3. Click "Load unpacked" and select the extension directory.
\`\`\`
`,

  'infinite-realms': `# Infinite Realms (infworld) — Prompt-to-Playable Game Engine

**Infinite Realms** is an AI-driven game synthesis platform where an autonomous swarm of LLM agents converts a single natural-language text prompt into a playable 2D browser game.

---

## Swarm Architecture & Multi-Agent Pipeline

The generation pipeline divides responsibilities across specialized agent roles:
1. **Game Design Architect**: Synthesizes the core loop, win/loss conditions, scoring mechanics, and physics constraints into a formal Game Design Document (GDD).
2. **Asset Generation Agent**: Produces pixel-art sprites, background tilemaps, and color palettes.
3. **Phaser.js Coder Agent**: Synthesizes valid, bug-free Phaser 3 scenes with input listeners, arcade physics, collision groups, and sound effects.
4. **Autonomous QA Agent**: Evaluates syntax correctness, inspects collision bounds, and validates that the game loop executes without runtime exceptions.

---

## Running the Sandbox Locally

\`\`\`bash
# Clone the repository
git clone https://github.com/krittaphato3/infworld.git
cd infworld

# Install Python requirements
pip install -r requirements.txt

# Start the synthesis server
python main.py
\`\`\`

---

## Interactive Browser Canvas
Generated games are rendered into a high-performance HTML5 Canvas powered by Phaser.js with arcade physics, keyboard controls, and real-time score tracking.
`,

  'stealth-admin-panel': `# StealthAdminPanel — Packet-Level Invisible Minecraft Admin Engine

A high-performance, fully invisible administration system for Minecraft servers (Paper/Spigot 1.18–1.21) engineered with **35+ custom inventory GUI menus**, a real-time **NBT editor**, player punishment workflows, and **zero external dependencies**.

---

## Core Design Principles

### 1. Absolute Packet-Level Stealth
Administrative interactions, inventory inspections, and moderation events are intercepted before packet dispatch. Unprivileged players cannot detect vanished staff members through tab completion, entity tracking packets, or server ping queries.

### 2. High-Performance Event Architecture
- Zero reflection in hot game loops.
- Asynchronous database updates with atomic transaction rollback.
- Negligible garbage collection footprint on 100+ player servers.

---

## Features & Capabilities
- **35+ Administrative Menus**: Game mode selectors, time/weather engines, potion generators, teleporters, and world modifiers.
- **In-Game NBT Modifier**: Edit raw item tag compounds, custom model data, and attributes directly via chest GUI.
- **Sub-Command Shortcuts**: Quick aliases for server diagnostics and player tracking.
- **Granular Permissions**: 50+ permission nodes compatible with LuckPerms and Vault.

---

## Building from Source

\`\`\`bash
# Clone the repository
git clone https://github.com/krittaphato3/StealthAdminPanel.git
cd StealthAdminPanel

# Compile with Maven (Java 17+)
mvn clean package

# Output jar: target/StealthAdminPanel-1.1.0.jar
\`\`\`
`,

  'mindful-compass': `# Mindful Compass — Workplace Burnout Prediction & Mental Health Platform

**CPE 232 Data Models Capstone Project | KMUTT Computer Engineering**

**Mindful Compass** is an end-to-end data science platform engineered to predict workplace burnout risk and provide clinical mental health telemetry for tech professionals.

---

## Machine Learning & Clinical Indicators
- Supervised classification models trained on the *Mental Health and Burnout in Tech Workers 2026* dataset.
- Integrates standardized clinical diagnostic metrics:
  - **PHQ-9** (Patient Health Questionnaire for Depression Severity)
  - **GAD-7** (Generalized Anxiety Disorder Screener)
- Evaluates 40+ workplace telemetry vectors: overtime hours, remote isolation, on-call rotation stress, and organizational psychological safety.

---

## System Architecture
- **Frontend**: React 18, Tailwind CSS, Framer Motion, and Lenis smooth scrolling for a calm, distraction-free user experience.
- **Backend API**: High-throughput FastAPI microservice serving real-time model inference in under 30ms.
- **Data Pipeline**: Scikit-Learn pipelines with feature encoding, cross-validation, and risk stratification (Low / Medium / High).

---

## Running Locally

\`\`\`bash
# Backend setup
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend setup
cd frontend
npm install
npm run dev
\`\`\`
`,

  mazerunner: `# MazeRunner — Evolutionary Genetic Algorithm & Pathfinding Sandbox

**MazeRunner** is a Java-based pathfinding simulation and benchmarking engine exploring algorithmic efficiency, with a specialized focus on **Genetic Algorithms (GA)** compared against classical graph traversal heuristics like **A\*** and **Dijkstra**.

---

## Algorithmic Benchmarks & Heuristics

| Metric | A* Search | Genetic Algorithm (GA) | Dijkstra |
|---|---|---|---|
| **Optimality** | Guaranteed Shortest Path | Heuristic Near-Optimal | Guaranteed Shortest Path |
| **Node Evaluations** | Low (Guided by Manhattan/Euclidean) | High (Population-wide search) | Complete Graph Expansion |
| **Adaptability** | Static Obstacles | Dynamic / Deformable Environments | Static Obstacles |
| **Memory Cost** | Priority Queue O(b^d) | Population Size O(N) | Priority Queue O(V + E) |

---

## Genetic Algorithm Formulation
- **Chromosome Representation**: Fixed-length directional gene sequences (North, South, East, West).
- **Fitness Function**: Evaluates Euclidean distance to goal, obstacle collision penalties, and path parsimony.
- **Reproduction**: Roulette wheel and tournament selection paired with uniform crossover and adaptive Gaussian mutation.

---

## Running the Java Simulation

\`\`\`bash
# Clone the repository
git clone https://github.com/krittaphato3/GeneticAlgorithmOnMaze.git
cd GeneticAlgorithmOnMaze

# Compile & execute
javac -d bin src/**/*.java
java -cp bin com.krittaphat.mazerunner.Main
\`\`\`
`,

  'byok-research-harness': `# BYOK Research Harness & Autonomous Agent Workbench

A private, local-first **Bring Your Own Key (BYOK)** autonomous research workbench, multi-agent adversarial court debate arena, and evidence citation engine.

Powered by **FastAPI**, **SQLite FTS5 (WAL mode)**, **AES-256-GCM Key Vault**, **React 19**, and **Tailwind CSS v4**.

---

## Key Highlights

- **Multi-Agent Adversarial Debate Arena**: Built-in court debate cross-examination protocol where a **Lead Architect (Proposer)** and an **Adversarial Challenger (Skeptic)** contest boundary conditions, failure modes, and claims before an **Impartial Adjudicator** issues a consensus ruling.
- **Zero-Telemetry & 100% Local-First**: All API keys, search logs, evidence chunks, and research histories live in a local SQLite database with \`PRAGMA journal_mode=WAL\`.
- **Encrypted BYOK Vault**: Store and manage credentials for local models (Ollama, LM Studio, vLLM, OmniRoute) and cloud endpoints (OpenAI, Gemini, Anthropic) encrypted using AES-256-GCM with PBKDF2 master key derivation.
- **Configurable Research Execution Modes**:
  - **Fast Direct**: Direct single-turn synthesis with system prompt guidance (< 2 seconds, bypassing web search).
  - **Court Debate**: Dedicated 4-turn adversarial cross-examination between Proposer, Skeptic, and Adjudicator.
  - **Deep Research**: Comprehensive multi-agent pipeline featuring hypothesis decomposition, parallel web discovery, FTS5 extraction, debate, and citation synthesis.
- **Local Document Ingestion & SQLite FTS5 BM25 Retrieval**: Upload reference documents (\`.txt\`, \`.md\`, \`.py\`, \`.json\`, \`.csv\`, \`.pdf\`); text is chunked and indexed into SQLite FTS5 virtual tables with synchronized triggers.
- **Subagents & Progressive Skills Engine**: Agents discover and load specialized domain skills on-demand, preventing context window fatigue.

---

## Architecture Overview

\`\`\`
User Query
  │
  ├── [Deep Research Pipeline]
  │     ├── 1. Hypothesis Decomposer & Sub-query Planner
  │     ├── 2. Parallel Web Fetch (DuckDuckGo Search + Jina AI Reader)
  │     ├── 3. Document Ingestion (SQLite FTS5 BM25 Ranking)
  │     │
  │     ▼
  ├── [Adversarial Court Arena]
  │     ├── Turn 1: Lead Proposer drafts affirmative hypothesis
  │     ├── Turn 2: Adversarial Skeptic challenges edge cases & counter-evidence
  │     ├── Turn 3: Proposer rebuts with citations
  │     └── Turn 4: Impartial Adjudicator delivers consensus ruling ledger
  │
  └── Final Synthesis Report with Grounded Inline Citations
\`\`\`

---

## Getting Started

\`\`\`bash
# Clone the repository
git clone https://github.com/krittaphato3/byok-research-harness.git
cd byok-research-harness

# Backend setup
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

# Frontend setup
cd ../frontend
npm install
npm run dev
\`\`\`
`,

  'multi-window-video': `# Multi-Window-Video — Borderless Floating Video Workspace

Extract any web video stream into its own borderless, floating desktop popup window without browser tabs, address bars, or toolbars.

---

## Features
- **Zero Chrome Overhead**: Pure video surface with custom synchronized playback controls.
- **Multi-Stream Monitoring**: Detach up to 10+ live video streams side-by-side across multi-monitor setups.
- **Universal Media Support**: Automatically detects HTML5 video nodes, Twitch streams, YouTube feeds, and custom canvas media.
`
};
