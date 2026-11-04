import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { FRAMES, PROFILE } from '../data/site';
import { stopScroll } from '../lib/scroll';

const SEEN_KEY = 'dj:title-seen';

export function shouldPlayTitles() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  try { return !sessionStorage.getItem(SEEN_KEY); } catch { return true; }
}

function preload(srcs: string[], timeout = 4000) {
  return Promise.race([
    Promise.all(srcs.map((s) => new Promise<void>((res) => {
      const img = new Image();
      img.onload = img.onerror = () => res();
      img.src = s;
    }))),
    new Promise<void>((res) => setTimeout(res, timeout)),
  ]);
}

/**
 * Opening titles: the project "opens", then frames from the work flip past,
 * accelerating like a comic-book title card, and cut hard to black.
 */
export default function TitleSequence({ onDone }: { onDone: () => void }) {
  const [stage, setStage] = useState<'load' | 'flip' | 'out'>('load');
  const [pct, setPct] = useState(0);
  const [frame, setFrame] = useState(0);
  const [scale, setScale] = useState(0.34);
  const done = useRef(false);

  const finish = () => {
    if (done.current) return;
    done.current = true;
    try { sessionStorage.setItem(SEEN_KEY, '1'); } catch {}
    setStage('out');
  };

  useEffect(() => {
    stopScroll(true);
    document.documentElement.style.overflow = 'hidden';
    let alive = true;
    let n = 0;
    FRAMES.forEach((s) => {
      const img = new Image();
      img.onload = img.onerror = () => alive && setPct(Math.round((++n / FRAMES.length) * 100));
      img.src = s;
    });
    preload(FRAMES).then(() => alive && setTimeout(() => alive && setStage('flip'), 350));
    const onKey = (e: KeyboardEvent) => (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') && finish();
    window.addEventListener('keydown', onKey);
    return () => {
      alive = false;
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  // The flip: each frame shorter than the last, the window growing toward full frame
  useEffect(() => {
    if (stage !== 'flip') return;
    const order = [...FRAMES.keys()].sort(() => Math.random() - 0.5).slice(0, 22);
    let i = 0;
    let t: number;
    const step = () => {
      if (i >= order.length) return finish();
      setFrame(order[i]);
      const p = i / (order.length - 1);
      setScale(0.34 + Math.pow(p, 1.6) * 0.66);
      i++;
      t = window.setTimeout(step, Math.max(42, 210 * Math.pow(1 - p, 1.7)));
    };
    step();
    return () => clearTimeout(t);
  }, [stage]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-hidden bg-ink"
      initial={{ opacity: 1 }}
      animate={stage === 'out' ? { clipPath: 'inset(0 0 100% 0)' } : { clipPath: 'inset(0 0 0% 0)' }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: stage === 'out' ? 0.15 : 0 }}
      onAnimationComplete={() => {
        if (stage !== 'out') return;
        document.documentElement.style.overflow = '';
        stopScroll(false);
        onDone();
      }}
      role="dialog"
      aria-label="Opening titles"
    >
      {stage === 'load' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <span className="tc text-[12px] text-paper/70">Opening {PROFILE.file}</span>
          <div className="h-px w-40 overflow-hidden bg-paper/10">
            <div className="h-full bg-orange transition-[width] duration-200" style={{ width: `${pct}%` }} />
          </div>
          <span className="tc text-[11px] text-paper/35">{String(pct).padStart(3, '0')}%</span>
        </div>
      )}

      {stage !== 'load' && (
        <div className="absolute inset-0 grid place-items-center">
          <div
            className="relative h-[100svh] w-screen"
            style={{ transform: `scale(${scale})`, transition: 'transform 90ms linear' }}
          >
            <img src={FRAMES[frame]} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-ink/15" />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-between px-6">
            <span className="tc text-[11px] text-paper/70">{PROFILE.name}</span>
            <span className="tc text-[11px] text-paper/70">F{String(frame + 1).padStart(3, '0')}</span>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={finish}
        className="label absolute right-5 top-5 z-10 py-1 text-paper/60 transition-colors hover:text-paper"
      >
        Skip
      </button>
    </motion.div>
  );
}
