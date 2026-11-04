import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { FRAMES, PROFILE } from '../data/site';
import { stopScroll } from '../lib/scroll';

/** Short hold so the loader reads even when everything is cached. */
const MIN_LOAD_MS = 700;
const GLYPHS = '0123456789:/#.ABCDEFGHJKLMNPRSTUVXYZ';
const NAME = 'DHYAN SALAVI';

/** Plays on every load of the home page; only skipped for reduced-motion users. */
export function shouldPlayTitles() {
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function preload(srcs: string[], onEach: () => void, timeout = 3500) {
  return Promise.race([
    Promise.all(
      srcs.map(
        (s) =>
          new Promise<void>((res) => {
            const img = new Image();
            img.onload = img.onerror = () => { onEach(); res(); };
            img.src = s;
          })
      )
    ),
    new Promise<void>((res) => setTimeout(res, timeout)),
  ]);
}

/** Characters resolve one by one out of timecode noise. */
function useScramble(target: string, run: boolean, duration = 900) {
  const [text, setText] = useState(() => target.replace(/\S/g, ' '));
  useEffect(() => {
    if (!run) return;
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      const t = (performance.now() - start) / duration;
      let out = '';
      for (let i = 0; i < target.length; i++) {
        const c = target[i];
        if (c === ' ') { out += ' '; continue; }
        const lockAt = 0.15 + (i / target.length) * 0.75;
        out += t >= lockAt ? c : t > lockAt - 0.35 ? GLYPHS[(Math.random() * GLYPHS.length) | 0] : ' ';
      }
      setText(out);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setText(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target, duration]);
  return text;
}

type Stage = 'load' | 'credit' | 'flip' | 'hold' | 'out';

/**
 * Opening titles, about 3.5 seconds:
 * the project opens → a credit card types itself out of timecode noise →
 * footage starts cutting inside the letters, faster and faster →
 * a hard cut to black → the letterbox bars part to reveal the site.
 */
export default function TitleSequence({ onDone }: { onDone: () => void }) {
  const [stage, setStage] = useState<Stage>('load');
  const [pct, setPct] = useState(0);
  const [frame, setFrame] = useState(0);
  const done = useRef(false);
  const name = useScramble(NAME, stage !== 'load');

  const finish = () => {
    if (done.current) return;
    done.current = true;
    setStage('out');
  };

  useEffect(() => {
    stopScroll(true);
    document.documentElement.style.overflow = 'hidden';
    let alive = true;
    let n = 0;
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      const timed = Math.min(1, (performance.now() - start) / MIN_LOAD_MS);
      setPct(Math.round(Math.min(timed, n / FRAMES.length) * 100));
      if (alive && stage === 'load') raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    Promise.all([preload(FRAMES, () => n++), new Promise((r) => setTimeout(r, MIN_LOAD_MS))]).then(() => {
      if (!alive || done.current) return;
      cancelAnimationFrame(raf);
      setStage('credit');
    });
    const onKey = (e: KeyboardEvent) => ['Escape', 'Enter', ' '].includes(e.key) && finish();
    window.addEventListener('keydown', onKey);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // credit → flip → hold(black) → out
  useEffect(() => {
    if (stage === 'credit') {
      const t = setTimeout(() => !done.current && setStage('flip'), 1050);
      return () => clearTimeout(t);
    }
    if (stage === 'flip') {
      const order = [...FRAMES.keys()].sort(() => Math.random() - 0.5).slice(0, 16);
      let i = 0;
      let t: number;
      const step = () => {
        if (done.current) return;
        if (i >= order.length) {
          setStage('hold');
          return;
        }
        setFrame(order[i]);
        const p = i / (order.length - 1);
        i++;
        t = window.setTimeout(step, Math.max(45, 170 * Math.pow(1 - p, 1.8)));
      };
      step();
      return () => clearTimeout(t);
    }
    if (stage === 'hold') {
      const t = setTimeout(finish, 260);
      return () => clearTimeout(t);
    }
  }, [stage]);

  const flipping = stage === 'flip';
  const out = stage === 'out';
  const bar = { duration: 1, ease: [0.76, 0, 0.24, 1] as const };

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-label="Opening titles">
      {/* letterbox halves: they part to reveal the site */}
      <motion.div
        className="absolute inset-x-0 top-0 h-1/2 bg-ink"
        animate={{ y: out ? '-100%' : '0%' }}
        transition={bar}
        onAnimationComplete={() => {
          if (!out) return;
          document.documentElement.style.overflow = '';
          stopScroll(false);
          onDone();
        }}
      />
      <motion.div className="absolute inset-x-0 bottom-0 h-1/2 bg-ink" animate={{ y: out ? '100%' : '0%' }} transition={bar} />

      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center"
        animate={{ opacity: out || stage === 'hold' ? 0 : 1 }}
        transition={{ duration: out ? 0.2 : 0.08 }}
      >
        {stage === 'load' ? (
          <div className="flex flex-col items-center gap-4">
            <span className="tc text-[12px] text-paper/70">Opening {PROFILE.file}</span>
            <div className="h-px w-40 overflow-hidden bg-paper/10">
              <div className="h-full bg-orange" style={{ width: `${pct}%` }} />
            </div>
          </div>
        ) : (
          <>
            <motion.span
              className="label mb-6 text-paper/55"
              initial={{ opacity: 0, letterSpacing: '0.6em' }}
              animate={{ opacity: 1, letterSpacing: '0.24em' }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              A {PROFILE.file} production
            </motion.span>
            <h2
              className="display whitespace-pre px-4 text-center text-[clamp(3.6rem,15vw,15rem)]"
              style={
                flipping
                  ? {
                      backgroundImage: `url(${FRAMES[frame]})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      color: 'transparent',
                      WebkitTextFillColor: 'transparent',
                    }
                  : { color: 'var(--color-paper)' }
              }
            >
              {name.slice(0, 5)}
              {'\n'}
              {name.slice(6)}
            </h2>
            <motion.span
              className="tc mt-6 text-[12px] text-orange"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Short-form video editor
            </motion.span>
          </>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-between px-6">
          <span className="tc text-[11px] text-paper/40">REC ●</span>
          <span className="tc text-[11px] text-paper/40">{flipping ? `F${String(frame + 1).padStart(3, '0')}` : '00:00:00:00'}</span>
        </div>
      </motion.div>

      <button
        type="button"
        onClick={finish}
        className="label absolute right-5 top-5 z-10 py-1 text-paper/60 transition-colors hover:text-paper"
      >
        Skip intro
      </button>
    </div>
  );
}
