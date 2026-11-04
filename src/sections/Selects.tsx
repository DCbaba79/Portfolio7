import React, { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { getProject } from '../data/site';
import Clip from '../components/Clip';
import { OpenCut } from '../components/Facts';
import { useMediaQuery } from '../lib/hooks';
import { cn } from '../lib/utils';

const nh7 = getProject('nh7-weekender')!;
const autopsy = getProject('startup-autopsy')!;
const ren = getProject('renaissance')!;

/** Panel-local progress: -1 (entering from right) → 0 (centred) → 1 (leaving left). */
type Local = MotionValue<number>;

/** Layered drift: each layer moves at its own speed as the panel passes. */
function Layer({ local, amount, className, children }: { local?: Local; amount: number; className?: string; children: React.ReactNode }) {
  if (!local) return <div className={className}>{children}</div>;
  return <LayerMotion local={local} amount={amount} className={className}>{children}</LayerMotion>;
}
function LayerMotion({ local, amount, className, children }: { local: Local; amount: number; className?: string; children: React.ReactNode }) {
  const x = useTransform(local, (v) => `${v * amount}vw`);
  return <motion.div style={{ x }} className={className}>{children}</motion.div>;
}

function Tag({ n, kind }: { n: number; kind: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="tc text-[11px] text-orange">SELECT {String(n).padStart(2, '0')}/03</span>
      <span className="h-px w-8 bg-paper/20" />
      <span className="label text-paper/45">{kind}</span>
    </div>
  );
}

function Meta({ items }: { items: [string, string | undefined][] }) {
  return (
    <dl className="flex flex-wrap gap-x-8 gap-y-3">
      {items.filter(([, v]) => v).map(([k, v]) => (
        <div key={k}>
          <dt className="label text-paper/40">{k}</dt>
          <dd className="mt-1 text-[13.5px] text-paper/85">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ——— 01 · NH7: footage owns the frame, the brief wraps around it ——— */
function PanelNH7({ local }: { local?: Local }) {
  return (
    <div className="relative flex h-full flex-col justify-center gap-6 lg:block">
      <Layer local={local} amount={-6} className="relative z-10 lg:absolute lg:left-0 lg:top-[14vh]">
        <Tag n={1} kind={nh7.category} />
        <h3 className="display mt-6 text-[clamp(3rem,min(8vw,14vh),10rem)]">Make<br />something</h3>
      </Layer>
      <Layer local={local} amount={4} className="relative lg:absolute lg:right-0 lg:top-1/2 lg:w-[58vw] lg:-translate-y-1/2">
        <Clip src={nh7.loop!} poster={nh7.poster} label={`${nh7.title} preview`} className="aspect-video w-full" />
        <span className="accent pointer-events-none absolute -bottom-[0.35em] right-[-0.05em] text-[clamp(4rem,min(10vw,17vh),12rem)] leading-none">crazy.</span>
      </Layer>
      <Layer local={local} amount={-12} className="relative z-10 mt-10 max-w-sm lg:absolute lg:bottom-[9vh] lg:left-0 lg:mt-0 lg:max-w-[30vw]">
        <p className="text-[15px] leading-relaxed text-paper/70">
          Three drives of raw footage from Aditya Gadhvi’s set at NH7 Weekender, Pune, and one instruction:
          <span className="accent"> “make something crazy.”</span>
        </p>
        <Meta items={[['Client', 'GROW'], ['Year', nh7.year], ['Role', nh7.role]]} />
        <OpenCut p={nh7} className="mt-6" />
      </Layer>
    </div>
  );
}

/* ——— 02 · Startup Autopsy: the case file ——— */
function PanelAutopsy({ local }: { local?: Local }) {
  const findings: [string, string][] = [
    ['Subject', 'Byju’s'],
    ['Peak valuation', '$22 billion'],
    ['Losses', '₹8,000 crore +'],
    ['On camera', 'No one'],
  ];
  return (
    <div className="grid h-full items-center gap-10 lg:grid-cols-12">
      <Layer local={local} amount={5} className="relative lg:col-span-5">
        <Clip src={autopsy.loop!} poster={autopsy.poster} label={`${autopsy.title} preview`} className="aspect-square w-full lg:max-h-[72vh] lg:w-auto" />
        <span className="tc pointer-events-none absolute -left-2 -top-3 rotate-[-4deg] border border-orange bg-ink px-2 py-1 text-[11px] text-orange">
          CASE 002 · V-NEST
        </span>
      </Layer>
      <Layer local={local} amount={-8} className="lg:col-span-6 lg:col-start-7">
        <Tag n={2} kind={autopsy.category} />
        <h3 className="mt-6 text-[clamp(3rem,min(6.5vw,12vh),8rem)] font-semibold leading-[0.85] tracking-[-0.055em]">
          Startup<br /><span className="accent">Autopsy.</span>
        </h3>
        <dl className="mt-8 border-t border-paper/15">
          {findings.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[9rem_1fr] gap-4 border-b border-paper/10 py-2.5">
              <dt className="tc text-[11px] uppercase tracking-[0.1em] text-paper/40">{k}</dt>
              <dd className="text-[15px]">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 max-w-md text-[14px] leading-relaxed text-paper/60">
          Sole editor. A voiceover came in; every frame on screen was built from scratch.
        </p>
        <OpenCut p={autopsy} tone="teal" className="mt-6" />
      </Layer>
    </div>
  );
}

/* ——— 03 · RenAIssance: one vertical frame, the title split around it ——— */
function PanelRen({ local }: { local?: Local }) {
  return (
    <div className="grid h-full items-center gap-10 lg:grid-cols-12">
      <Layer local={local} amount={-10} className="lg:col-span-4">
        <Tag n={3} kind="Talking head" />
        <p className="mt-6 font-serif text-[clamp(4rem,9vw,10rem)] leading-[0.8]">Ren</p>
        <p className="tc text-[clamp(3rem,7vw,7.5rem)] leading-[0.95] text-teal-3">AI</p>
        <p className="font-serif text-[clamp(4rem,9vw,10rem)] italic leading-[0.8]">ssance</p>
      </Layer>
      <Layer local={local} amount={3} className="lg:col-span-4">
        <div className="mx-auto w-full max-w-[min(340px,40vh)] rounded-[28px] border border-paper/15 bg-ink-3 p-2">
          <Clip src={ren.loop!} poster={ren.poster} label={`${ren.title} preview`} className="aspect-[9/16] w-full rounded-[20px]" />
        </div>
      </Layer>
      <Layer local={local} amount={-14} className="lg:col-span-3 lg:col-start-10">
        <p className="text-[15px] leading-relaxed text-paper/70">{ren.brief}</p>
        <div className="mt-6"><Meta items={[['Client', 'DevLabs × AI+'], ['Year', ren.year], ['Format', `${ren.format} · ${ren.duration}`]]} /></div>
        <OpenCut p={ren} className="mt-6" />
      </Layer>
    </div>
  );
}

const PANELS = [PanelNH7, PanelAutopsy, PanelRen];

function Intro() {
  return (
    <div className="flex h-full flex-col justify-center">
      <span className="label text-paper/45">03 — Selects</span>
      <h2 className="mt-6 text-[clamp(2.6rem,6.4vw,7rem)] font-medium leading-[0.92] tracking-[-0.045em]">
        Three cuts I’d put<br />in front of <span className="accent accent-hover">anyone.</span>
      </h2>
      <p className="mt-8 flex items-center gap-3 text-[14px] text-paper/50">
        <span className="hidden lg:inline">Keep scrolling, the reel runs sideways</span>
        <span className="lg:hidden">Tap any clip for sound</span>
        <span className="inline-block animate-pulse text-orange">→</span>
      </p>
    </div>
  );
}

/** Track progress, frame by frame, along the bottom of the pinned stage. */
function Strip({ progress, count }: { progress: MotionValue<number>; count: number }) {
  const w = useTransform(progress, (v) => `${v * 100}%`);
  const tc = useTransform(progress, (v) => {
    const f = Math.round(v * 24 * 40);
    return `00:00:${String(Math.floor(f / 24)).padStart(2, '0')}:${String(f % 24).padStart(2, '0')}`;
  });
  return (
    <div className="safe-x absolute inset-x-0 bottom-6 z-20 flex items-center gap-4">
      <motion.span className="tc w-24 text-[11px] text-paper/50">{tc}</motion.span>
      <div className="relative h-3 flex-1">
        <div className="absolute inset-x-0 top-1/2 h-px bg-paper/15" />
        {Array.from({ length: count }, (_, i) => (
          <span key={i} className="absolute top-0 h-3 w-px bg-paper/30" style={{ left: `${(i / (count - 1)) * 100}%` }} />
        ))}
        <motion.div className="absolute left-0 top-1/2 h-px bg-orange" style={{ width: w }} />
      </div>
      <span className="label text-paper/40">Selects</span>
    </div>
  );
}

/** Desktop: a pinned stage where vertical scroll drives the reel sideways. */
function Pinned() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const total = PANELS.length + 1; // intro + three selects
  const x = useTransform(scrollYProgress, (v) => `${-v * (total - 1) * 100}vw`);
  const locals = Array.from({ length: total }, (_, i) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useTransform(scrollYProgress, (v) => v * (total - 1) - i)
  );

  return (
    <section id="selects" ref={ref} className="relative" style={{ height: `${total * 100 + 40}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div style={{ x }} className="flex h-full will-change-transform">
          {[Intro, ...PANELS].map((P, i) => (
            <div key={i} className={cn('safe-x relative h-full w-screen shrink-0 pb-20 pt-24', i > 0 && 'border-l border-paper/5')}>
              <P local={i > 0 ? locals[i] : undefined} />
            </div>
          ))}
        </motion.div>
        <Strip progress={scrollYProgress} count={total} />
      </div>
    </section>
  );
}

/** Small screens and reduced motion: the same panels, stacked. */
function Stacked() {
  return (
    <section id="selects" className="relative pb-24">
      <div className="safe-x py-20"><Intro /></div>
      <div className="space-y-28">
        {PANELS.map((P, i) => (
          <div key={i} className="safe-x"><P /></div>
        ))}
      </div>
    </section>
  );
}

export default function Selects() {
  const wide = useMediaQuery('(min-width: 1024px) and (min-height: 600px)');
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  return wide && !reduced ? <Pinned /> : <Stacked />;
}
