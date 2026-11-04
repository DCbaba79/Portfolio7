import { animate, motion, useInView, useScroll, useTransform, MotionValue } from 'motion/react';
import React, { useEffect, useRef } from 'react';
import { STATS } from '../../constants';
import { PROFILE } from '../../data/profile';
import { FadeUp, SectionTag } from '../ui/Reveal';

const STATEMENT =
  "I'm Dhyan — a video editor who thinks like an engineer, and a developer who edits like a filmmaker. I work where storytelling meets systems: cutting cinematic films, shaping visual identities, and building the interfaces behind them.";

const PILLARS = [
  {
    title: 'Philosophy',
    body: 'Every frame should earn its place. A cut, a pixel or a line of code — I care about pacing, clarity and the feeling it leaves behind.',
  },
  {
    title: 'Across disciplines',
    body: 'My work moves between video editing, design, development and engineering. Each one sharpens the others: rhythm from the edit, structure from code.',
  },
  {
    title: 'Currently exploring',
    body: 'Reinforcement learning, computer vision, AI-assisted creative workflows and cyber-physical systems.',
  },
];

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <span className="relative mr-[0.25em] inline-block">
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
}

/** Statement that lights up word by word as it scrolls through the viewport. */
function ScrollLitStatement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 45%'] });
  const words = STATEMENT.split(' ');
  return (
    <p ref={ref} className="font-sans text-[clamp(1.6rem,3.6vw,3.4rem)] font-medium leading-[1.12] tracking-[-0.02em]">
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  );
}

function Counter({ value, label }: { value: number; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, value, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => ref.current && (ref.current.textContent = Math.round(v).toLocaleString()),
    });
    return () => controls.stop();
  }, [inView, value]);
  return (
    <div className="border-t border-white/10 pt-5">
      <div className="whitespace-nowrap font-display text-[clamp(1.5rem,6vw,2.4rem)] font-bold tabular-nums leading-none tracking-[-0.04em] xl:text-[clamp(1.8rem,2.4vw,2.8rem)]">
        {/* Rendered with the real value so it's correct without JS / before animating */}
        <span ref={ref}>{value.toLocaleString()}</span>
        <span className="text-secondary">+</span>
      </div>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">{label}</p>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="relative border-t border-white/[0.07] px-4 py-24 md:px-10 md:py-40">
      <div className="mx-auto grid max-w-[1600px] grid-cols-12 gap-y-14 lg:gap-x-8">
        <div className="col-span-12 lg:col-span-3">
          <div className="lg:sticky lg:top-32">
            <SectionTag index="02" label="About" />
            <div className="viewfinder mt-8 hidden w-40 p-2 lg:block">
              <img src={PROFILE.logo} alt={`${PROFILE.name} logo`} width={160} height={160} loading="lazy" className="aspect-square w-full object-cover grayscale transition duration-700 hover:grayscale-0" />
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-9">
          <ScrollLitStatement />

          <div className="mt-16 grid grid-cols-1 gap-10 md:mt-24 md:grid-cols-3 md:gap-8">
            {PILLARS.map((p, i) => (
              <FadeUp key={p.title} delay={i * 0.1}>
                <h3 className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-primary-glow">
                  <span className="text-white/30">/{String(i + 1).padStart(2, '0')}</span> {p.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-white/65">{p.body}</p>
              </FadeUp>
            ))}
          </div>

          <div className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 min-[400px]:grid-cols-2 md:mt-24 xl:grid-cols-4">
            {STATS.map((s) => (
              <Counter key={s.label} value={s.value} label={s.label} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
