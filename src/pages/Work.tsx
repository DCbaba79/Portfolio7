import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { PROJECTS, getProject, type Project } from '../data/site';
import { toTimecode } from '../components/Chrome';
import Clip, { SpeakerIcon } from '../components/Clip';
import { Fade, Line } from '../components/Reveal';
import { MetaGrid, Process } from '../components/Facts';
import { Link } from '../lib/router';
import { cn } from '../lib/utils';

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

/** A quiet viewer: click to play, scrub, sound. Native semantics kept underneath. */
function Viewer({ p }: { p: Project }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [t, setT] = useState(0);
  const [d, setD] = useState(0);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    v.paused ? v.play().catch(() => {}) : v.pause();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input, textarea')) return;
      if (e.key === 'k' || (e.key === ' ' && document.activeElement === document.body)) {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const vertical = p.aspect === '9/16';
  const square = p.aspect === '1/1';

  return (
    <div className={cn('mx-auto', vertical ? 'max-w-[min(420px,72svh*9/16)]' : square ? 'max-w-[min(760px,78svh)]' : 'max-w-6xl')}>
      <div className={vertical ? 'frame-reel' : undefined}>
      <div className={cn('group relative overflow-hidden bg-ink-3', !vertical && (square ? 'frame' : 'frame-cine'))}>
        <video
          ref={ref}
          src={p.film}
          poster={p.poster}
          playsInline
          preload="metadata"
          muted={muted}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={(e) => setT(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setD(e.currentTarget.duration)}
          onClick={toggle}
          aria-label={p.title}
          className={cn('block w-full cursor-pointer', vertical ? 'aspect-[9/16]' : square ? 'aspect-square' : 'aspect-video', 'object-cover')}
        />
        {!playing && (
          <button
            type="button"
            onClick={toggle}
            className="absolute inset-0 grid place-items-center bg-ink/30 transition-colors hover:bg-ink/10"
            aria-label={`Play ${p.title}`}
          >
            <span className="grid h-20 w-20 place-items-center rounded-full border border-paper/40 bg-ink/40 backdrop-blur-sm transition-transform duration-500 group-hover:scale-110 md:h-24 md:w-24">
              <svg width="20" height="22" viewBox="0 0 20 22" aria-hidden><path d="M0 0l20 11L0 22z" fill="currentColor" /></svg>
            </span>
          </button>
        )}
      </div>
      </div>
      <div className="mt-3 flex items-center gap-4">
        <button type="button" onClick={toggle} className="label w-14 py-1 text-left text-paper/70 hover:text-paper">
          {playing ? 'Pause' : 'Play'}
        </button>
        <input
          type="range"
          min={0}
          max={d || 0}
          step={0.01}
          value={t}
          onChange={(e) => {
            const v = ref.current;
            if (v) v.currentTime = Number(e.target.value);
          }}
          aria-label="Seek"
          className="h-6 flex-1 cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-[2px] [&::-moz-range-thumb]:rounded-none [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-orange [&::-moz-range-track]:h-px [&::-moz-range-track]:bg-paper/25 [&::-webkit-slider-runnable-track]:h-px [&::-webkit-slider-runnable-track]:bg-paper/25 [&::-webkit-slider-thumb]:-mt-[6px] [&::-webkit-slider-thumb]:h-[13px] [&::-webkit-slider-thumb]:w-[2px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-orange"
          style={{ backgroundImage: `linear-gradient(to right, var(--color-orange) ${d ? (t / d) * 100 : 0}%, transparent 0)`, backgroundSize: '100% 1px', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
        />
        <span className="tc w-24 text-right text-[11px] text-paper/50">
          {fmt(t)} / {fmt(d)}
        </span>
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? 'Unmute' : 'Mute'}
          aria-pressed={!muted}
          className="grid h-8 w-8 place-items-center text-paper/70 hover:text-paper"
        >
          <SpeakerIcon muted={muted} />
        </button>
      </div>
    </div>
  );
}

export default function Work({ id }: { id: string }) {
  const p = getProject(id);
  if (!p) {
    return (
      <main className="safe-x flex min-h-[100svh] flex-col items-start justify-center gap-6">
        <span className="tc text-[12px] text-paper/50">Media offline</span>
        <h1 className="text-[clamp(2.4rem,6vw,5rem)] font-semibold tracking-[-0.04em]">This clip isn’t in the bin.</h1>
        <Link to="/" className="accent text-2xl">Back to the timeline →</Link>
      </main>
    );
  }

  const idx = PROJECTS.indexOf(p);
  const next = PROJECTS[(idx + 1) % PROJECTS.length];

  return (
    <main className="pb-10 pt-24 md:pt-28">
      <header className="safe-x">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-paper/10 pb-4">
          <span className="label text-paper/45">
            Clip {String(idx + 1).padStart(3, '0')} · {p.category}
          </span>
          <span className="label text-paper/45">{p.year ?? ''}</span>
        </div>
        <h1 className="mt-10 max-w-6xl text-[clamp(2.8rem,8vw,8.5rem)] font-semibold leading-[0.88] tracking-[-0.055em] md:mt-14">
          <Line play>{p.short}</Line>
          <Line play delay={0.08} className="mt-3 text-[0.4em] leading-tight tracking-[-0.01em]">
            <span className="accent">{p.client}</span>
          </Line>
        </h1>
      </header>

      <motion.section
        className="safe-x mt-12 md:mt-16"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
        aria-label="Film"
      >
        {p.film ? (
          <Viewer p={p} />
        ) : p.loop ? (
          <div className="mx-auto max-w-6xl">
            {p.aspect === '9/16' ? (
              <div className="frame-reel mx-auto max-w-sm">
                <Clip src={p.loop} poster={p.poster} label={`${p.title} preview`} className="aspect-[9/16] w-full" />
              </div>
            ) : (
              <Clip src={p.loop} poster={p.poster} label={`${p.title} preview`} className="frame-cine aspect-video" />
            )}
            <p className="mt-3 text-[13px] text-paper/50">8-second preview. The full cut is linked below.</p>
          </div>
        ) : (
          <div className="frame-cine mx-auto max-w-6xl">
            <img src={p.poster} alt={`Still from ${p.title}`} className="aspect-video w-full object-cover" />
          </div>
        )}
      </motion.section>

      <section className="safe-x mt-20 grid gap-14 md:mt-28 md:grid-cols-12">
        <Fade className="md:col-span-6">
          <p className="label mb-4 text-orange">Brief</p>
          <p className="text-[clamp(1.35rem,2.4vw,2.1rem)] leading-[1.18] tracking-[-0.025em]">{p.brief}</p>
          {p.outcome && (
            <>
              <p className="label mb-3 mt-12 text-teal-3">Where it landed</p>
              <p className="max-w-lg text-[15px] leading-relaxed text-paper/70">{p.outcome}</p>
            </>
          )}
        </Fade>
        <Fade className="md:col-span-3 md:col-start-7" delay={0.1}>
          <p className="label mb-4 text-paper/40">Process</p>
          <Process steps={p.process} />
        </Fade>
        <Fade className="md:col-span-3 md:col-start-10" delay={0.2}>
          <MetaGrid p={p} />
          <ul className="mt-8 space-y-3">
            {p.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noreferrer" className="text-[14px] text-paper/80 underline decoration-paper/30 underline-offset-4 transition-colors hover:text-orange hover:decoration-orange">
                  {l.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </Fade>
      </section>

      {/* next clip */}
      <Link to={`/work/${next.id}`} className="group safe-x mt-32 block border-t border-paper/10 pt-8 md:mt-44">
        <span className="label text-paper/45">Next clip · {toTimecode((idx + 1) * 2400)}</span>
        <span className="mt-4 flex items-end justify-between gap-6">
          <span className="text-[clamp(2.6rem,9vw,9rem)] font-semibold leading-[0.85] tracking-[-0.055em] transition-colors duration-500 group-hover:text-orange">
            {next.short}
          </span>
          <span className="accent mb-2 text-[clamp(1.6rem,4vw,3.5rem)] transition-transform duration-500 group-hover:translate-x-2">→</span>
        </span>
      </Link>
    </main>
  );
}
