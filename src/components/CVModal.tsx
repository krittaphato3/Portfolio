import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Printer, 
  Download, 
  Copy, 
  Check, 
  FileText, 
  FileCode,
  ShieldCheck
} from 'lucide-react';
import { CV_DOCUMENT_DATA } from '../data/portfolioData';

interface CVModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CVModal: React.FC<CVModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'paper2' | 'paper1' | 'ats_text'>('paper2');
  const [copied, setCopied] = useState(false);
  const cv = CV_DOCUMENT_DATA;

  // Background body scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'visible';
    window.print();
    document.body.style.overflow = originalOverflow;
  };

  const generatePlainTextResume = () => {
    return `${cv.fullName.toUpperCase()} (${cv.preferredName})
${cv.headline}
Location: ${cv.location} | Email: ${cv.email}
LinkedIn: ${cv.linkedin} | GitHub: ${cv.github}

================================================================================
EDUCATION
================================================================================
${cv.education.map(e => `${e.institution} - ${e.location}
${e.degree} in ${e.major} (${e.period})
${e.details.map(d => `* ${d}`).join('\n')}`).join('\n\n')}

================================================================================
TECHNICAL SKILLS
================================================================================
* Languages: ${cv.skills.languages.join(', ')}
* Developer Tools: ${cv.skills.toolsCloud.join(', ')}
* Frameworks & Backend: ${cv.skills.frameworksBackend.join(', ')}
* AI & Systems Protocols: ${cv.skills.aiMl.join(', ')}

================================================================================
FLAGSHIP PROJECTS & OPEN SOURCE
================================================================================
* MultiCode - Autonomous Agentic Coding CLI & Subagent Swarm (TypeScript, Node.js)
  GitHub: https://github.com/krittaphato3/MultiCode
  - Engineered an autonomous iterative loop in TypeScript achieving 100% tool calling determinism across AST modifications, git operations, and test suites.
  - Reduced context token overhead by 42% through ephemeral subagent sandboxing, eliminating context degradation on multi-file refactors.
  - Accelerated developer bug localization and patch iteration speed by 3.8x compared to manual grep inspection.

* FullPiP (PiPExtension) - Multi-Window Chrome Picture-in-Picture Suite (JavaScript, Chrome MV3)
  GitHub: https://github.com/krittaphato3/PiPExtension
  - Pioneered adoption of the Document Picture-in-Picture API to extract live DOM nodes, canvas streams, and video elements with sub-millisecond mirror latency.
  - Constructed cross-tab broadcast synchronization managing 5+ concurrent floating popouts while cutting memory footprint by 65% compared to Electron alternatives.
  - Maintained steady 60 FPS stream mirrors with zero external tracking libraries, fully compliant with Manifest V3 security boundaries.

* BYOK Research Harness - Multi-Agent Adversarial Court & Citation Engine (Python, FastAPI, React 19, SQLite FTS5)
  GitHub: https://github.com/krittaphato3/byok-research-harness
  - Architected a 4-turn multi-agent adversarial court debate arena where a Lead Proposer and Skeptic cross-examine claims before an Impartial Adjudicator renders a consensus verdict.
  - Engineered a local-first SQLite FTS5 BM25 retrieval engine delivering sub-25ms citation search across uploaded documents in WAL mode.
  - Built an encrypted zero-telemetry credential vault using AES-256-GCM and PBKDF2 derivation for local models (Ollama, vLLM) and cloud endpoints.

* Infinite Realms (infworld) - Prompt-to-Playable 2D Game Synthesis Engine (Python, Phaser.js)
  GitHub: https://github.com/krittaphato3/infworld
  - Architected a 4-agent LLM swarm converting single text prompts into fully playable Phaser 3 browser games in under 45 seconds.
  - Automated Game Design Document authoring, pixel sprite generation, and executable physics code synthesis with 100% initial execution rate.

* StealthAdminPanel - Invisible Server Administration System (Java 17, Spigot/Paper API)
  GitHub: https://github.com/krittaphato3/StealthAdminPanel
  - Engineered packet-level event interception in Java 17+ with sub-0.8ms dispatch, maintaining 0 main thread tick spikes and zero memory leaks.
  - Built 35+ inventory GUI menus and real-time NBT data modifiers with 100% native bytecode and zero external libraries.

* Mindful Compass - Tech Worker Burnout Diagnostics (React, FastAPI, Scikit-Learn)
  GitHub: https://github.com/krittaphato3/DataModel-Project-Mental-Wellness
  - Trained predictive machine learning models across 40+ workplace stress variables with PHQ-9 and GAD-7 clinical scoring frameworks.
  - Delivered high-throughput FastAPI inference microservice with <25ms response latency integrated with PHQ-9 and GAD-7 clinical recovery roadmaps.
`;
  };

  const handleDownloadText = () => {
    const text = generatePlainTextResume();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Krittaphat_Panyasomphan_Resume_ATS.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadMarkdown = () => {
    const text = generatePlainTextResume();
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Krittaphat_Panyasomphan_Resume.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    const text = generatePlainTextResume();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-200 overscroll-contain print:hidden"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl h-[94vh] flex flex-col rounded-3xl bg-[#0a0b12] border border-white/[0.15] shadow-[0_30px_90px_rgba(0,0,0,0.98)] overflow-hidden overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Controls */}
        <div className="px-6 py-4 bg-obsidian-950 border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/[0.05] border border-white/[0.1] text-slate-200">
              <FileText className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-display text-white">
                  Curriculum Vitae
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Standard SWE ATS Format</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Harvard / Jake&apos;s Resume Standard · Strict A4 Page Fit
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] active:scale-95"
              title="Print or Save PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Save as PDF / Print</span>
            </button>

            <button
              onClick={handleDownloadText}
              className="px-3 py-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 border border-white/[0.08] hover:border-gold-500/30 text-slate-200 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all"
              title="Download unformatted plain text for ATS"
            >
              <Download className="w-3.5 h-3.5 text-gold-400" />
              <span className="hidden sm:inline">ATS .TXT</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="px-3 py-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 border border-white/[0.08] hover:border-gold-500/30 text-slate-200 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all"
              title="Download Markdown"
            >
              <FileCode className="w-3.5 h-3.5 text-brand-cyan" />
              <span className="hidden sm:inline">.MD</span>
            </button>

            <button
              onClick={handleCopy}
              className="p-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 border border-white/[0.08] text-slate-200 hover:text-white text-xs transition-all"
              title="Copy plain text to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 border border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-white transition-all ml-1"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Switcher: 2-Page CV vs 1-Page Resume vs Plaintext */}
        <div className="px-6 py-2 bg-obsidian-950/60 border-b border-white/[0.04] flex items-center gap-2 shrink-0 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('paper2')}
            className={`px-3 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
              activeTab === 'paper2'
                ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            2-Page Engineering CV (A4 Sheets)
          </button>
          <button
            onClick={() => setActiveTab('paper1')}
            className={`px-3 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
              activeTab === 'paper1'
                ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            1-Page Compact Resume (A4 Single)
          </button>
          <button
            onClick={() => setActiveTab('ats_text')}
            className={`px-3 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
              activeTab === 'ats_text'
                ? 'bg-white/[0.1] text-white border border-white/[0.2] font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ATS Plain Text Source
          </button>
        </div>

        {/* Scrollable Viewport with Authentic A4 Sheet Cards */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-obsidian-950/90 space-y-8">
          {activeTab === 'paper2' ? (
            /* 2-PAGE COMPREHENSIVE ENGINEERING CV */
            <div className="space-y-10 max-w-[794px] mx-auto select-text">
              {/* =========================================================================
                  A4 SHEET 1: Header, Education, Skills, Flagship AI & Systems Projects
                 ========================================================================= */}
              <div className="relative bg-white text-gray-950 p-8 sm:p-12 rounded-lg shadow-[0_15px_45px_rgba(0,0,0,0.6)] border border-gray-300 font-serif text-[10pt] leading-normal min-h-[1050px] flex flex-col justify-between">
                <div>
                  {/* Header */}
                  <div className="text-center pb-2 mb-3 border-b border-black">
                    <h1 className="text-2xl font-bold uppercase tracking-wider text-black mb-1 font-sans">
                      {cv.fullName}
                    </h1>
                    <div className="text-[9pt] font-sans text-gray-800 flex items-center justify-center flex-wrap gap-x-2">
                      <span>{cv.location}</span>
                      <span>|</span>
                      <a href={`mailto:${cv.email}`} className="text-gray-900 underline">{cv.email}</a>
                      <span>|</span>
                      <a href={cv.linkedin} target="_blank" rel="noreferrer" className="text-gray-900 underline">linkedin.com/in/krittaphatpany</a>
                      <span>|</span>
                      <a href={cv.github} target="_blank" rel="noreferrer" className="text-gray-900 underline">github.com/krittaphato3</a>
                    </div>
                  </div>

                  {/* Education */}
                  <div className="mb-3">
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
                  <div className="mb-3">
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

                  {/* Flagship Projects Part I */}
                  <div>
                    <h2 className="text-[10pt] font-sans font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
                      Flagship Software &amp; Research Projects
                    </h2>
                    
                    {/* MultiCode */}
                    <div className="mb-2.5 text-[9.5pt]">
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
                    <div className="mb-2.5 text-[9.5pt]">
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
                    <div className="mb-1 text-[9.5pt]">
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
                <div className="pt-2 border-t border-gray-300 text-[8.5pt] font-sans text-gray-500 flex justify-between items-center mt-4">
                  <span>Krittaphat Panyasomphan — Computer Engineering</span>
                  <span>Page 1 of 2</span>
                </div>
              </div>

              {/* Page Break Visual Divider */}
              <div className="flex items-center justify-center gap-3 text-xs font-mono text-slate-500">
                <span className="h-px bg-white/[0.1] w-24 inline-block" />
                <span className="text-gold-400">Scroll to Page 2 of A4 Document</span>
                <span className="h-px bg-white/[0.1] w-24 inline-block" />
              </div>

              {/* =========================================================================
                  A4 SHEET 2: Applied Systems, Server Engines, ML Capstone
                 ========================================================================= */}
              <div className="relative bg-white text-gray-950 p-8 sm:p-12 rounded-lg shadow-[0_15px_45px_rgba(0,0,0,0.6)] border border-gray-300 font-serif text-[10pt] leading-normal min-h-[1050px] flex flex-col justify-between">
                <div>
                  {/* Subtle Professional Running Header on Sheet 2 */}
                  <div className="flex justify-between items-baseline pb-1.5 mb-3 border-b border-gray-300 text-[8.5pt] font-sans text-gray-600">
                    <span className="font-semibold text-gray-900 tracking-wide">
                      {cv.fullName}
                    </span>
                    <span className="font-mono text-[8.5pt] text-gray-500">
                      {cv.email}
                    </span>
                  </div>

                  {/* Systems Projects Part II */}
                  <div className="mb-3">
                    <h2 className="text-[10pt] font-sans font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-2">
                      Systems Engineering &amp; Applied Software Projects
                    </h2>

                    {/* Infinite Realms */}
                    <div className="mb-2.5 text-[9.5pt]">
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
                    <div className="mb-2.5 text-[9.5pt]">
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
                    <div className="mb-2.5 text-[9.5pt]">
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
                    <div className="mb-2.5 text-[9.5pt]">
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
                    <div className="mb-2 text-[9.5pt]">
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
                  <div>
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
                <div className="pt-2 border-t border-gray-300 text-[8.5pt] font-sans text-gray-500 flex justify-between items-center mt-4">
                  <span>Krittaphat Panyasomphan — Computer Engineering</span>
                  <span>Page 2 of 2</span>
                </div>
              </div>
            </div>
          ) : activeTab === 'paper1' ? (
            /* 1-PAGE COMPACT RESUME (Strictly 1 Single A4 Sheet for Recruiter Fast-Tracking) */
            <div className="max-w-[794px] mx-auto select-text">
              <div className="relative bg-white text-gray-950 p-8 sm:p-11 rounded-lg shadow-[0_15px_45px_rgba(0,0,0,0.6)] border border-gray-300 font-serif text-[9.5pt] leading-normal min-h-[1050px] flex flex-col justify-between">
                <div>
                  {/* Header */}
                  <div className="text-center pb-2 mb-2.5 border-b border-black">
                    <h1 className="text-2xl font-bold uppercase tracking-wider text-black mb-1 font-sans">
                      {cv.fullName}
                    </h1>
                    <div className="text-[8.5pt] font-sans text-gray-800 flex items-center justify-center flex-wrap gap-x-2">
                      <span>{cv.location}</span>
                      <span>|</span>
                      <a href={`mailto:${cv.email}`} className="text-gray-900 underline">{cv.email}</a>
                      <span>|</span>
                      <a href={cv.linkedin} target="_blank" rel="noreferrer" className="text-gray-900 underline">linkedin.com/in/krittaphatpany</a>
                      <span>|</span>
                      <a href={cv.github} target="_blank" rel="noreferrer" className="text-gray-900 underline">github.com/krittaphato3</a>
                    </div>
                  </div>

                  {/* Education */}
                  <div className="mb-2.5">
                    <h2 className="text-[9.5pt] font-sans font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1">
                      Education
                    </h2>
                    {cv.education.map((edu, idx) => (
                      <div key={idx} className="mb-0.5 text-[9pt]">
                        <div className="flex justify-between items-baseline font-bold text-black font-sans">
                          <span>{edu.institution}</span>
                          <span className="font-normal text-[8.5pt]">{edu.period}</span>
                        </div>
                        <div className="italic text-gray-900 text-[8.5pt]">
                          {edu.degree} in {edu.major} — {edu.location}
                        </div>
                        <ul className="list-disc list-outside ml-4 mt-0.5 space-y-0.5 text-[8.5pt] text-gray-800 leading-snug">
                          {edu.details.map((point, i) => (
                            <li key={i}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Technical Skills */}
                  <div className="mb-2.5">
                    <h2 className="text-[9.5pt] font-sans font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1">
                      Technical Skills
                    </h2>
                    <div className="text-[8.5pt] space-y-0.5 text-gray-900 leading-snug">
                      <div>
                        <span className="font-bold font-sans">Languages:</span> TypeScript, JavaScript, Python, Java 17+, C++, C, C#, Go, Lua, SQL
                      </div>
                      <div>
                        <span className="font-bold font-sans">Tools &amp; Cloud:</span> Git, GitHub Actions, Docker, Linux, Bash, Vite, Postman, CI/CD
                      </div>
                      <div>
                        <span className="font-bold font-sans">Frameworks:</span> React, Next.js, Node.js, FastAPI, Paper/Spigot Engine, Phaser.js, Tailwind CSS
                      </div>
                      <div>
                        <span className="font-bold font-sans">AI &amp; Systems:</span> Autonomous Agent Loops, Tool Calling, MCP, PyTorch, Scikit-Learn
                      </div>
                    </div>
                  </div>

                  {/* Flagship Projects */}
                  <div>
                    <h2 className="text-[9.5pt] font-sans font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5">
                      Flagship Engineering Projects
                    </h2>

                    {/* MultiCode */}
                    <div className="mb-2 text-[9pt]">
                      <div className="flex justify-between items-baseline font-bold text-black font-sans">
                        <span>MultiCode — Autonomous Agentic Coding CLI &amp; Subagent Swarm</span>
                        <span className="font-normal text-[8pt] font-mono text-gray-600">TypeScript, Node.js</span>
                      </div>
                      <div className="text-[8pt] font-sans text-gray-600 mb-0.5">github.com/krittaphato3/MultiCode</div>
                      <ul className="list-disc list-outside ml-4 space-y-0.5 text-[8.5pt] text-gray-800 leading-snug">
                        <li>Engineered an autonomous iterative loop in TypeScript achieving 100% tool calling determinism across AST modifications and tests.</li>
                        <li>Reduced context token overhead by 42% through ephemeral subagent sandboxing, accelerating refactors by 3.8x.</li>
                      </ul>
                    </div>

                    {/* FullPiP */}
                    <div className="mb-2 text-[9pt]">
                      <div className="flex justify-between items-baseline font-bold text-black font-sans">
                        <span>FullPiP (PiPExtension) — Multi-Window Chrome Picture-in-Picture Suite</span>
                        <span className="font-normal text-[8pt] font-mono text-gray-600">JavaScript, Chrome MV3</span>
                      </div>
                      <div className="text-[8pt] font-sans text-gray-600 mb-0.5">github.com/krittaphato3/PiPExtension</div>
                      <ul className="list-disc list-outside ml-4 space-y-0.5 text-[8.5pt] text-gray-800 leading-snug">
                        <li>Pioneered adoption of the Document PiP API to detach DOM nodes and canvas feeds with sub-1ms mirror latency.</li>
                        <li>Constructed cross-tab broadcast synchronization managing 5+ concurrent floating popouts with 65% less RAM than Electron.</li>
                      </ul>
                    </div>

                    {/* BYOK Research Harness */}
                    <div className="mb-2 text-[9pt]">
                      <div className="flex justify-between items-baseline font-bold text-black font-sans">
                        <span>BYOK Research Harness — Multi-Agent Adversarial Court &amp; Citation Engine</span>
                        <span className="font-normal text-[8pt] font-mono text-gray-600">Python, FastAPI, SQLite FTS5</span>
                      </div>
                      <div className="text-[8pt] font-sans text-gray-600 mb-0.5">github.com/krittaphato3/byok-research-harness</div>
                      <ul className="list-disc list-outside ml-4 space-y-0.5 text-[8.5pt] text-gray-800 leading-snug">
                        <li>Architected a 4-turn multi-agent adversarial court debate arena where a Lead Proposer and Skeptic cross-examine claims before an Impartial Adjudicator.</li>
                        <li>Built local-first SQLite FTS5 BM25 retrieval delivering &lt;25ms citation search and an AES-256-GCM encrypted key vault.</li>
                      </ul>
                    </div>

                    {/* StealthAdminPanel */}
                    <div className="mb-1 text-[9pt]">
                      <div className="flex justify-between items-baseline font-bold text-black font-sans">
                        <span>StealthAdminPanel — Invisible Server Administration System</span>
                        <span className="font-normal text-[8pt] font-mono text-gray-600">Java 17, Spigot/Paper</span>
                      </div>
                      <div className="text-[8pt] font-sans text-gray-600 mb-0.5">github.com/krittaphato3/StealthAdminPanel</div>
                      <ul className="list-disc list-outside ml-4 space-y-0.5 text-[8.5pt] text-gray-800 leading-snug">
                        <li>Engineered packet-level event interception in Java 17+ with sub-0.8ms dispatch, 0 tick spikes, and zero memory leaks.</li>
                        <li>Built 35+ inventory GUI menus and real-time NBT data modifiers with 100% native bytecode and zero external libraries.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 1-Page Bottom Folio */}
                <div className="pt-2 border-t border-gray-300 text-[8pt] font-sans text-gray-500 flex justify-between items-center mt-3">
                  <span>Krittaphat Panyasomphan — Computer Engineering (KMUTT)</span>
                  <span>1-Page Clean Fit</span>
                </div>
              </div>
            </div>
          ) : (
            /* ATS Plain Text Source View */
            <div className="max-w-3xl mx-auto bg-obsidian-950 p-6 rounded-2xl border border-white/[0.08] font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed select-all">
              {generatePlainTextResume()}
            </div>
          )}
        </div>

        {/* Modal Bottom Bar */}
        <div className="px-6 py-3.5 bg-obsidian-950 border-t border-white/[0.08] flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-400 font-mono hidden sm:block">
            Standard A4 Sheet Format · Strict page bounds guaranteed on PDF export.
          </div>
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]"
          >
            <Printer className="w-4 h-4" />
            <span>Download Official PDF (A4)</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
