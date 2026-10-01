import React, { useState, useEffect } from 'react';
import { Brain, Cpu, Sparkles } from 'lucide-react';

interface HeaderProps {
  onLogoClick?: () => void;
  rightContent?: React.ReactNode;
}

export function Header({ onLogoClick, rightContent }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 border-b ${
        isScrolled
          ? 'border-white/10 bg-[#050505]/90 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.8)]'
          : 'border-white/[0.06] bg-[#050505]/60 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <button
          onClick={onLogoClick}
          className="group flex items-center gap-3 text-left transition-all duration-200 cursor-pointer focus:outline-none"
        >
          {/* AI Node Icon with animated signal aura */}
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/20 to-teal-900/40 text-teal-300 border border-teal-500/30 shadow-[0_0_15px_rgba(20,184,166,0.25)] transition-all duration-300 group-hover:scale-105 group-hover:border-teal-400 group-hover:shadow-[0_0_22px_rgba(45,212,191,0.4)]">
            <Brain className="h-5 w-5 transition-transform duration-300 group-hover:rotate-3 text-teal-300" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-400" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-tight text-white group-hover:text-teal-300 transition-colors">
                Interview Readiness
              </span>
              <span className="rounded bg-teal-500/10 px-1.5 py-0.5 font-mono text-[9px] font-bold text-teal-300 uppercase tracking-widest border border-teal-500/25">
                AI LAB
              </span>
            </div>
            <div className="font-mono text-[9px] font-medium uppercase tracking-wider text-zinc-400">
              PM PRACTICE SIMULATOR
            </div>
          </div>
        </button>

        {rightContent}
      </div>
    </header>
  );
}
