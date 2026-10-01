import React, { useEffect, useState, useRef } from 'react';

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [cursorState, setCursorState] = useState<'default' | 'hover' | 'card' | 'explore' | 'view'>('default');
  const [isPointerDown, setIsPointerDown] = useState(false);
  const targetPosRef = useRef({ x: -100, y: -100 });
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Check if device supports fine hover pointer and does not prefer reduced motion
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isFinePointer || prefersReducedMotion) {
      setEnabled(false);
      return;
    }

    setEnabled(true);

    const onMouseMove = (e: MouseEvent) => {
      targetPosRef.current = { x: e.clientX, y: e.clientY };
      setPosition({ x: e.clientX, y: e.clientY });

      // Determine element hovered
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorAttr = target.closest('[data-cursor]')?.getAttribute('data-cursor');
      if (cursorAttr === 'explore') {
        setCursorState('explore');
      } else if (cursorAttr === 'view') {
        setCursorState('view');
      } else if (target.closest('button, a, input, select, textarea, [role="button"]')) {
        setCursorState('hover');
      } else if (target.closest('.card, .card-premium, [data-interactive-card]')) {
        setCursorState('card');
      } else {
        setCursorState('default');
      }
    };

    const onMouseDown = () => setIsPointerDown(true);
    const onMouseUp = () => setIsPointerDown(false);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // Spring trailing animation loop
    let currentX = -100;
    let currentY = -100;
    const followFactor = 0.16;

    const animateTrailing = () => {
      currentX += (targetPosRef.current.x - currentX) * followFactor;
      currentY += (targetPosRef.current.y - currentY) * followFactor;
      setTrailingPos({ x: currentX, y: currentY });
      animFrameRef.current = requestAnimationFrame(animateTrailing);
    };

    animFrameRef.current = requestAnimationFrame(animateTrailing);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  if (!enabled) return null;

  const isExplore = cursorState === 'explore';
  const isView = cursorState === 'view';
  const isHover = cursorState === 'hover';
  const isCard = cursorState === 'card';

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Trailing Spring Aura Ring */}
      <div
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-teal-400/40 transition-[width,height,background-color,border-color,transform] duration-200 ease-out will-change-transform flex items-center justify-center backdrop-blur-[1px]"
        style={{
          transform: `translate3d(${trailingPos.x}px, ${trailingPos.y}px, 0) scale(${
            isPointerDown ? 0.8 : isExplore || isView ? 1.6 : isHover ? 1.4 : isCard ? 1.2 : 1
          })`,
          width: isExplore || isView ? '56px' : isHover ? '40px' : isCard ? '32px' : '26px',
          height: isExplore || isView ? '56px' : isHover ? '40px' : isCard ? '32px' : '26px',
          backgroundColor: isHover
            ? 'rgba(45, 212, 191, 0.12)'
            : isExplore || isView
            ? 'rgba(20, 184, 166, 0.2)'
            : 'rgba(20, 184, 166, 0.05)',
          boxShadow: isHover || isExplore
            ? '0 0 20px rgba(45, 212, 191, 0.35)'
            : 'none',
        }}
      >
        {(isExplore || isView) && (
          <span className="text-[8px] font-mono font-bold tracking-widest text-teal-300 uppercase animate-pulse">
            {isExplore ? 'EXPLORE' : 'VIEW'}
          </span>
        )}
      </div>

      {/* Immediate Precision Dot */}
      <div
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-300 shadow-[0_0_8px_#2dd4bf] transition-transform duration-75 will-change-transform"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${
            isPointerDown ? 0.6 : isHover ? 1.3 : 1
          })`,
          width: '6px',
          height: '6px',
          opacity: isExplore || isView ? 0 : 1,
        }}
      />
    </div>
  );
}
