import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, CornerDownLeft, Sparkles, RefreshCw } from 'lucide-react';
import { PERSONAL_INFO, PROJECTS } from '../data/portfolioData';

interface TerminalSimulatorProps {
  onOpenCVModal: () => void;
}

interface CommandLog {
  id: string;
  command: string;
  output: React.ReactNode;
  timestamp: string;
}

export const TerminalSimulator: React.FC<TerminalSimulatorProps> = ({ onOpenCVModal }) => {
  const [inputVal, setInputVal] = useState('');
  const [logs, setLogs] = useState<CommandLog[]>([]);
  const [isRunningSim, setIsRunningSim] = useState(false);
  const terminalScreenRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const getTimestamp = () => {
    const now = new Date();
    return now.toTimeString().split(' ')[0];
  };

  const handleCommand = (cmdStr: string) => {
    const rawCmd = cmdStr.trim();
    if (!rawCmd) return;
    const lower = rawCmd.toLowerCase();

    let outputNode: React.ReactNode = null;

    if (lower === 'clear') {
      setLogs([]);
      setInputVal('');
      return;
    } else if (lower === 'help') {
      outputNode = (
        <div className="space-y-1.5 text-xs text-slate-300 font-mono">
          <div className="text-gold-400 font-semibold mb-1">Available System Commands:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
            <div><span className="text-brand-cyan">projects</span> — Browse featured engineering repositories</div>
            <div><span className="text-brand-cyan">run multicode</span> — Simulate autonomous AI agent loop</div>
            <div><span className="text-brand-cyan">skills</span> — View engineering competencies & stack</div>
            <div><span className="text-brand-cyan">awards</span> — List hackathons & academic distinctions</div>
            <div><span className="text-brand-cyan">cv</span> — Open interactive curriculum vitae</div>
            <div><span className="text-brand-cyan">about</span> — Profile bio & KMUTT background</div>
            <div><span className="text-brand-cyan">contact</span> — Get direct contact links</div>
            <div><span className="text-gold-400 font-bold">sudo hire</span> — Fast-track recruiter priority protocol</div>
            <div><span className="text-slate-400">clear</span> — Reset terminal screen</div>
          </div>
        </div>
      );
    } else if (lower === 'projects') {
      outputNode = (
        <div className="space-y-2 text-xs font-mono">
          <div className="text-gold-400 font-semibold">Production & Research Projects:</div>
          {PROJECTS.slice(0, 5).map((p) => (
            <div key={p.id} className="p-2 rounded bg-obsidian-900/80 border border-white/[0.06]">
              <div className="flex items-center justify-between">
                <span className="text-brand-cyan font-bold">{p.title}</span>
                <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-white/[0.05]">{p.category}</span>
              </div>
              <div className="text-slate-300 text-[11px] mt-0.5">{p.tagline}</div>
              <div className="text-[10px] text-gold-400/80 mt-1">Tech: {p.techStack.join(' · ')}</div>
            </div>
          ))}
          <div className="text-slate-400 text-[11px] pt-1">
            Type <span className="text-brand-cyan">run multicode</span> to test the autonomous agent simulation.
          </div>
        </div>
      );
    } else if (lower === 'run multicode' || lower === 'multicode') {
      setIsRunningSim(true);
      outputNode = (
        <div className="space-y-1.5 text-xs font-mono text-slate-300">
          <div className="text-brand-cyan font-semibold">[MultiCode Engine v2.4.0 — Autonomous Coding Loop]</div>
          <div className="text-slate-400">Target Workspace: /workspace/distributed-kv-store</div>
          <div className="text-slate-400">Prompt: &quot;Fix race condition in atomic write-ahead log & run regression tests&quot;</div>
          <div className="pt-1.5 space-y-1 border-l-2 border-brand-violet/60 pl-2">
            <div className="text-gold-400">&gt; Turn 1: Planner Agent dispatched</div>
            <div className="text-slate-300 text-[11px]">  [tool:glob] Searched *.rs, *.toml (found 24 source files)</div>
            <div className="text-slate-300 text-[11px]">  [tool:read_file] Read src/wal/segment.rs:45-120</div>
            <div className="text-brand-cyan">&gt; Turn 2: Implementer Agent isolated context</div>
            <div className="text-slate-300 text-[11px]">  [tool:edit_file] Applied mutex lock guard prior to buffer flush</div>
            <div className="text-emerald-400">&gt; Turn 3: Verification Pass</div>
            <div className="text-slate-300 text-[11px]">  [tool:bash] cargo test --test wal_concurrent_stress</div>
            <div className="text-emerald-400 font-bold">  Result: 28 passed, 0 failed, 0 regressions in 1.42s</div>
          </div>
          <div className="text-gold-300 font-semibold pt-1">
            Status: Task completed autonomously. Subagents settled in 3 turns (12.4k tokens).
          </div>
        </div>
      );
      setTimeout(() => setIsRunningSim(false), 800);
    } else if (lower === 'skills') {
      outputNode = (
        <div className="space-y-1 text-xs font-mono">
          <div className="text-gold-400 font-semibold">Technical Matrix:</div>
          <div><span className="text-brand-cyan">Languages:</span> TypeScript, JavaScript, Python, Java 17+, C++, C, C#, Go, Lua, SQL</div>
          <div><span className="text-brand-violet">AI & Systems:</span> Autonomous Loops, Tool Calling, MCP, LLM Benchmarking, PyTorch, Scikit-Learn</div>
          <div><span className="text-brand-emerald">Systems & Backend:</span> Node.js, FastAPI, Linux Systems, Paper/Spigot Server Engine, Packet Interception, Docker</div>
          <div><span className="text-gold-300">Frontend & Tools:</span> React 18/19, Next.js, Tailwind CSS, Framer Motion, Chrome Extension MV3, Figma</div>
        </div>
      );
    } else if (lower === 'awards') {
      outputNode = (
        <div className="space-y-1.5 text-xs font-mono text-slate-300">
          <div className="text-gold-400 font-semibold">Recognitions &amp; Verified Credentials:</div>
          <div className="text-slate-400">
            No active certificates or awards listed yet. Entries will be populated upon official verification.
          </div>
        </div>
      );
    } else if (lower === 'cv' || lower === 'resume') {
      outputNode = (
        <div className="space-y-1.5 text-xs font-mono">
          <div className="text-gold-400 font-semibold">Curriculum Vitae Access:</div>
          <div className="text-slate-300">Opening full-fidelity interactive CV modal...</div>
          <button
            onClick={onOpenCVModal}
            className="mt-1 px-3 py-1 rounded bg-gold-500/20 text-gold-300 border border-gold-500/40 hover:bg-gold-500/30 font-semibold flex items-center gap-1.5"
          >
            Click here to open CV Modal & Print PDF
          </button>
        </div>
      );
      setTimeout(() => onOpenCVModal(), 400);
    } else if (lower === 'about') {
      outputNode = (
        <div className="space-y-1.5 text-xs font-mono text-slate-300">
          <div><span className="text-gold-400 font-bold">{PERSONAL_INFO.fullName} (Ozone)</span></div>
          <div>{PERSONAL_INFO.role}</div>
          <div className="text-slate-400">{PERSONAL_INFO.university}</div>
          <div className="pt-1 text-slate-300 leading-relaxed">{PERSONAL_INFO.shortBio}</div>
        </div>
      );
    } else if (lower === 'contact') {
      outputNode = (
        <div className="space-y-1 text-xs font-mono">
          <div className="text-gold-400 font-semibold">Direct Communication Channels:</div>
          <div>Email: <a href={`mailto:${PERSONAL_INFO.email}`} className="text-brand-cyan hover:underline">{PERSONAL_INFO.email}</a></div>
          <div>LinkedIn: <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noreferrer" className="text-brand-cyan hover:underline">{PERSONAL_INFO.linkedin}</a></div>
          <div>GitHub: <a href={PERSONAL_INFO.github} target="_blank" rel="noreferrer" className="text-brand-cyan hover:underline">{PERSONAL_INFO.github}</a></div>
          <div>Instagram: <span className="text-slate-300">@{PERSONAL_INFO.instagram}</span></div>
        </div>
      );
    } else if (lower === 'sudo hire' || lower === 'hire') {
      outputNode = (
        <div className="p-3 rounded-lg bg-gold-500/10 border border-gold-500/40 text-xs font-mono space-y-2">
          <div className="text-gold-400 font-bold uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span>Priority Candidate Dispatch Initiated</span>
          </div>
          <p className="text-slate-200 leading-relaxed">
            Thank you for evaluating Krittaphat&apos;s engineering background! He is actively open for Software Engineering, AI/ML Engineering, and Systems Internship/Junior roles.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <a
              href={`mailto:${PERSONAL_INFO.email}?subject=Interview%20Invitation%20for%20Krittaphat%20Panyasomphan`}
              className="px-3 py-1.5 rounded bg-gold-500 text-obsidian-950 font-bold hover:bg-gold-400 transition-colors"
            >
              Send Interview Invitation
            </a>
            <button
              onClick={onOpenCVModal}
              className="px-3 py-1.5 rounded bg-obsidian-800 border border-gold-500/40 text-gold-300 hover:text-white"
            >
              Review Full Resume
            </button>
          </div>
        </div>
      );
    } else {
      outputNode = (
        <div className="text-xs font-mono text-red-400">
          zsh: command not found: {rawCmd}. Type <span className="text-gold-400 font-bold underline cursor-pointer" onClick={() => handleCommand('help')}>help</span> for available commands.
        </div>
      );
    }

    setLogs((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        command: rawCmd,
        output: outputNode,
        timestamp: getTimestamp(),
      },
    ]);
    setInputVal('');
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(inputVal);
  };

  useEffect(() => {
    // Initial welcome log
    setLogs([
      {
        id: 'init-1',
        command: 'systeminfo --profile',
        output: (
          <div className="space-y-1 text-xs font-mono text-slate-300">
            <div className="text-gold-400 font-bold">Ozone OS v4.2 [KMUTT Engineering Kernel 6.8.0]</div>
            <div>Candidate: Krittaphat Panyasomphan (Ozone) · Computer Engineering</div>
            <div className="text-slate-400">
              Type <span className="text-brand-cyan font-bold">help</span> to list commands or click any quick action below.
            </div>
          </div>
        ),
        timestamp: getTimestamp(),
      },
    ]);
  }, []);

  useEffect(() => {
    if (terminalScreenRef.current) {
      terminalScreenRef.current.scrollTop = terminalScreenRef.current.scrollHeight;
    }
  }, [logs]);

  const quickChips = [
    { label: 'projects', desc: 'Browse Top Repos' },
    { label: 'run multicode', desc: 'Simulate Agent Loop' },
    { label: 'skills', desc: 'Tech Radar' },
    { label: 'awards', desc: 'Certifications' },
    { label: 'cv', desc: 'Curriculum Vitae' },
    { label: 'sudo hire', desc: 'Fast-Track Hire' },
  ];

  return (
    <section id="terminal" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-10">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-xs font-mono mb-3">
          <TerminalIcon className="w-3.5 h-3.5" />
          <span>Interactive Developer Environment</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
          Test-Drive the Recruiter Console
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mt-2">
          An interactive shell running inside the browser to explore architecture, trigger AI agent simulations, or inspect credentials.
        </p>
      </div>

      {/* Terminal Window Container */}
      <div className="rounded-2xl bg-obsidian-900/90 border border-white/[0.1] shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl overflow-hidden">
        {/* Terminal Titlebar */}
        <div className="px-4 py-3 bg-obsidian-950/90 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block border border-red-600/50" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block border border-yellow-600/50" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block border border-green-600/50" />
            <span className="ml-2 font-mono text-xs text-slate-400 font-medium hidden sm:inline">
              krittaphat@kmutt: ~/portfolio (zsh)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleCommand('clear')}
              className="text-slate-400 hover:text-white text-xs font-mono flex items-center gap-1 transition-colors"
              title="Clear terminal output"
            >
              <RefreshCw className="w-3 h-3" />
              <span className="hidden sm:inline">clear</span>
            </button>
          </div>
        </div>

        {/* Quick Action Chips Bar */}
        <div className="px-4 py-2.5 bg-obsidian-950/40 border-b border-white/[0.04] flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-mono text-slate-500 shrink-0">Quick run:</span>
          {quickChips.map((chip) => (
            <button
              key={chip.label}
              onClick={() => handleCommand(chip.label)}
              className="px-2.5 py-1 rounded-md bg-obsidian-800/90 hover:bg-gold-500/20 border border-white/[0.08] hover:border-gold-500/40 text-[11px] font-mono text-slate-300 hover:text-gold-200 shrink-0 transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>{chip.label}</span>
            </button>
          ))}
        </div>

        {/* Terminal Screen / Logs */}
        <div 
          ref={terminalScreenRef}
          onClick={() => inputRef.current?.focus()}
          className="p-4 sm:p-6 min-h-[340px] max-h-[500px] overflow-y-auto space-y-4 font-mono text-xs sm:text-sm cursor-text overscroll-contain"
        >
          {logs.map((log) => (
            <div key={log.id} className="space-y-1.5 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-gold-400 font-bold">krittaphat@kmutt:~$</span>
                <span className="text-white font-medium">{log.command}</span>
                <span className="text-[10px] text-slate-600 ml-auto">{log.timestamp}</span>
              </div>
              <div className="pl-4 border-l border-white/[0.06] py-0.5">
                {log.output}
              </div>
            </div>
          ))}

          {/* Prompt line */}
          <form onSubmit={onSubmit} className="flex items-center gap-2 pt-2">
            <span className="text-gold-400 font-bold shrink-0">krittaphat@kmutt:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              disabled={isRunningSim}
              placeholder="Type 'help' or click a quick action above..."
              className="flex-1 bg-transparent border-none outline-none text-white font-mono placeholder:text-slate-600 text-xs sm:text-sm"
              autoFocus
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || isRunningSim}
              className="text-slate-500 hover:text-gold-400 disabled:opacity-30 transition-colors p-1"
              aria-label="Execute command"
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
