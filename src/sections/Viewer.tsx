import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { PROJECTS } from '../data/site';
import { useRouter } from '../lib/router';
import { useFinePointer, useReducedMotion } from '../lib/hooks';
import { cn } from '../lib/utils';

const FPS = 30;
const tc = (s: number) => {
  const f = Math.floor(s * FPS);
  const p = (n: number) => String(n).padStart(2, '0');
  return `00:${p(Math.floor(f / FPS / 60))}:${p(Math.floor(f / FPS) % 60)}:${p(f % FPS)}`;
};

/**
 * The Viewer — the signature interaction.
 * Every project sits in one full-screen source monitor. Pick a clip from the
 * index and the footage cuts in; move across the frame and your pointer
 * becomes the playhead, scrubbing the footage frame by frame. Click to open.
 */
export default function Viewer() {
  const { navigate } = useRouter();
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const vids = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [near, setNear] = useState(false);
  const [scrubbing, setScrubbing] = useState(false);
  const [head, setHead] = useState(0); // 0..1
  const [time, setTime] = useState(0);
  const [cut, setCut] = useState(0); // bumps on every cut, drives the glitch
  const drag = useRef(false);
  const p = PROJECTS[active];

  // Start loading the footage once the viewer is close
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: '400px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Only the active clip runs, and only when not being scrubbed
  useEffect(() => {
    vids.current.forEach((v, i) => {
      if (!v) return;
      if (i === active && near && !scrubbing) v.play().catch(() => {});
      else v.pause();
    });
  }, [active, near, scrubbing]);

  // Report playhead position while the clip plays on its own
  useEffect(() => {
    if (scrubbing) return;
    let raf = 0;
    const tick = () => {
      const v = vids.current[active];
      if (v && v.duration) {
        setHead(v.currentTime / v.duration);
        setTime(v.currentTime);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, scrubbing]);

  // The cut: a short horizontal tear that settles, like a bad splice
  const disp = useRef<SVGFEDisplacementMapElement>(null);
  const [glitching, setGlitching] = useState(false);
  useEffect(() => {
    if (!cut || reduced) return;
    setGlitching(true);
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      const t = Math.min(1, (performance.now() - start) / 380);
      disp.current?.setAttribute('scale', String(120 * Math.pow(1 - t, 2.4)));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setGlitching(false);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [cut, reduced]);

  const pick = (i: number) => {
    if (i === active) return;
    setActive(i);
    setCut((c) => c + 1);
  };

  const scrubTo = (clientX: number) => {
    const el = stage.current;
    const v = vids.current[active];
    if (!el) return;
    const r = el.getBoundingClientRect();
    const t = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    setHead(t);
    if (v && v.duration) {
      v.currentTime = t * v.duration;
      setTime(v.currentTime);
    }
  };

  const onKey = (e: React.KeyboardEvent) => {
    const v = vids.current[active];
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      if (v && v.duration) {
        v.pause();
        setScrubbing(true);
        v.currentTime = Math.min(v.duration, Math.max(0, v.currentTime + (e.key === 'ArrowRight' ? 1 / FPS : -1 / FPS) * (e.shiftKey ? 10 : 1)));
        setHead(v.currentTime / v.duration);
        setTime(v.currentTime);
      }
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      pick((active + (e.key === 'ArrowDown' ? 1 : PROJECTS.length - 1)) % PROJECTS.length);
    } else if (e.key === 'Enter') {
      navigate(`/work/${p.id}`);
    }
  };

  return (
    <section id="index" className="relative">
      {/* displacement used for the cut between clips */}
      <svg className="absolute h-0 w-0" aria-hidden>
        <filter id="viewer-cut">
          <feTurbulence type="fractalNoise" baseFrequency="0.004 0.6" numOctaves="1" seed={cut} />
          <feDisplacementMap ref={disp} in="SourceGraphic" scale={0} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <div className="safe-x flex items-center justify-between border-b border-paper/10 pb-4 pt-24 md:pt-28">
        <span className="label text-paper/45">04 — The viewer</span>
        <span className="label text-paper/45">{PROJECTS.length} clips · {fine ? 'move to scrub' : 'drag to scrub'}</span>
      </div>

      <div className="relative grid min-h-[100svh] lg:grid-cols-12">
        {/* the index */}
        <ol className="safe-x relative z-20 order-2 flex flex-col justify-center gap-1 py-10 lg:order-1 lg:col-span-4 lg:py-16" aria-label="Project index">
          {PROJECTS.map((item, i) => (
            <li key={item.id}>
              <button
                type="button"
                onMouseEnter={() => fine && pick(i)}
                onFocus={() => pick(i)}
                onClick={() => (i === active ? navigate(`/work/${item.id}`) : pick(i))}
                aria-current={i === active ? 'true' : undefined}
                data-cursor={i === active ? 'Open' : undefined}
                className="group grid w-full grid-cols-[2.5rem_1fr] items-baseline gap-3 py-2 text-left"
              >
                <span className={cn('tc text-[11px] transition-colors', i === active ? 'text-orange' : 'text-paper/30')}>
                  {String(i + 1).padStart(3, '0')}
                </span>
                <span>
                  <span
                    className={cn(
                      'block text-[clamp(1.6rem,2.8vw,2.9rem)] font-semibold leading-[1] tracking-[-0.045em] transition-[color,transform] duration-500 ease-[cubic-bezier(.16,1,.3,1)]',
                      i === active ? 'translate-x-2 text-paper' : 'text-paper/25 group-hover:text-paper/60'
                    )}
                  >
                    {item.short}
                  </span>
                  <span
                    className={cn(
                      'label mt-1 block overflow-hidden transition-all duration-500',
                      i === active ? 'max-h-6 text-paper/50 opacity-100' : 'max-h-0 opacity-0'
                    )}
                  >
                    {item.category}{item.year ? ` · ${item.year}` : ''}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ol>

        {/* the source monitor */}
        <div className="relative order-1 lg:order-2 lg:col-span-8">
          <div
            ref={stage}
            tabIndex={0}
            role="slider"
            aria-label={`Scrub ${p.title}. Arrow keys step frames, up and down change clip, Enter opens.`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(head * 100)}
            aria-valuetext={tc(time)}
            onKeyDown={onKey}
            onPointerEnter={(e) => { if (e.pointerType === 'mouse') setScrubbing(true); }}
            onPointerMove={(e) => { if (e.pointerType === 'mouse' || drag.current) scrubTo(e.clientX); }}
            onPointerLeave={(e) => { if (e.pointerType === 'mouse') setScrubbing(false); }}
            onPointerDown={(e) => {
              if (e.pointerType !== 'mouse') {
                drag.current = true;
                setScrubbing(true);
              }
            }}
            onPointerUp={(e) => {
              if (e.pointerType !== 'mouse') {
                drag.current = false;
                setScrubbing(false);
              }
            }}
            onClick={(e) => { if (fine && (e.target as HTMLElement).tagName !== 'A') navigate(`/work/${p.id}`); }}
            data-cursor={fine ? 'Scrub · click to open' : undefined}
            className="group relative h-[62svh] touch-pan-y overflow-hidden bg-ink-3 outline-none lg:h-[100svh]"
          >
            <div className="absolute inset-0" style={{ filter: glitching ? 'url(#viewer-cut)' : undefined }}>
              {PROJECTS.map((item, i) =>
                item.loop ? (
                  <video
                    key={item.id}
                    ref={(el) => { vids.current[i] = el; }}
                    src={near ? item.loop : undefined}
                    poster={item.poster}
                    muted
                    loop
                    playsInline
                    preload={near ? 'auto' : 'none'}
                    aria-hidden
                    className={cn('absolute inset-0 h-full w-full object-cover', i === active ? 'opacity-100' : 'opacity-0')}
                  />
                ) : (
                  <img
                    key={item.id}
                    ref={() => { vids.current[i] = null; }}
                    src={item.poster}
                    alt=""
                    loading="lazy"
                    className={cn('absolute inset-0 h-full w-full object-cover', i === active ? 'opacity-100' : 'opacity-0')}
                  />
                )
              )}
            </div>

            {/* grading + safe frame */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-ink/40" />
            <div className="pointer-events-none absolute inset-6 rounded-[3px] border border-paper/10 md:inset-10" />

            {/* title card, cuts with the clip */}
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={p.id}
                className="pointer-events-none absolute left-6 top-6 md:left-10 md:top-10"
                initial={{ clipPath: 'inset(0 100% 0 0)' }}
                animate={{ clipPath: 'inset(0 0% 0 0)' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
              >
                <span className="tc block bg-ink/70 px-2 py-1 text-[11px] text-paper/80">
                  {p.client} · {p.format}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* the big name of the current clip */}
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.h3
                key={p.id}
                className="pointer-events-none absolute bottom-24 left-6 right-6 text-[clamp(2.6rem,7vw,7.5rem)] font-semibold leading-[0.85] tracking-[-0.055em] md:bottom-28 md:left-10"
                initial={{ y: '40%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                exit={{ y: '-30%', opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                {p.short}
              </motion.h3>
            </AnimatePresence>

            {/* timeline ruler + playhead */}
            <div className="pointer-events-none absolute inset-x-6 bottom-8 md:inset-x-10 md:bottom-12">
              <div className="flex items-end justify-between">
                <span className="tc text-[12px] text-paper">{p.loop ? tc(time) : 'STILL'}</span>
                <span className={cn('label transition-colors', scrubbing ? 'text-orange' : 'text-paper/50')}>
                  {p.loop ? (scrubbing ? '● Scrubbing' : '▶ Playing') : 'No preview'}
                </span>
              </div>
              <div className="relative mt-3 h-4">
                {Array.from({ length: 41 }, (_, i) => (
                  <span
                    key={i}
                    className={cn('absolute bottom-0 w-px bg-paper/30', i % 5 === 0 ? 'h-3' : 'h-1.5')}
                    style={{ left: `${(i / 40) * 100}%` }}
                  />
                ))}
                <span
                  className="absolute -bottom-1 top-[-6px] w-[2px] bg-orange shadow-[0_0_14px_rgba(249,115,22,0.9)]"
                  style={{ left: `calc(${head * 100}% - 1px)` }}
                />
              </div>
            </div>

            {!fine && (
              <a
                href={`/work/${p.id}`}
                onClick={(e) => { e.preventDefault(); navigate(`/work/${p.id}`); }}
                className="label absolute right-6 top-6 bg-paper px-3 py-2 text-ink"
              >
                Open →
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
