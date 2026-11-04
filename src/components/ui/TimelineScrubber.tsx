import { useMotionValueEvent, useScroll } from 'motion/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { scrollToTarget } from '../../lib/scroll';
import { cn } from '../../lib/utils';

/**
 * Signature interaction: the page is presented as a sequence on an edit
 * timeline. Each section is a clip, the playhead is the reader's position,
 * and the track can be clicked or dragged to scrub through the site.
 */

export const TIMELINE_SECTIONS = [
  { id: 'home', label: 'Intro' },
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'toolkit', label: 'Toolkit' },
  { id: 'contact', label: 'Contact' },
];

const RUNTIME_SECONDS = 150; // the "reel" runs 2:30
const FPS = 25;

function toTimecode(fraction: number) {
  const totalFrames = Math.round(Math.min(Math.max(fraction, 0), 1) * RUNTIME_SECONDS * FPS);
  const ff = totalFrames % FPS;
  const s = Math.floor(totalFrames / FPS);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `00:${pad(Math.floor(s / 60))}:${pad(s % 60)}:${pad(ff)}`;
}

interface Clip { id: string; label: string; start: number; end: number }

export default function TimelineScrubber() {
  const trackRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);
  const tcRef = useRef<HTMLSpanElement>(null);
  const [clips, setClips] = useState<Clip[]>([]);
  const [active, setActive] = useState('home');
  const [shown, setShown] = useState(false);
  const dragging = useRef(false);
  const { scrollY } = useScroll();

  const measure = useCallback(() => {
    const docH = document.documentElement.scrollHeight;
    const next: Clip[] = [];
    TIMELINE_SECTIONS.forEach((s, i) => {
      const el = document.getElementById(s.id);
      if (!el) return;
      const start = el.getBoundingClientRect().top + window.scrollY;
      const nextEl = TIMELINE_SECTIONS[i + 1] && document.getElementById(TIMELINE_SECTIONS[i + 1].id);
      const end = nextEl ? nextEl.getBoundingClientRect().top + window.scrollY : docH;
      next.push({ ...s, start: start / docH, end: end / docH });
    });
    setClips(next);
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    return () => ro.disconnect();
  }, [measure]);

  const update = useCallback((y: number) => {
    const docH = document.documentElement.scrollHeight;
    const f = (y + window.innerHeight / 2) / docH;
    if (playheadRef.current) playheadRef.current.style.transform = `translate3d(${f * (trackRef.current?.clientWidth ?? 0)}px,0,0)`;
    if (tcRef.current) tcRef.current.textContent = toTimecode(y / Math.max(1, docH - window.innerHeight));
    // Stay out of the way of the hero's first impression
    setShown(y > window.innerHeight * 0.5);
    const current = clips.find((c) => f >= c.start && f < c.end);
    if (current) setActive(current.id);
  }, [clips]);

  useMotionValueEvent(scrollY, 'change', update);
  useEffect(() => update(window.scrollY), [update]);

  const scrubTo = (clientX: number, immediate: boolean) => {
    const r = trackRef.current!.getBoundingClientRect();
    const f = Math.min(Math.max((clientX - r.left) / r.width, 0), 1);
    const docH = document.documentElement.scrollHeight;
    scrollToTarget(Math.max(0, f * docH - window.innerHeight / 2), { immediate });
  };

  const activeLabel = TIMELINE_SECTIONS.find((s) => s.id === active)?.label;

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 px-3 pb-3 md:px-6 md:pb-5 pointer-events-none transition-[transform,opacity] duration-700 ease-out-expo',
        shown ? 'translate-y-0 opacity-100' : 'translate-y-[130%] opacity-0'
      )}
      aria-label="Page timeline"
      aria-hidden={!shown}
    >
      <div className="pointer-events-auto mx-auto flex max-w-[1600px] items-center gap-3 md:gap-5 rounded-lg border border-white/10 bg-ink/75 px-3 py-2 backdrop-blur-md md:px-4">
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <span className="h-1.5 w-1.5 rounded-full bg-secondary rec-blink" />
          <span ref={tcRef} className="font-mono text-[11px] tabular-nums tracking-wider text-white/80">00:00:00:00</span>
        </div>

        <div
          ref={trackRef}
          data-cursor="Scrub"
          role="slider"
          aria-label="Scrub through sections"
          aria-valuetext={activeLabel}
          aria-valuenow={TIMELINE_SECTIONS.findIndex((s) => s.id === active)}
          aria-valuemin={0}
          aria-valuemax={TIMELINE_SECTIONS.length - 1}
          tabIndex={0}
          onKeyDown={(e) => {
            const i = TIMELINE_SECTIONS.findIndex((s) => s.id === active);
            if (e.key === 'ArrowRight' && i < TIMELINE_SECTIONS.length - 1) scrollToTarget(TIMELINE_SECTIONS[i + 1].id);
            if (e.key === 'ArrowLeft' && i > 0) scrollToTarget(TIMELINE_SECTIONS[i - 1].id);
          }}
          onPointerDown={(e) => {
            dragging.current = true;
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
            scrubTo(e.clientX, false);
          }}
          onPointerMove={(e) => dragging.current && scrubTo(e.clientX, true)}
          onPointerUp={() => (dragging.current = false)}
          onPointerCancel={() => (dragging.current = false)}
          className="relative h-7 flex-1 touch-none select-none"
        >
          {clips.map((c, i) => (
            <div
              key={c.id}
              className={cn(
                'absolute top-1 bottom-1 overflow-hidden rounded-[3px] border transition-colors duration-500',
                i % 2 === 0 ? 'border-primary/40 bg-primary/15' : 'border-secondary/40 bg-secondary/12',
                active === c.id && (i % 2 === 0 ? 'bg-primary/45 border-primary' : 'bg-secondary/40 border-secondary')
              )}
              style={{ left: `calc(${c.start * 100}% + 1px)`, width: `calc(${(c.end - c.start) * 100}% - 2px)` }}
            >
              <span className="absolute left-1.5 top-1/2 -translate-y-1/2 hidden md:block whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.2em] text-white/70">
                {c.label}
              </span>
            </div>
          ))}
          <div ref={playheadRef} className="absolute -top-1 -bottom-1 left-0 w-px bg-white will-change-transform">
            <span className="absolute -top-1 left-1/2 -translate-x-1/2 border-x-[5px] border-t-[6px] border-x-transparent border-t-white" />
          </div>
        </div>

        <span className="w-20 shrink-0 text-right font-mono text-[10px] uppercase tracking-[0.25em] text-white/60">
          {activeLabel}
        </span>
      </div>
    </div>
  );
}
