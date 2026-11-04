import { motion, useMotionValue, useScroll, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { PROJECTS } from '../../constants';
import { PROFILE } from '../../data/profile';
import { Link } from '../../lib/router';
import { scrollToTarget } from '../../lib/scroll';
import { useFinePointer, useReducedMotion } from '../../lib/hooks';
import { MaskLines } from '../ui/Reveal';
import Magnetic from '../ui/Magnetic';

const EASE = [0.16, 1, 0.3, 1] as const;
const DISCIPLINES = ['Video Editing', 'Motion Design', 'Visual Storytelling', 'UI / UX', 'Branding', 'Frontend', 'Computer Vision', 'Reinforcement Learning'];

function Letters({ word, delay, className }: { word: string; delay: number; className?: string }) {
  return (
    <span className={className} aria-hidden>
      {word.split('').map((ch, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: '105%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 1.2, ease: EASE, delay: delay + i * 0.045 }}
          >
            {ch}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/** A monitor-style frame that cuts between real project stills. */
function NowShowing({ px, py }: { px: any; py: any }) {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  const project = PROJECTS[index];

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % PROJECTS.length), 2600);
    return () => clearInterval(t);
  }, [reduced]);

  return (
    <motion.div
      style={{ x: px, y: py }}
      initial={{ clipPath: 'inset(50% 50% 50% 50%)' }}
      animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      transition={{ duration: 1.4, ease: [0.83, 0, 0.17, 1], delay: 0.5 }}
      className="relative"
    >
      <Link
        to={`/work/${project.id}`}
        data-cursor="Watch"
        className="group viewfinder block p-2.5"
        aria-label={`Now showing: ${project.title}`}
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-ink-2">
          <AnimatePresence initial={false}>
            <motion.img
              key={project.id}
              src={project.thumbnail}
              alt=""
              initial={{ clipPath: 'inset(0 0 0 100%)', scale: 1.12 }}
              animate={{ clipPath: 'inset(0 0 0 0%)', scale: 1 }}
              exit={{ opacity: 0.4 }}
              transition={{ duration: 0.9, ease: [0.83, 0, 0.17, 1] }}
              className="absolute inset-0 h-full w-full object-cover transition-[filter] duration-700 group-hover:saturate-125"
              decoding="async"
            />
          </AnimatePresence>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/20" />
          <div className="absolute left-3 top-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/80">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary rec-blink" /> Now showing
          </div>
          <div className="absolute right-3 top-3 font-mono text-[10px] tabular-nums text-white/60">
            {String(index + 1).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')}
          </div>
          <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary-glow">{project.category}</p>
              <p className="truncate text-sm font-semibold md:text-base">{project.title}</p>
            </div>
            <ArrowUpRight className="shrink-0 text-white/70 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-secondary" size={20} />
          </div>
        </div>
        {/* Scrub bar under the frame */}
        <div className="mt-2 flex gap-1">
          {PROJECTS.map((p, i) => (
            <span key={p.id} className="h-0.5 flex-1 overflow-hidden bg-white/10">
              <motion.span
                className="block h-full origin-left bg-secondary"
                initial={false}
                animate={{ scaleX: i < index ? 1 : i === index ? 1 : 0 }}
                transition={{ duration: i === index && !reduced ? 2.6 : 0.3, ease: 'linear' }}
              />
            </span>
          ))}
        </div>
      </Link>
    </motion.div>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const frameX = useTransform(sx, (v) => v * 28);
  const frameY = useTransform(sy, (v) => v * 20);
  const nameX = useTransform(sx, (v) => v * -12);

  const nameY = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      id="home"
      ref={ref}
      onPointerMove={(e) => {
        if (!fine || reduced) return;
        mx.set(e.clientX / window.innerWidth - 0.5);
        my.set(e.clientY / window.innerHeight - 0.5);
      }}
      className="relative flex min-h-[100svh] flex-col overflow-hidden px-4 pb-28 pt-24 md:px-10 md:pb-32 md:pt-28"
    >
      {/* Backdrop: brand glows + frame guides, no stock imagery */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-[10%] top-[-20%] h-[70vh] w-[70vh] rounded-full bg-primary/15 blur-[140px]" />
        <div className="absolute -right-[10%] bottom-[-10%] h-[60vh] w-[60vh] rounded-full bg-secondary/10 blur-[140px]" />
        <div className="absolute inset-x-4 top-1/3 h-px bg-white/[0.06] md:inset-x-10" />
        <div className="absolute inset-x-4 top-2/3 h-px bg-white/[0.06] md:inset-x-10" />
        <div className="absolute inset-y-0 left-1/3 w-px bg-white/[0.04]" />
        <div className="absolute inset-y-0 left-2/3 w-px bg-white/[0.04]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1600px] flex-1 flex-col">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="flex items-center justify-between eyebrow"
        >
          <span><span className="text-secondary">●</span> Premium Video Editor</span>
          <span className="hidden sm:inline">Creative Technologist — Portfolio {new Date().getFullYear()}</span>
        </motion.div>

        {/* Name — the signature typographic element */}
        <motion.h1
          style={{ y: nameY, x: nameX, opacity: fade }}
          className="relative mt-6 select-none font-display font-bold uppercase leading-[0.86] tracking-[-0.04em] md:mt-8"
          aria-label={PROFILE.name}
        >
          <Letters word="Dhyan" delay={0.15} className="block text-[14.5vw] md:text-[11.5vw] 2xl:text-[11.5rem]" />
          <span className="flex items-end justify-end gap-[3vw]">
            <motion.span
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 1, ease: EASE }}
              className="mb-[1.5vw] hidden font-serif text-[2.4vw] normal-case italic leading-none tracking-normal text-secondary lg:block 2xl:text-4xl"
            >
              edits, designs<br />& builds —
            </motion.span>
            <Letters word="Salavi" delay={0.35} className="block text-[14.5vw] text-outline md:text-[11.5vw] 2xl:text-[11.5rem]" />
          </span>
        </motion.h1>

        <div className="relative mt-8 grid flex-1 grid-cols-1 items-end gap-10 md:mt-6 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6 xl:col-span-5">
            <h2 className="font-display text-[clamp(1.35rem,3.2vw,2.6rem)] font-bold uppercase leading-[1.05] tracking-[-0.02em]">
              <MaskLines
                immediate
                delay={0.7}
                lines={[
                  <>I don't just edit videos.</>,
                  <>I tell <span className="orange-to-teal normal-case tracking-normal">stories</span> that sell.</>,
                ]}
              />
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05, duration: 1, ease: EASE }}
              className="mt-6 max-w-md text-base font-light leading-relaxed text-white/60 md:text-lg"
            >
              Crafting high-impact cinematic visuals for brands, creators, and elite gaming startups — with a toolkit that spans
              <span className="text-white"> editing, design, code</span> and <span className="text-white">engineering</span>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 1, ease: EASE }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Magnetic>
                <a
                  href="#work"
                  onClick={(e) => { e.preventDefault(); scrollToTarget('work'); }}
                  className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-primary px-6 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white"
                >
                  <span className="absolute inset-0 translate-y-full rounded-full bg-secondary transition-transform duration-500 ease-out-expo group-hover:translate-y-0" />
                  <span className="relative">Explore selected work</span>
                  <ArrowDownRight size={18} className="relative transition-transform duration-500 group-hover:rotate-[-45deg]" />
                </a>
              </Magnetic>
              {PROFILE.resume ? (
                <a
                  href={PROFILE.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-4 text-sm font-semibold uppercase tracking-[0.14em] transition-colors hover:border-white hover:bg-white hover:text-ink"
                >
                  Resume <ArrowUpRight size={16} />
                </a>
              ) : (
                <a
                  href="#contact"
                  onClick={(e) => { e.preventDefault(); scrollToTarget('contact'); }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-4 text-sm font-semibold uppercase tracking-[0.14em] transition-colors hover:border-white hover:bg-white hover:text-ink"
                >
                  Hire me <ArrowUpRight size={16} />
                </a>
              )}
            </motion.div>
          </div>

          <div className="relative lg:col-span-6 lg:col-start-7 xl:col-span-5 xl:col-start-8">
            <NowShowing px={frameX} py={frameY} />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.8 }}
              className="absolute -left-3 -top-5 rounded-sm bg-secondary px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink md:-left-6"
            >
              300,000+ views generated
            </motion.div>
          </div>
        </div>
      </div>

      {/* Discipline ticker */}
      <div aria-hidden className="absolute inset-x-0 bottom-16 overflow-hidden border-y border-white/[0.07] py-2.5 md:bottom-20">
        <div className="flex w-max animate-marquee">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center">
              {DISCIPLINES.map((d) => (
                <span key={d} className="flex items-center gap-6 px-6 font-mono text-[11px] uppercase tracking-[0.3em] text-white/45">
                  {d} <span className="text-secondary">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
