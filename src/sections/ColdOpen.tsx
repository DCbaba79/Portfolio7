import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { FRAMES, PROFILE } from '../data/site';
import { Line } from '../components/Reveal';
import { useReducedMotion } from '../lib/hooks';
import { scrollToTarget } from '../lib/scroll';

/** Frames from the work, cut hard behind the letters of the name. */
function useCycle(active: boolean, every = 760) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setI((n) => (n + 1) % FRAMES.length), every);
    return () => clearInterval(t);
  }, [active, every]);
  return i;
}

export default function ColdOpen({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const i = useCycle(ready && visible && !reduced);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const nameY = useTransform(scrollYProgress, (v) => `${v * 18}%`);
  const fade = useTransform(scrollYProgress, (v) => 1 - Math.min(1, v * 1.6));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // One continuous picture across both lines: "cover" the combined box, offset per line
  const lineRef = useRef<HTMLSpanElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = lineRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setBox({ w: el.offsetWidth, h: el.offsetHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const bg = (line: number): React.CSSProperties => {
    if (!box.w) return {};
    const size = Math.max(box.w, box.h * 2); // frames are square
    const x = (box.w - size) / 2;
    const y = (box.h * 2 - size) / 2 - line * box.h;
    return { backgroundSize: `${size}px ${size}px`, backgroundPosition: `${x}px ${y}px, ${x}px ${y}px` };
  };

  const fill = {
    backgroundImage: `linear-gradient(rgb(243 244 246 / 0.12), rgb(243 244 246 / 0.12)), url(${FRAMES[i]})`,
  };

  return (
    <section id="open" ref={ref} className="safe-x relative flex min-h-[100svh] flex-col pb-6 pt-20 md:pt-24">
      {/* slate line */}
      <motion.div
        style={{ opacity: fade }}
        className="grid grid-cols-2 gap-y-2 border-b border-paper/10 pb-4 md:grid-cols-4"
      >
        {[
          ['Role', 'Short-form video editor'],
          ['Base', PROFILE.base],
          ['Cuts in', 'DaVinci Resolve'],
          ['Project', PROFILE.file],
        ].map(([k, v], n) => (
          <motion.div
            key={k}
            initial={{ opacity: 0 }}
            animate={{ opacity: ready ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.5 + n * 0.08 }}
            className={n > 1 ? 'hidden md:block' : ''}
          >
            <span className="label block text-paper/40">{k}</span>
            <span className="mt-1 block text-[13px] text-paper/85">{v}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* the name, with the work showing through it */}
      <motion.h1 style={{ y: nameY }} className="display relative mt-auto select-none pt-10 text-[clamp(4.6rem,24.5vw,26rem)]">
        <span className="sr-only">{PROFILE.name}</span>
        <Line play={ready}>
          <span ref={lineRef} className="through block" style={{ ...fill, ...bg(0) }} aria-hidden>Dhyan</span>
        </Line>
        <Line play={ready} delay={0.08} className="text-right">
          <span className="through block" style={{ ...fill, ...bg(1) }} aria-hidden>Salavi</span>
        </Line>
      </motion.h1>

      <div className="mt-6 grid gap-6 md:mt-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-6">
          <Line play={ready} delay={0.25} className="text-[clamp(1.9rem,4.4vw,4rem)] font-medium leading-[0.95] tracking-[-0.04em]">
            Short-form,
          </Line>
          <Line play={ready} delay={0.32} className="text-[clamp(2.1rem,4.8vw,4.4rem)] leading-[0.95]">
            <span className="accent accent-hover">cut with intent.</span>
          </Line>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 12 }}
          transition={{ duration: 1, delay: 0.55 }}
          className="max-w-md text-[15px] leading-relaxed text-paper/65 md:col-span-4 md:col-start-8"
        >
          I edit short-form across the whole range: high-energy phonk edits, talking heads, and humanless
          explainers built from nothing but type, motion and a voice.
        </motion.p>
        <motion.button
          type="button"
          onClick={() => scrollToTarget('file')}
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="label flex items-center gap-3 self-end whitespace-nowrap text-paper/60 transition-colors hover:text-paper md:col-span-2 md:justify-self-end"
        >
          <span className="relative block h-2.5 w-2.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-orange/60" />
            <span className="absolute inset-0 rounded-full bg-orange" />
          </span>
          Scroll to play
        </motion.button>
      </div>
    </section>
  );
}
