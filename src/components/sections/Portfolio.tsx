import { motion, useScroll, useTransform, MotionValue } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { PROJECTS, Project, getVideoSource } from '../../constants';
import { cn } from '../../lib/utils';
import { Link } from '../../lib/router';
import { useMediaQuery, useReducedMotion } from '../../lib/hooks';

/**
 * The exhibition. On large screens the section pins and the work travels
 * sideways like a strip of film; each project gets its own composition.
 * Below lg it becomes a vertical sequence of full-width plates.
 */

const pad = (n: number) => String(n).padStart(2, '0');

function platform(p: Project) {
  const s = getVideoSource(p.videoUrl);
  return s.kind === 'external' ? s.platform : s.kind === 'drive' ? 'Full cut' : 'Stills';
}

/** Title that spreads its tracking on hover — the type "breathes" in. */
function HoverTitle({ children, className }: { children: string; className?: string }) {
  return (
    <span className={cn('block font-display uppercase leading-[0.92] transition-[letter-spacing] duration-700 ease-out-expo group-hover:tracking-[0.02em]', className)}>
      {children}
    </span>
  );
}

function Plate({ p, className, imgClass }: { p: Project; className?: string; imgClass?: string }) {
  return (
    <div className={cn('relative overflow-hidden bg-ink-2', className)}>
      <img
        src={p.thumbnail}
        alt={`${p.title} — still`}
        loading="lazy"
        decoding="async"
        className={cn('absolute inset-0 h-full w-full object-cover grayscale-[60%] transition-[transform,filter] duration-[1.4s] ease-out-expo group-hover:scale-[1.06] group-hover:grayscale-0', imgClass)}
      />
      <div className="scanlines pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-40" />
      {/* Hard teal wipe on hover — like a transition marker */}
      <span className="pointer-events-none absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-primary/30 mix-blend-color transition-transform duration-700 ease-out-expo group-hover:scale-x-100" />
    </div>
  );
}

function Meta({ p, i, vertical }: { p: Project; i: number; vertical?: boolean }) {
  return (
    <div className={cn('flex gap-x-5 gap-y-1 font-mono text-[10px] uppercase tracking-[0.3em] text-white/55', vertical ? 'vertical flex-row' : 'flex-wrap')}>
      <span className="text-secondary">No. {pad(i + 1)}</span>
      <span>{p.category}</span>
      <span>{p.role}</span>
      <span className="text-white/35">{platform(p)}</span>
    </div>
  );
}

/* Three compositions, rotated through the projects */
function PanelA({ p, i }: { p: Project; i: number }) {
  // Landscape plate right, huge outline numeral behind, title crossing the plate's edge
  return (
    <Link to={`/work/${p.id}`} data-cursor="View" className="group relative flex h-full w-[88vw] max-w-[1400px] shrink-0 items-center" aria-label={`${p.title} — view project`}>
      <span aria-hidden className="text-outline absolute left-0 top-[4%] font-display text-[42vh] leading-none opacity-30">{pad(i + 1)}</span>
      <Plate p={p} className="ml-auto aspect-[16/10] h-[62vh]" />
      <div className="absolute bottom-[10%] left-[4%] z-10 max-w-[48%]">
        <Meta p={p} i={i} />
        <HoverTitle className="mt-4 text-[clamp(2.8rem,6vw,7rem)]">{p.title}</HoverTitle>
        <p className="mt-4 max-w-sm font-serif text-xl italic text-white/75">{p.logline}</p>
      </div>
    </Link>
  );
}

function PanelB({ p, i }: { p: Project; i: number }) {
  // Tall portrait crop left, vertical metadata, title stacked large on the right
  return (
    <Link to={`/work/${p.id}`} data-cursor="View" className="group relative flex h-full w-[72vw] max-w-[1150px] shrink-0 items-center gap-8" aria-label={`${p.title} — view project`}>
      <Meta p={p} i={i} vertical />
      <Plate p={p} className="h-[74vh] w-[34vh] shrink-0" />
      <div className="flex-1 self-end pb-[8vh]">
        <span className="font-display text-[14vh] leading-none text-secondary">{pad(i + 1)}</span>
        <HoverTitle className="mt-2 text-[clamp(2.6rem,5.5vw,6.5rem)]">{p.title}</HoverTitle>
        <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">{p.description}</p>
        <span className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/60 transition-colors group-hover:text-secondary">
          Open case <ArrowUpRight size={14} />
        </span>
      </div>
    </Link>
  );
}

function PanelC({ p, i }: { p: Project; i: number }) {
  // Square plate low, title set ABOVE and overlapping it like a magazine cover line
  return (
    <Link to={`/work/${p.id}`} data-cursor="View" className="group relative flex h-full w-[64vw] max-w-[1050px] shrink-0 flex-col justify-center" aria-label={`${p.title} — view project`}>
      <div className="relative z-10 flex items-end justify-between gap-6">
        <HoverTitle className="max-w-[80%] text-[clamp(2.6rem,5vw,6rem)] mix-blend-difference">{p.title}</HoverTitle>
        <span className="text-outline-orange font-display text-[16vh] leading-none">{pad(i + 1)}</span>
      </div>
      <div className="-mt-[3vh] flex items-end gap-8">
        <Plate p={p} className="aspect-[4/3] h-[46vh]" />
        <div className="pb-2">
          <Meta p={p} i={i} />
          <p className="mt-3 max-w-[16rem] font-serif text-lg italic text-white/70">{p.logline}</p>
        </div>
      </div>
    </Link>
  );
}

const PANELS = [PanelA, PanelB, PanelC];

function HorizontalExhibition() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    const measure = () => track.current && setDistance(track.current.scrollWidth - window.innerWidth);
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, (v) => -v * distance);

  return (
    <section id="work" ref={section} style={{ height: `calc(${distance}px + 100vh)` }} className="relative" aria-label="Selected work">
      <div className="sticky top-0 h-screen overflow-hidden">
        <ProgressRail progress={scrollYProgress} />
        <motion.div ref={track} style={{ x }} className="flex h-full items-center gap-[8vw] pl-10 pr-[12vw] will-change-transform">
          <IntroPanel />
          {PROJECTS.map((p, i) => {
            const Panel = PANELS[i % PANELS.length];
            return <Panel key={p.id} p={p} i={i} />;
          })}
          <IndexPanel />
        </motion.div>
      </div>
    </section>
  );
}

function ProgressRail({ progress }: { progress: MotionValue<number> }) {
  const scaleX = useTransform(progress, [0, 1], [0, 1]);
  return (
    <div className="absolute inset-x-10 top-24 z-20 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
      <span>Selected work</span>
      <div className="relative h-px flex-1 bg-white/10">
        <motion.div style={{ scaleX }} className="absolute inset-0 origin-left bg-secondary" />
      </div>
      <span>{pad(PROJECTS.length)} pieces</span>
    </div>
  );
}

function IntroPanel() {
  return (
    <div className="relative flex h-full w-[46vw] shrink-0 flex-col justify-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-secondary">01 — The exhibition</p>
      <h2 className="mt-6 font-display uppercase leading-[0.92]">
        <span className="block text-[17vh]">Selected</span>
        <span className="text-outline block text-[22vh]">Work</span>
      </h2>
      <p className="mt-8 max-w-sm text-white/60">
        Commercials, explainers, music and event films — each one cut with intent: pacing, color and sound working toward one story.
      </p>
      <p className="mt-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
        Keep scrolling <span className="inline-block h-px w-16 bg-white/30" /> →
      </p>
    </div>
  );
}

function IndexPanel() {
  const groups = Array.from(new Set(PROJECTS.map((p) => p.category)));
  return (
    <div className="flex h-full w-[40vw] shrink-0 flex-col justify-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-secondary">Index</p>
      <ul className="mt-6 border-t border-white/10">
        {PROJECTS.map((p, i) => (
          <li key={p.id}>
            <Link to={`/work/${p.id}`} className="group flex items-baseline justify-between gap-6 border-b border-white/10 py-3">
              <span className="flex items-baseline gap-4">
                <span className="font-mono text-[10px] text-white/40">{pad(i + 1)}</span>
                <span className="font-display text-2xl uppercase transition-colors group-hover:text-primary-glow">{p.title}</span>
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">{p.category}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-white/35">{groups.join(' · ')}</p>
    </div>
  );
}

/** Vertical sequence for tablet / phone, and for reduced motion. */
function StackedExhibition() {
  return (
    <section id="work" className="relative px-4 py-24 md:px-10" aria-label="Selected work">
      <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-secondary">01 — The exhibition</p>
      <h2 className="mt-4 font-display uppercase leading-[0.92]">
        <span className="block text-[22vw] md:text-[16vw]">Selected</span>
        <span className="text-outline block text-[28vw] md:text-[20vw]">Work</span>
      </h2>
      <div className="mt-14 space-y-20">
        {PROJECTS.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className={cn(i % 2 === 1 && 'md:pl-[16%]', i % 3 === 2 && 'md:pr-[16%] md:pl-0')}
          >
            <Link to={`/work/${p.id}`} className="group relative block" aria-label={`${p.title} — view project`}>
              <span aria-hidden className={cn('absolute -top-[0.45em] z-10 font-display text-[22vw] leading-none md:text-[14vw]', i % 2 ? 'text-outline-orange right-0' : 'text-outline left-0')}>
                {pad(i + 1)}
              </span>
              <Plate p={p} className={cn(i % 3 === 1 ? 'aspect-[4/5] md:aspect-[16/10]' : 'aspect-[4/3] md:aspect-[16/9]')} imgClass="grayscale-0" />
              <div className="relative z-10 -mt-[0.55em] px-1 font-display text-[13vw] uppercase leading-[0.92] md:text-[8vw]">{p.title}</div>
              <div className="mt-4 px-1">
                <Meta p={p} i={i} />
                <p className="mt-3 max-w-md font-serif text-lg italic text-white/70">{p.logline}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default function Portfolio() {
  const wide = useMediaQuery('(min-width: 1024px) and (min-height: 600px)');
  const reduced = useReducedMotion();
  return wide && !reduced ? <HorizontalExhibition /> : <StackedExhibition />;
}
