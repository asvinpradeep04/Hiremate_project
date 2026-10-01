import React from 'react';

interface AICoreSphereProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  activeStage?: string;
  pulseGlow?: boolean;
}

export function AICoreSphere({
  size = 'md',
  className = '',
  activeStage,
  pulseGlow = true,
}: AICoreSphereProps) {
  const sizeMap = {
    sm: 'w-20 h-20',
    md: 'w-36 h-36',
    lg: 'w-56 h-56',
    hero: 'w-72 h-72 sm:w-96 sm:h-96 lg:w-[420px] lg:h-[420px]',
  };

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Volumetric Radial Glow */}
      <div
        className={`absolute rounded-full pointer-events-none -z-10 blur-3xl transition-opacity duration-700 ${
          pulseGlow ? 'opacity-80 animate-glow-breathe' : 'opacity-40'
        } bg-gradient-to-tr from-teal-500/30 via-cyan-400/20 to-transparent`}
        style={{ width: '130%', height: '130%' }}
      />

      {/* Orbit Ring Outer 1 */}
      <div
        className="absolute inset-0 rounded-full border border-teal-400/25 animate-spin"
        style={{ animationDuration: '28s' }}
      >
        <div className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_10px_#22d3ee] -translate-y-1 mx-auto" />
      </div>

      {/* Orbit Ring Outer 2 - Counter Rotation */}
      <div
        className="absolute inset-[-12%] rounded-full border border-white/[0.08] animate-spin"
        style={{ animationDuration: '36s', animationDirection: 'reverse' }}
      >
        <div className="h-1.5 w-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf] translate-x-1" />
      </div>

      {/* Actual 3D Photorealistic AI Neural Core Asset */}
      <div className={`relative rounded-full overflow-hidden shadow-[0_0_60px_rgba(20,184,166,0.4)] border border-teal-500/40 ${sizeMap[size]}`}>
        <img
          src="/assets/ai_neural_core.jpg"
          alt="AI Intelligence Core"
          className="w-full h-full object-cover object-center scale-105 hover:scale-110 transition-transform duration-700 ease-out"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-teal-400/10 pointer-events-none" />
      </div>

      {/* Active Stage HUD Tag */}
      {activeStage && (
        <div className="absolute -bottom-4 z-20 inline-flex items-center gap-2 rounded-full border border-teal-500/40 bg-[#080808]/95 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-teal-300 shadow-[0_0_15px_rgba(45,212,191,0.3)]">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-ping" />
          <span>CORE: {activeStage}</span>
        </div>
      )}
    </div>
  );
}
