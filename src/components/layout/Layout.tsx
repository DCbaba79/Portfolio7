import React, { useEffect } from 'react';
import { initLenis, destroyLenis } from '../../lib/scroll';
import { useReducedMotion } from '../../lib/hooks';
import Cursor from '../ui/Cursor';

export default function Layout({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    initLenis(reduced);
    return () => destroyLenis();
  }, [reduced]);

  return (
    <div className="relative min-h-screen bg-ink">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded focus:bg-paper focus:px-4 focus:py-2 focus:text-ink">
        Skip to content
      </a>
      <main id="main" className="relative z-10">{children}</main>

      {/* Film grain — a single static texture, no per-frame cost */}
      <div aria-hidden className="grain pointer-events-none fixed inset-0 z-[90] opacity-[0.06] mix-blend-overlay" />
      <Cursor />
    </div>
  );
}
