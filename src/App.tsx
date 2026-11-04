import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import { Hero } from './components/Hero';
import { TerminalSimulator } from './components/TerminalSimulator';
import { ProjectsBento } from './components/ProjectsBento';
import { CertificatesAwards } from './components/CertificatesAwards';
import { TechStackMatrix } from './components/TechStackMatrix';
import { Footer } from './components/Footer';
import { CVModal } from './components/CVModal';
import { CVPrintDocument } from './components/CVPrintDocument';
import { CommandPalette } from './components/CommandPalette';

export const App: React.FC = () => {
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative min-h-screen bg-obsidian-950 text-slate-100 selection:bg-gold-500/30 selection:text-gold-200">
      {/* Background Interactive Ambient Mesh */}
      <BackgroundCanvas />

      {/* Screen Interactive Portfolio Layout */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar 
          onOpenCVModal={() => setIsCVModalOpen(true)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />
        
        <main className="flex-grow">
          <Hero onOpenCVModal={() => setIsCVModalOpen(true)} />
          <TerminalSimulator onOpenCVModal={() => setIsCVModalOpen(true)} />
          <ProjectsBento />
          <CertificatesAwards />
          <TechStackMatrix />
        </main>

        <Footer onOpenCVModal={() => setIsCVModalOpen(true)} />
      </div>

      {/* Spotlight Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenCVModal={() => setIsCVModalOpen(true)}
      />

      {/* Interactive CV Modal */}
      <CVModal
        isOpen={isCVModalOpen}
        onClose={() => setIsCVModalOpen(false)}
      />

      {/* Hidden ATS Printable CV Document for Browser Print / PDF Export */}
      <CVPrintDocument />
    </div>
  );
};

export default App;
