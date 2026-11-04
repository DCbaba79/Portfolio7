import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MARKERS, PROFILE } from '../data/site';
import { Link, useRouter } from '../lib/router';
import { scrollToTarget, stopScroll } from '../lib/scroll';
import { cn } from '../lib/utils';

const FPS = 24;
/** One frame of "session time" per 3px scrolled. */
export function toTimecode(px: number) {
  const frames = Math.max(0, Math.floor(px / 3));
  const ff = frames % FPS;
  const s = Math.floor(frames / FPS);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(Math.floor(s / 3600))}:${p(Math.floor(s / 60) % 60)}:${p(s % 60)}:${p(ff)}`;
}

const toneClass = { teal: 'bg-teal-3', orange: 'bg-orange', paper: 'bg-paper' } as const;

function useActiveMarker(enabled: boolean) {
  const [active, setActive] = useState<string>(MARKERS[0].id);
  useEffect(() => {
    if (!enabled) return;
    const els = MARKERS.map((m) => document.getElementById(m.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [enabled]);
  return active;
}

/** Fixed interface: wordmark, live timecode, chapter-marker rail. */
export default function Chrome() {
  const { path } = useRouter();
  const home = path === '/';
  const tcRef = useRef<HTMLSpanElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<Record<string, number>>({});
  const [open, setOpen] = useState(false);
  const active = useActiveMarker(home);

  // Timecode and playhead, written straight to the DOM every frame that scrolls
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const y = window.scrollY;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      if (tcRef.current) tcRef.current.textContent = toTimecode(y);
      if (headRef.current) headRef.current.style.transform = `translateY(${(y / max) * 100}cqh)`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [path]);

  // Where each marker sits on the rail, proportional to the page
  useEffect(() => {
    if (!home) return;
    const measure = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const next: Record<string, number> = {};
      MARKERS.forEach((m) => {
        const el = document.getElementById(m.id);
        if (el) next[m.id] = Math.min(1, (el.getBoundingClientRect().top + window.scrollY) / max);
      });
      setPositions(next);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    return () => ro.disconnect();
  }, [home]);

  useEffect(() => {
    stopScroll(open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    requestAnimationFrame(() => scrollToTarget(id));
  };

  const activeLabel = MARKERS.find((m) => m.id === active)?.label;

  return (
    <>
      <header className="safe-x pointer-events-none fixed inset-x-0 top-0 z-[80] flex items-start justify-between pt-4 mix-blend-difference md:pt-6">
        <Link
          to="/"
          onClick={() => home && scrollToTarget(0)}
          className="pointer-events-auto flex items-baseline gap-2 text-paper"
          aria-label="Dhyan Salavi, back to start"
        >
          <span className="text-[15px] font-semibold tracking-[-0.02em]">{PROFILE.alias}</span>
          <span className="tc text-[11px] text-paper/60">.drp</span>
        </Link>

        <div className="flex items-start gap-4 md:gap-8">
          <div className="hidden text-right sm:block">
            <span ref={tcRef} className="tc block text-[12px] text-paper" aria-hidden>00:00:00:00</span>
            <span className="label mt-1 block text-paper/50">
              {home ? activeLabel : 'Viewer'}
            </span>
          </div>
          {home ? (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="pointer-events-auto label flex items-center gap-2 py-1 text-paper xl:hidden"
              aria-haspopup="dialog"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-paper" /> Markers
            </button>
          ) : (
            <Link to="/#selects" className="pointer-events-auto label py-1 text-paper">
              ← Timeline
            </Link>
          )}
        </div>
      </header>

      {/* Desktop marker rail */}
      {home && (
        <nav
          aria-label="Chapters"
          className="fixed left-6 top-1/2 z-[70] hidden h-[56vh] -translate-y-1/2 xl:block"
          style={{ containerType: 'size' } as React.CSSProperties}
        >
          <div className="absolute left-[5px] top-0 h-full w-px bg-paper/15" />
          <div ref={headRef} className="absolute left-0 top-0 w-[11px] will-change-transform">
            <div className="h-px w-full -translate-y-1/2 bg-orange shadow-[0_0_12px_rgba(249,115,22,0.8)]" />
          </div>
          {MARKERS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => go(m.id)}
              className="group absolute left-0 flex -translate-y-1/2 items-center gap-3"
              style={{ top: `${(positions[m.id] ?? 0) * 100}%` }}
              aria-current={active === m.id ? 'true' : undefined}
            >
              <span
                className={cn(
                  'block h-[7px] w-[11px] transition-transform duration-300 [clip-path:polygon(0_0,100%_0,100%_60%,50%_100%,0_60%)]',
                  toneClass[m.tone],
                  active === m.id ? 'scale-125' : 'opacity-50 group-hover:opacity-100'
                )}
              />
              <span
                className={cn(
                  'label whitespace-nowrap text-paper transition-all duration-300',
                  '-translate-x-1 bg-ink/85 px-1.5 py-0.5 opacity-0 group-hover:translate-x-0 group-hover:opacity-90 group-focus-visible:translate-x-0 group-focus-visible:opacity-90'
                )}
              >
                {m.label}
              </span>
            </button>
          ))}
        </nav>
      )}

      {/* Small-screen marker list */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Chapters"
            className="safe-x fixed inset-0 z-[95] flex flex-col bg-ink pt-5"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(100% 0 0 0)' }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="flex items-center justify-between">
              <span className="label text-paper/50">Markers · {MARKERS.length}</span>
              <button type="button" onClick={() => setOpen(false)} className="label py-1 text-paper" autoFocus>
                Close
              </button>
            </div>
            <ol className="mt-10 flex flex-1 flex-col justify-center gap-1 pb-10">
              {MARKERS.map((m, i) => (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => go(m.id)}
                    className="flex w-full items-baseline gap-4 border-b border-paper/10 py-3 text-left"
                  >
                    <span className={cn('h-2 w-2 shrink-0 self-center', toneClass[m.tone])} />
                    <span className="tc text-[11px] text-paper/40">{String(i).padStart(2, '0')}</span>
                    <span className={cn('text-[clamp(1.8rem,8vw,3rem)] font-semibold leading-none tracking-[-0.04em]', active === m.id && 'accent')}>
                      {m.label}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
