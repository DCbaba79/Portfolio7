import { motion, useMotionValue, useScroll, useSpring, useTransform, useMotionTemplate } from 'motion/react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { PROJECTS } from '../../constants';
import { PROFILE } from '../../data/profile';
import { scrollToTarget } from '../../lib/scroll';
import { useFinePointer, useReducedMotion, range } from '../../lib/hooks';
import Magnetic from '../ui/Magnetic';

const EASE = [0.16, 1, 0.3, 1] as const;
const CUT_MS = 720; // hard-cut rhythm inside the type

/**
 * Signature sequence. The tagline "STORIES THAT SELL." is set huge, with real
 * project stills hard-cutting inside the letterforms. Scrolling pushes the
 * camera through the type until the footage fills the frame and hands over
 * to the work exhibition.
 */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const [cut, setCut] = useState(0);
  const still = PROJECTS[cut].thumbnail;

  useEffect(() => {
    // Warm the cache so cuts are instant
    PROJECTS.forEach((p) => { const i = new Image(); i.src = p.thumbnail; });
    if (reduced) return;
    const t = setInterval(() => setCut((c) => (c + 1) % PROJECTS.length), CUT_MS);
    return () => clearInterval(t);
  }, [reduced]);

  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  // Camera push through the word
  const wordScale = useTransform(p, range([0, 0.7], [1, 7]));
  const wordOpacity = useTransform(p, range([0.55, 0.72], [1, 0]));
  const chromeOpacity = useTransform(p, range([0, 0.18], [1, 0]));
  const chromeY = useTransform(p, range([0, 0.18], [0, -40]));
  const plateOpacity = useTransform(p, range([0.42, 0.68], [0, 1]));
  const plateScale = useTransform(p, range([0.42, 1], [1.25, 1]));
  const endOpacity = useTransform(p, range([0.72, 0.88], [0, 1]));
  const endY = useTransform(p, range([0.72, 0.88], [60, 0]));

  // Pointer pans the footage inside the letters
  const px = useSpring(useMotionValue(50), { stiffness: 50, damping: 20 });
  const py = useSpring(useMotionValue(50), { stiffness: 50, damping: 20 });
  const bgPos = useMotionTemplate`${px}% ${py}%`;

  const tc = `00:00:${String(Math.floor((cut * CUT_MS) / 1000) % 60).padStart(2, '0')}:${String(cut * 7 % 25).padStart(2, '0')}`;

  return (
    <section
      id="home"
      ref={ref}
      aria-label="Introduction"
      className={reduced ? 'relative' : 'relative h-[260vh]'}
      onPointerMove={(e) => {
        if (!fine || reduced) return;
        px.set(30 + (e.clientX / window.innerWidth) * 40);
        py.set(30 + (e.clientY / window.innerHeight) * 40);
      }}
    >
      <div className="sticky top-0 flex h-[100svh] min-h-[560px] flex-col overflow-hidden px-4 pb-6 pt-24 md:px-10 md:pb-10 md:pt-28">
        {/* Full-bleed plate the camera lands on */}
        <motion.div aria-hidden style={{ opacity: reduced ? 0 : plateOpacity, scale: plateScale }} className="absolute inset-0">
          <img src={still} alt="" className="h-full w-full object-cover" />
          <div className="scanlines absolute inset-0 opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/50" />
        </motion.div>

        {/* Frame guides */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-1/2 h-px bg-white/[0.05]" />
          <div className="absolute inset-y-0 left-1/2 w-px bg-white/[0.04]" />
        </div>

        {/* Slate annotations */}
        <motion.div style={{ opacity: chromeOpacity, y: chromeY }} className="relative z-10 flex items-start justify-between gap-6 font-mono text-[10px] uppercase tracking-[0.3em] text-white/50 md:text-[11px]">
          <div className="space-y-1.5">
            <p><span className="text-secondary">●</span> Premium video editor</p>
            <p className="hidden sm:block">Motion · Design · Code</p>
          </div>
          <div className="space-y-1.5 text-right">
            <p className="tabular-nums text-white/70">TC {tc}</p>
            <p className="hidden sm:block">Cut {String(cut + 1).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')}</p>
          </div>
        </motion.div>

        <div className="relative z-10 flex flex-1 flex-col justify-center">
          <motion.p style={{ opacity: chromeOpacity }} className="mb-2 font-serif text-[clamp(1.1rem,2.6vw,2.4rem)] italic leading-tight text-white/80 md:mb-1">
            <motion.span
              className="inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1, ease: EASE }}
            >
              I don't just edit videos. <span className="text-secondary">I tell</span>
            </motion.span>
          </motion.p>

          {/* STORIES — footage inside the letterforms */}
          <motion.h1
            aria-label="Stories that sell — Dhyan Salavi, video editor and creative technologist"
            style={{ scale: reduced ? 1 : wordScale, opacity: reduced ? 1 : wordOpacity, transformOrigin: '54% 55%' }}
            className="relative -ml-[0.04em] will-change-transform"
          >
            <motion.span
              aria-hidden
              initial={{ clipPath: 'inset(100% 0 0 0)', y: '12%' }}
              animate={{ clipPath: 'inset(0% 0 0 0)', y: '0%' }}
              transition={{ duration: 1.3, ease: [0.83, 0, 0.17, 1], delay: 0.1 }}
              className="block whitespace-nowrap font-display uppercase leading-[0.8] tracking-[-0.01em] text-[32vw] md:text-[24vw]"
              style={{
                // Hairline stroke keeps the word legible when a cut is dark
                WebkitTextStroke: '1px rgba(243,244,246,0.4)',
                backgroundImage: `linear-gradient(rgba(243,244,246,.16), rgba(243,244,246,.16)), url(${still})`,
                backgroundSize: 'cover',
                backgroundPosition: reduced ? 'center' : (bgPos as unknown as string),
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Stories
            </motion.span>
          </motion.h1>

          <motion.div style={{ opacity: chromeOpacity }} className="relative z-10 -mt-[3vw] flex items-end justify-between gap-4">
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 1.1, ease: EASE }}
              className="hidden max-w-xs pb-3 text-sm leading-relaxed text-white/60 lg:block"
            >
              Crafting high-impact cinematic visuals for brands, creators, and elite gaming startups.
            </motion.span>
            <span aria-hidden className="ml-auto flex items-baseline gap-[0.18em] font-display uppercase leading-[0.82] text-[18vw] md:text-[10vw]">
              <motion.span initial={{ y: '100%', opacity: 0 }} animate={{ y: '0%', opacity: 1 }} transition={{ delay: 0.45, duration: 1.1, ease: EASE }}>
                That
              </motion.span>
              <motion.span initial={{ y: '100%', opacity: 0 }} animate={{ y: '0%', opacity: 1 }} transition={{ delay: 0.55, duration: 1.1, ease: EASE }} className="text-outline-orange">
                Sell.
              </motion.span>
            </span>
          </motion.div>
        </div>

        {/* Bottom bar: credit + CTAs */}
        <motion.div
          style={{ opacity: chromeOpacity }}
          className="relative z-10 flex flex-col gap-5 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
            A film by <span className="text-paper">{PROFILE.name}</span> — 300,000+ views generated
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Magnetic>
              <a
                href="#work"
                onClick={(e) => { e.preventDefault(); scrollToTarget('work'); }}
                className="group relative inline-flex items-center gap-3 overflow-hidden bg-primary px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white"
              >
                <span className="absolute inset-0 translate-y-full bg-secondary transition-transform duration-500 ease-out-expo group-hover:translate-y-0" />
                <span className="relative">Explore the work</span>
                <ArrowDownRight size={16} className="relative transition-transform duration-500 group-hover:-rotate-45" />
              </a>
            </Magnetic>
            <a
              href={PROFILE.resume || '#contact'}
              {...(PROFILE.resume ? { target: '_blank', rel: 'noopener noreferrer' } : { onClick: (e: React.MouseEvent) => { e.preventDefault(); scrollToTarget('contact'); } })}
              className="inline-flex items-center gap-2 border border-white/25 px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] transition-colors hover:border-paper hover:bg-paper hover:text-ink"
            >
              {PROFILE.resume ? 'Resume' : 'Hire me'} <ArrowUpRight size={14} />
            </a>
          </div>
        </motion.div>

        {/* Vertical edition label */}
        <motion.p
          aria-hidden
          style={{ opacity: chromeOpacity }}
          className="vertical absolute right-3 top-1/2 hidden -translate-y-1/2 font-mono text-[10px] uppercase tracking-[0.4em] text-white/35 md:block md:right-5"
        >
          Portfolio — Vol. 02 — {new Date().getFullYear()}
        </motion.p>

        {/* Where the push lands */}
        {!reduced && (
          <motion.div style={{ opacity: endOpacity, y: endY }} className="pointer-events-none absolute inset-x-4 top-1/2 z-10 -translate-y-1/2 md:inset-x-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-secondary">Now showing</p>
            <p className="mt-2 font-display text-[clamp(3rem,11vw,10rem)] uppercase leading-[0.92]">The work ↓</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
