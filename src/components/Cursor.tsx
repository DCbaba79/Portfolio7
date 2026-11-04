import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react';
import { useFinePointer, useReducedMotion } from '../lib/hooks';

/**
 * Contextual cursor label. The native cursor stays; a small tag trails it
 * and says what a click will do — "Sound on", "Scrub", "Open" — wherever an
 * element carries data-cursor.
 */
export default function Cursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const [label, setLabel] = useState<string | null>(null);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    if (!fine) return;
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-cursor]');
      setLabel(el?.dataset.cursor || null);
    };
    const onLeave = () => setLabel(null);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    window.addEventListener('scroll', onLeave, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('scroll', onLeave);
    };
  }, [fine, x, y]);

  if (!fine) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[110]"
      style={{ x: reduced ? x : sx, y: reduced ? y : sy }}
    >
      <AnimatePresence>
        {label && (
          <motion.span
            key={label}
            className="tc absolute left-4 top-4 flex items-center gap-2 whitespace-nowrap bg-paper px-2 py-1 text-[10.5px] uppercase tracking-[0.12em] text-ink"
            initial={{ opacity: 0, scale: 0.8, clipPath: 'inset(0 100% 0 0)' }}
            animate={{ opacity: 1, scale: 1, clipPath: 'inset(0 0% 0 0)' }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-orange" />
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
