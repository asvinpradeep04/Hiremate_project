import React from 'react';
import { Mic, Volume2, Sparkles, Brain, Loader2 } from 'lucide-react';

interface InterviewerAvatarProps {
  state: 'idle' | 'listening' | 'speaking' | 'playing' | 'processing';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function InterviewerAvatar({
  state,
  size = 'md',
  className = '',
}: InterviewerAvatarProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24 sm:w-28 sm:h-28',
    lg: 'w-32 h-32 sm:w-40 sm:h-40',
  }[size];

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  }[size];

  const getAuraClass = () => {
    switch (state) {
      case 'playing':
        return 'border-teal-400/50 bg-teal-500/10 shadow-[0_0_50px_rgba(20,184,166,0.4)] animate-pulse-soft';
      case 'speaking':
        return 'border-emerald-400/60 bg-emerald-500/15 shadow-[0_0_55px_rgba(16,185,129,0.45)]';
      case 'listening':
        return 'border-cyan-400/50 bg-cyan-500/10 shadow-[0_0_40px_rgba(34,211,238,0.35)]';
      case 'processing':
        return 'border-amber-400/50 bg-amber-500/10 shadow-[0_0_45px_rgba(245,158,11,0.35)] animate-spin-slow';
      default:
        return 'border-white/10 bg-white/[0.02] shadow-[0_0_20px_rgba(0,0,0,0.8)]';
    }
  };

  const getCoreColor = () => {
    switch (state) {
      case 'playing':
        return 'bg-gradient-to-tr from-teal-900 via-teal-700 to-teal-500 text-white shadow-[0_0_30px_rgba(45,212,191,0.6)] border border-teal-300/40';
      case 'speaking':
        return 'bg-gradient-to-tr from-emerald-900 via-emerald-700 to-teal-400 text-white shadow-[0_0_30px_rgba(52,211,153,0.6)] border border-emerald-300/40';
      case 'listening':
        return 'bg-gradient-to-tr from-cyan-900 via-teal-800 to-cyan-500 text-white shadow-[0_0_25px_rgba(34,211,238,0.5)] border border-cyan-300/40';
      case 'processing':
        return 'bg-gradient-to-tr from-amber-900 via-amber-700 to-teal-500 text-white shadow-[0_0_30px_rgba(245,158,11,0.6)] border border-amber-300/40';
      default:
        return 'bg-gradient-to-tr from-[#121212] via-[#1a1a1a] to-[#252525] text-teal-400 border border-white/10 shadow-lg';
    }
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer Glow Ring 1 - Animated Ping */}
      {(state === 'playing' || state === 'speaking' || state === 'processing') && (
        <div
          className={`absolute rounded-full transition-all duration-700 pointer-events-none ${
            state === 'playing'
              ? 'w-36 h-36 sm:w-44 sm:h-44 border border-teal-400/30 animate-ping opacity-30'
              : state === 'speaking'
              ? 'w-40 h-40 sm:w-48 sm:h-48 border border-emerald-400/40 animate-ping opacity-40'
              : 'w-36 h-36 border border-amber-400/30 animate-pulse'
          }`}
        />
      )}

      {/* Middle Concentric Orbit */}
      <div
        className={`absolute rounded-full border transition-all duration-500 pointer-events-none ${
          size === 'sm' ? 'w-20 h-20' : size === 'md' ? 'w-32 h-32 sm:w-36 sm:h-36' : 'w-44 h-44 sm:w-52 sm:h-52'
        } ${getAuraClass()}`}
      />

      {/* Orbiting Satellite Dot */}
      {(state === 'playing' || state === 'processing') && (
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '6s' }}>
          <div className="h-2 w-2 rounded-full bg-teal-300 shadow-[0_0_8px_#2dd4bf] -translate-y-1/2 mx-auto" />
        </div>
      )}

      {/* Core Sphere */}
      <div
        className={`relative z-10 flex items-center justify-center rounded-full transition-all duration-500 ${sizeClasses} ${getCoreColor()}`}
      >
        {state === 'playing' ? (
          <Volume2 className={`${iconSizes} animate-bounce-soft text-teal-100`} />
        ) : state === 'speaking' ? (
          <Mic className={`${iconSizes} animate-pulse text-emerald-100`} />
        ) : state === 'listening' ? (
          <Mic className={`${iconSizes} opacity-90 text-cyan-100`} />
        ) : state === 'processing' ? (
          <Loader2 className={`${iconSizes} animate-spin text-amber-100`} />
        ) : (
          <Brain className={`${iconSizes} text-teal-400 opacity-90`} />
        )}
      </div>
    </div>
  );
}
