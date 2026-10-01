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
    md: 'w-28 h-28 sm:w-32 sm:h-32',
    lg: 'w-36 h-36 sm:w-44 sm:h-44',
  }[size];

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }[size];

  const getAuraClass = () => {
    switch (state) {
      case 'playing':
        return 'border-primary-500/50 bg-primary-500/10 shadow-[0_0_40px_rgba(20,184,166,0.35)] animate-pulse-soft';
      case 'speaking':
        return 'border-emerald-500/60 bg-emerald-500/15 shadow-[0_0_45px_rgba(16,185,129,0.4)]';
      case 'listening':
        return 'border-teal-500/50 bg-teal-500/10 shadow-[0_0_30px_rgba(45,212,191,0.3)]';
      case 'processing':
        return 'border-accent-500/50 bg-accent-500/10 shadow-[0_0_35px_rgba(245,158,11,0.3)] animate-spin-slow';
      default:
        return 'border-ink-200 bg-white shadow-sm';
    }
  };

  const getCoreColor = () => {
    switch (state) {
      case 'playing':
        return 'bg-gradient-to-tr from-primary-700 via-primary-600 to-teal-400 text-white';
      case 'speaking':
        return 'bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-300 text-white';
      case 'listening':
        return 'bg-gradient-to-tr from-teal-700 via-teal-600 to-primary-300 text-white';
      case 'processing':
        return 'bg-gradient-to-tr from-accent-700 via-accent-600 to-amber-300 text-white';
      default:
        return 'bg-gradient-to-tr from-ink-700 via-ink-800 to-ink-900 text-ink-200';
    }
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer Glow Ring 1 */}
      {(state === 'playing' || state === 'speaking' || state === 'processing') && (
        <div
          className={`absolute rounded-full transition-all duration-700 ${
            state === 'playing'
              ? 'w-40 h-40 sm:w-48 sm:h-48 border border-primary-400/30 animate-ping opacity-30'
              : state === 'speaking'
              ? 'w-44 h-44 sm:w-52 sm:h-52 border border-emerald-400/40 animate-ping opacity-40'
              : 'w-40 h-40 border border-accent-400/30 animate-pulse'
          }`}
        />
      )}

      {/* Middle Concentric Orbit */}
      <div
        className={`absolute rounded-full border transition-all duration-500 ${
          size === 'sm' ? 'w-20 h-20' : size === 'md' ? 'w-36 h-36 sm:w-40 sm:h-40' : 'w-48 h-48 sm:w-56 sm:h-56'
        } ${getAuraClass()}`}
      />

      {/* Core Sphere */}
      <div
        className={`relative z-10 flex items-center justify-center rounded-full shadow-lg transition-all duration-500 ${sizeClasses} ${getCoreColor()}`}
      >
        {state === 'playing' ? (
          <Volume2 className={`${iconSizes} animate-bounce-soft`} />
        ) : state === 'speaking' ? (
          <Mic className={`${iconSizes} animate-pulse`} />
        ) : state === 'listening' ? (
          <Mic className={`${iconSizes} opacity-90`} />
        ) : state === 'processing' ? (
          <Loader2 className={`${iconSizes} animate-spin`} />
        ) : (
          <Brain className={`${iconSizes} opacity-80`} />
        )}
      </div>
    </div>
  );
}
