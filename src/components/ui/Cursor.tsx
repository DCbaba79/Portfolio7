import React, { useEffect, useRef, useState } from 'react';
import { useFinePointer, useReducedMotion } from '../../lib/hooks';

/**
 * Two-part cursor: a precise dot and a lagging ring. Elements opt in to a
 * labelled state with `data-cursor="View"` (any short label).
 */
export default function Cursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [pressed, setPressed] = useState(false);
  const [hoverLink, setHoverLink] = useState(false);
  const [visible, setVisible] = useState(false);

  const enabled = fine && !reduced;

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add('has-cursor');

    const pos = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    let raf = 0;

    const tick = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.18;
      ringPos.y += (pos.y - ringPos.y) * 0.18;
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      setVisible(true);
      const target = e.target as HTMLElement | null;
      const labelled = target?.closest<HTMLElement>('[data-cursor]');
      setLabel(labelled?.dataset.cursor ?? null);
      setHoverLink(!labelled && !!target?.closest('a, button, [role="button"], input, textarea, label'));
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => setVisible(false);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  const ringSize = label ? 96 : hoverLink ? 54 : 34;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[200]" style={{ opacity: visible ? 1 : 0, transition: 'opacity .3s' }}>
      <div ref={ring} className="absolute left-0 top-0 will-change-transform">
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: ringSize,
            height: ringSize,
            transform: `translate(-50%, -50%) scale(${pressed ? 0.85 : 1})`,
            transition: 'width .5s var(--ease-out-expo), height .5s var(--ease-out-expo), background-color .4s, border-color .4s, transform .25s',
            border: `1px solid ${label ? 'transparent' : hoverLink ? 'rgba(249,115,22,0.9)' : 'rgba(243,244,246,0.45)'}`,
            backgroundColor: label ? 'var(--color-primary)' : 'transparent',
          }}
        >
          <span
            className="font-mono text-[10px] uppercase tracking-[0.25em] text-white transition-opacity duration-300"
            style={{ opacity: label ? 1 : 0 }}
          >
            {label}
          </span>
        </div>
      </div>
      <div ref={dot} className="absolute left-0 top-0 will-change-transform">
        <div
          className="h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary transition-opacity duration-200"
          style={{ opacity: label ? 0 : 1 }}
        />
      </div>
    </div>
  );
}
