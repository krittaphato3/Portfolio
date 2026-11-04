import React from 'react';
import { createPortal } from 'react-dom';
import { CV_DOCUMENT_DATA } from '../data/portfolioData';

export const CVPrintDocument: React.FC = () => {
  const cv = CV_DOCUMENT_DATA;

  return createPortal(
    <div id="printable-cv" className="hidden print:block font-serif text-black bg-white w-full text-left leading-normal text-[10pt]">
      {/* =========================================================================
          PAGE 1 (Strictly Bounded to A4 Sheet 1: Header, Education, Skills, Top 3 Projects)
         ========================================================================= */}
      <div className="cv-page cv-page-1 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="text-center pb-2 mb-3 border-b border-black">
            <h1 className="text-2xl font-bold uppercase tracking-wider text-black mb-1 font-sans">
              {cv.fullName}
            </h1>
            <div className="text-[9pt] font-sans text-gray-800 flex items-center justify-center flex-wrap gap-x-2">
              <span>{cv.location}</span>
              <span>|</span>
              <a href={`mailto:${cv.email}`} className="text-black">{cv.email}</a>
              <span>|</span>
              <a href={cv.linkedin} className="text-black">linkedin.com/in/krittaphatpany</a>
              <span>|</span>
              <a href={cv.github} className="text-black">github.com/krittaphato3</a>
            </div>
          </div>

          {/* Education */}
          <div className="mb-3 break-inside-avoid">
            <h2 className="text-[10pt] font-sans font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
              Education
            </h2>
            {cv.education.map((edu, idx) => (
              <div key={idx} className="mb-1 text-[9.5pt]">
                <div className="flex justify-between items-baseline font-bold text-black font-sans">
                  <span>{edu.institution}</span>
                  <span className="font-normal text-[9pt]">{edu.period}</span>
                </div>
                <div className="italic text-gray-900">
                  {edu.degree} in {edu.major} — {edu.location}
                </div>
                <ul className="list-disc list-outside ml-4 mt-0.5 space-y-0.5 text-[9pt] text-gray-800 leading-snug">
                  {edu.details.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Technical Skills */}
          <div className="mb-3 break-inside-avoid">
            <h2 className="text-[10pt] font-sans font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
              Technical Skills
            </h2>
            <div className="text-[9.5pt] space-y-0.5 text-gray-900 leading-snug">
              <div>
                <span className="font-bold font-sans">Languages:</span> TypeScript, JavaScript (ESNext), Python, Java (17+), C++, C, C#, Go, Lua, SQL
              </div>
              <div>
                <span className="font-bold font-sans">Developer Tools &amp; Infrastructure:</span> Git, GitHub Actions, Docker, Linux (Ubuntu/Debian), Bash, Vite, Postman, CI/CD
              </div>
              <div>
                <span className="font-bold font-sans">Frameworks &amp; Runtimes:</span> React, Next.js, Node.js, FastAPI, Spigot/Paper Minecraft Engine, Phaser.js, Tailwind CSS
              </div>
              <div>
                <span className="font-bold font-sans">AI &amp; Systems Protocols:</span> Autonomous Agent Loops, Tool Calling &amp; Function Execution, Model Context Protocol (MCP), PyTorch, Scikit-Learn
              </div>
            </div>
          </div>

          {/* Key Projects Part 1: Flagship Autonomous & Systems */}
          <div className="break-inside-avoid">
            <h2 className="text-[10pt] font-sans font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
              Flagship Software &amp; Research Projects
            </h2>
            
            {/* MultiCode */}
            <div className="mb-2.5 text-[9.5pt] break-inside-avoid">
              <div className="flex justify-between items-baseline font-bold text-black font-sans">
                <span>MultiCode — Autonomous Agentic Coding CLI &amp; Subagent Swarm</span>
                <span className="font-normal text-[8.5pt] font-mono text-gray-600">TypeScript, Node.js, Tool Calling</span>
              </div>
              <div className="text-[8.5pt] font-sans text-gray-600 mb-0.5">GitHub: github.com/krittaphato3/MultiCode</div>
              <ul className="list-disc list-outside ml-4 space-y-0.5 text-[9pt] text-gray-800 leading-snug">
                <li>Engineered an autonomous iterative loop in TypeScript achieving 100% tool calling determinism across AST modifications, git operations, and test suites.</li>
                <li>Reduced context token overhead by 42% through ephemeral subagent sandboxing, eliminating context degradation on multi-file refactors.</li>
                <li>Accelerated developer bug localization and patch iteration speed by 3.8x compared to manual grep inspection.</li>
              </ul>
            </div>

            {/* FullPiP */}
            <div className="mb-2.5 text-[9.5pt] break-inside-avoid">
              <div className="flex justify-between items-baseline font-bold text-black font-sans">
                <span>FullPiP (PiPExtension) — Multi-Window Chrome Picture-in-Picture Suite</span>
                <span className="font-normal text-[8.5pt] font-mono text-gray-600">JavaScript, Chrome MV3, Document PiP</span>
              </div>
              <div className="text-[8.5pt] font-sans text-gray-600 mb-0.5">GitHub: github.com/krittaphato3/PiPExtension</div>
              <ul className="list-disc list-outside ml-4 space-y-0.5 text-[9pt] text-gray-800 leading-snug">
                <li>Pioneered adoption of the Document Picture-in-Picture API to extract live DOM nodes, canvas streams, and video elements with sub-millisecond mirror latency.</li>
                <li>Constructed cross-tab broadcast synchronization managing 5+ concurrent floating popouts while cutting memory footprint by 65% compared to Electron alternatives.</li>
                <li>Maintained steady 60 FPS stream mirrors with zero external tracking libraries, fully compliant with Manifest V3 security boundaries.</li>
              </ul>
            </div>

            {/* BYOK Research Harness */}
            <div className="mb-1 text-[9.5pt] break-inside-avoid">
              <div className="flex justify-between items-baseline font-bold text-black font-sans">
                <span>BYOK Research Harness — Multi-Agent Adversarial Court &amp; Citation Engine</span>
                <span className="font-normal text-[8.5pt] font-mono text-gray-600">Python, FastAPI, React 19, SQLite FTS5</span>
              </div>
              <div className="text-[8.5pt] font-sans text-gray-600 mb-0.5">GitHub: github.com/krittaphato3/byok-research-harness</div>
              <ul className="list-disc list-outside ml-4 space-y-0.5 text-[9pt] text-gray-800 leading-snug">
                <li>Architected a 4-turn multi-agent adversarial court debate arena where a Lead Proposer and Skeptic cross-examine claims before an Impartial Adjudicator renders a consensus verdict.</li>
                <li>Engineered a local-first SQLite FTS5 BM25 retrieval engine delivering sub-25ms citation search across uploaded documents in WAL mode.</li>
                <li>Built an encrypted zero-telemetry credential vault using AES-256-GCM and PBKDF2 derivation for local models (Ollama, vLLM) and cloud endpoints.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Page 1 Bottom Folio */}
        <div className="pt-2 border-t border-gray-300 text-[8.5pt] font-sans text-gray-500 flex justify-between items-center">
          <span>Krittaphat Panyasomphan — Computer Engineering</span>
          <span>Page 1 of 2</span>
        </div>
      </div>

      {/* =========================================================================
          PAGE 2 (Strictly Bounded to A4 Sheet 2: Applied Systems, Server Engines, ML Capstone)
         ========================================================================= */}
      <div className="cv-page cv-page-2 flex flex-col justify-between">
        <div>
          {/* Subtle Professional Running Header on Page 2 */}
          <div className="flex justify-between items-baseline pb-1.5 mb-3 border-b border-gray-300 text-[8.5pt] font-sans text-gray-600">
            <span className="font-semibold text-gray-900 tracking-wide">
              {cv.fullName}
            </span>
            <span className="font-mono text-[8.5pt] text-gray-500">
              {cv.email}
            </span>
          </div>

          {/* Section: Systems Engineering & Interactive Platforms */}
          <div className="mb-3">
            <h2 className="text-[10pt] font-sans font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-2">
              Systems Engineering &amp; Applied Software Projects
            </h2>

            {/* Infinite Realms */}
            <div className="mb-2.5 text-[9.5pt] break-inside-avoid">
              <div className="flex justify-between items-baseline font-bold text-black font-sans">
                <span>Infinite Realms (infworld) — Prompt-to-Playable 2D Game Synthesis Engine</span>
                <span className="font-normal text-[8.5pt] font-mono text-gray-600">Python, Phaser.js, Multi-Agent Swarm</span>
              </div>
              <div className="text-[8.5pt] font-sans text-gray-600 mb-0.5">GitHub: github.com/krittaphato3/infworld</div>
              <ul className="list-disc list-outside ml-4 space-y-0.5 text-[9pt] text-gray-800 leading-snug">
                <li>Architected a 4-agent LLM swarm converting single text prompts into fully playable Phaser 3 browser games in under 45 seconds.</li>
                <li>Automated Game Design Document authoring, pixel sprite generation, and executable physics code synthesis with 100% initial execution rate.</li>
              </ul>
            </div>

            {/* StealthAdminPanel */}
            <div className="mb-2.5 text-[9.5pt] break-inside-avoid">
              <div className="flex justify-between items-baseline font-bold text-black font-sans">
                <span>StealthAdminPanel — Invisible Server Administration System</span>
                <span className="font-normal text-[8.5pt] font-mono text-gray-600">Java 17, Spigot/Paper, Packet Interception</span>
              </div>
              <div className="text-[8.5pt] font-sans text-gray-600 mb-0.5">GitHub: github.com/krittaphato3/StealthAdminPanel</div>
              <ul className="list-disc list-outside ml-4 space-y-0.5 text-[9pt] text-gray-800 leading-snug">
                <li>Engineered packet-level event interception in Java 17+ with sub-0.8ms dispatch, maintaining 0 main thread tick spikes and zero memory leaks.</li>
                <li>Built 35+ inventory GUI menus and real-time NBT data modifiers with 100% native bytecode and zero external libraries.</li>
              </ul>
            </div>

            {/* Mindful Compass */}
            <div className="mb-2.5 text-[9.5pt] break-inside-avoid">
              <div className="flex justify-between items-baseline font-bold text-black font-sans">
                <span>Mindful Compass — Tech Worker Burnout Diagnostics (CPE 232 Capstone)</span>
                <span className="font-normal text-[8.5pt] font-mono text-gray-600">React, FastAPI, Python, Scikit-Learn</span>
              </div>
              <div className="text-[8.5pt] font-sans text-gray-600 mb-0.5">GitHub: github.com/krittaphato3/DataModel-Project-Mental-Wellness</div>
              <ul className="list-disc list-outside ml-4 space-y-0.5 text-[9pt] text-gray-800 leading-snug">
                <li>Trained predictive machine learning models across 40+ workplace stress variables, achieving an 89.2% F1-score for burnout tier stratification.</li>
                <li>Delivered high-throughput FastAPI inference microservice with &lt;25ms response latency integrated with PHQ-9 and GAD-7 clinical recovery roadmaps.</li>
              </ul>
            </div>

            {/* MazeRunner */}
            <div className="mb-2.5 text-[9.5pt] break-inside-avoid">
              <div className="flex justify-between items-baseline font-bold text-black font-sans">
                <span>MazeRunner — Evolutionary Genetic Algorithm &amp; Pathfinding Benchmark</span>
                <span className="font-normal text-[8.5pt] font-mono text-gray-600">Java, Genetic Algorithms, A* Search</span>
              </div>
              <div className="text-[8.5pt] font-sans text-gray-600 mb-0.5">GitHub: github.com/krittaphato3/GeneticAlgorithmOnMaze</div>
              <ul className="list-disc list-outside ml-4 space-y-0.5 text-[9pt] text-gray-800 leading-snug">
                <li>Constructed an algorithmic benchmark comparing Genetic Algorithms against A* and Dijkstra traversal across dynamic grid topologies.</li>
                <li>Demonstrated a 12x reduction in evaluated graph nodes using Manhattan heuristics and tracked 500+ generations of fitness convergence.</li>
              </ul>
            </div>

            {/* Multi-Window-Video */}
            <div className="mb-2 text-[9.5pt] break-inside-avoid">
              <div className="flex justify-between items-baseline font-bold text-black font-sans">
                <span>Multi-Window-Video — Borderless Video Desktop Workspace</span>
                <span className="font-normal text-[8.5pt] font-mono text-gray-600">JavaScript, Window Management API</span>
              </div>
              <div className="text-[8.5pt] font-sans text-gray-600 mb-0.5">GitHub: github.com/krittaphato3/Multi-Window-Video</div>
              <ul className="list-disc list-outside ml-4 space-y-0.5 text-[9pt] text-gray-800 leading-snug">
                <li>Engineered frameless video detachment utility removing 100% of browser chrome overhead for simultaneous multi-feed desktop monitoring.</li>
              </ul>
            </div>
          </div>

          {/* Academic Focus & Research Competencies */}
          <div className="break-inside-avoid">
            <h2 className="text-[10pt] font-sans font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
              Academic &amp; Research Focus
            </h2>
            <div className="text-[9pt] space-y-1 text-gray-800">
              <div className="flex justify-between items-baseline">
                <span><strong className="text-black font-sans">Department of Computer Engineering (CPE)</strong> — King Mongkut&apos;s University of Technology Thonburi</span>
                <span className="font-mono text-[8.5pt]">Bangkok, Thailand</span>
              </div>
              <p className="text-[9pt] text-gray-700 leading-relaxed">
                Focused on autonomous AI tool loops, LLM benchmarking, low-level server engines, and high-performance user interfaces. Actively building open-source developer tooling and scalable backend infrastructure.
              </p>
            </div>
          </div>
        </div>

        {/* Page 2 Bottom Folio */}
        <div className="pt-2 border-t border-gray-300 text-[8.5pt] font-sans text-gray-500 flex justify-between items-center">
          <span>Krittaphat Panyasomphan — Computer Engineering</span>
          <span>Page 2 of 2</span>
        </div>
      </div>
    </div>,
    document.body
  );
};
