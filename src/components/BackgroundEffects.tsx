import React, { useEffect, useState } from 'react';

export function BackgroundEffects() {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isFinePointer || prefersReducedMotion) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      targetX = (e.clientX - centerX) / centerX;
      targetY = (e.clientY - centerY) / centerY;
    };

    const updateParallax = () => {
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;
      setMouseOffset({ x: currentX, y: currentY });
      frameId = requestAnimationFrame(updateParallax);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    frameId = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-50 overflow-hidden select-none bg-[#050505]">
      {/* Layer 1: Ambient Radial Teal Glow (0.05x parallax) */}
      <div
        className="absolute inset-0 transition-transform duration-700 ease-out will-change-transform"
        style={{
          transform: `translate3d(${mouseOffset.x * 12}px, ${mouseOffset.y * 12}px, 0)`,
          backgroundImage: `
            radial-gradient(ellipse 65% 50% at 50% 0%, rgba(20, 184, 166, 0.14) 0%, transparent 70%),
            radial-gradient(circle 35% at 85% 45%, rgba(34, 211, 238, 0.06) 0%, transparent 60%),
            radial-gradient(circle 40% at 15% 85%, rgba(20, 184, 166, 0.05) 0%, transparent 60%)
          `,
        }}
      />

      {/* Layer 2: Technical Grid (0.12x parallax) */}
      <div
        className="absolute -inset-10 bg-tech-grid opacity-60 transition-transform duration-500 ease-out will-change-transform"
        style={{
          transform: `translate3d(${mouseOffset.x * 24}px, ${mouseOffset.y * 24}px, 0)`,
        }}
      />

      {/* Layer 3: Subtle Noise Overlay */}
      <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay" />

      {/* Layer 4: Distant Constellation Nodes (Floating depth particles) */}
      <div
        className="absolute inset-0 transition-transform duration-500 ease-out will-change-transform opacity-40"
        style={{
          transform: `translate3d(${mouseOffset.x * 36}px, ${mouseOffset.y * 36}px, 0)`,
        }}
      >
        <span className="absolute top-[18%] left-[12%] h-1 w-1 rounded-full bg-teal-400/60 shadow-[0_0_8px_#2dd4bf] animate-ping" style={{ animationDuration: '4s' }} />
        <span className="absolute top-[32%] right-[18%] h-1.5 w-1.5 rounded-full bg-cyan-400/50 shadow-[0_0_10px_#22d3ee] animate-pulse" style={{ animationDuration: '3s' }} />
        <span className="absolute top-[68%] left-[22%] h-1 w-1 rounded-full bg-teal-300/40 shadow-[0_0_6px_#14b8a6]" />
        <span className="absolute top-[78%] right-[28%] h-1.5 w-1.5 rounded-full bg-teal-400/50 shadow-[0_0_8px_#2dd4bf] animate-pulse" style={{ animationDuration: '5s' }} />
      </div>
    </div>
  );
}
