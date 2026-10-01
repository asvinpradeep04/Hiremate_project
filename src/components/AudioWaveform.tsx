import React, { useEffect, useState } from 'react';

interface AudioWaveformProps {
  state: 'idle' | 'listening' | 'speaking' | 'playing' | 'processing';
  frequencies?: number[];
  height?: number;
  barCount?: number;
  className?: string;
}

export function AudioWaveform({
  state,
  frequencies = [],
  height = 56,
  barCount = 32,
  className = '',
}: AudioWaveformProps) {
  const [sinePhase, setSinePhase] = useState(0);

  // Animate phase for AI speaking state
  useEffect(() => {
    if (state !== 'playing' && state !== 'processing') return;
    const interval = setInterval(() => {
      setSinePhase(p => (p + 0.15) % (Math.PI * 2));
    }, 30);
    return () => clearInterval(interval);
  }, [state]);

  // Compute bar heights (0 to 1)
  const bars = Array.from({ length: barCount }, (_, i) => {
    if (state === 'speaking' || state === 'listening') {
      // Live microphone audio frequencies
      if (frequencies.length > 0) {
        const freqIdx = Math.floor((i / barCount) * frequencies.length);
        const val = frequencies[freqIdx] || 0.08;
        return Math.max(0.12, Math.min(1.0, val * 1.5));
      }
      return 0.15;
    }

    if (state === 'playing') {
      // AI interviewer speaking: harmonic multi-sine waves
      const x = (i / barCount) * Math.PI * 3;
      const wave =
        Math.sin(x + sinePhase) * 0.45 +
        Math.sin(x * 1.8 - sinePhase * 1.2) * 0.25 +
        0.55;
      return Math.max(0.18, Math.min(0.95, wave));
    }

    if (state === 'processing') {
      // Subtle pulse traveling across
      const wave = Math.sin((i / barCount) * Math.PI * 2 + sinePhase * 1.5) * 0.35 + 0.45;
      return Math.max(0.15, Math.min(0.85, wave));
    }

    // Idle
    return 0.12 + (Math.sin(i * 0.5) + 1) * 0.05;
  });

  const getBarColor = () => {
    if (state === 'playing') {
      return 'bg-gradient-to-t from-teal-600 via-teal-400 to-cyan-300 shadow-[0_0_10px_rgba(45,212,191,0.6)]';
    }
    if (state === 'speaking') {
      return 'bg-gradient-to-t from-emerald-600 via-emerald-400 to-teal-300 shadow-[0_0_10px_rgba(52,211,153,0.6)]';
    }
    if (state === 'processing') {
      return 'bg-gradient-to-t from-amber-600 via-amber-400 to-teal-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]';
    }
    return 'bg-zinc-700/60';
  };

  return (
    <div
      className={`flex items-center justify-center gap-1 sm:gap-1.5 px-4 ${className}`}
      style={{ height: `${height}px` }}
      aria-label="Audio waveform visualization"
    >
      {bars.map((normalizedHeight, i) => {
        const barHeightPx = Math.max(4, Math.round(normalizedHeight * height));
        return (
          <div
            key={i}
            className={`w-1 sm:w-1.5 rounded-full transition-all duration-75 ${getBarColor()}`}
            style={{
              height: `${barHeightPx}px`,
              opacity: state === 'idle' ? 0.3 : 0.95,
            }}
          />
        );
      })}
    </div>
  );
}
