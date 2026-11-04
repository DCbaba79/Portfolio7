import { animate, motion, useInView, useScroll, useTransform, MotionValue } from 'motion/react';
import React, { useEffect, useRef } from 'react';
import { STATS } from '../../constants';
import { cn } from '../../lib/utils';
import { range as lin } from '../../lib/hooks';

const STATEMENT = 'Footage is raw. Code is raw. Ideas are raw. My job is the cut — the decision that turns raw material into something people feel.';

/** The four disciplines told as one sequence rather than a list of titles. */
const CHAPTERS = [
  { n: 'I', title: 'The cut', body: 'Commercials, explainers, music videos and event films. Rhythm, color and sound decide whether a viewer stays.' },
  { n: 'II', title: 'The frame', body: 'Design, branding and creative direction shape how a story looks before it ever moves.' },
  { n: 'III', title: 'The code', body: 'I build interfaces in React and JavaScript — and bring an editor’s sense of timing to every transition.' },
  { n: 'IV', title: 'The system', body: 'Now exploring reinforcement learning, computer vision, AI-assisted workflows and cyber-physical systems.' },
];

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, lin(range, [0.12, 1]));
  return <motion.span style={{ opacity }} className="mr-[0.22em] inline-block">{children}</motion.span>;
}

function Counter({ value, label }: { value: number; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const c = animate(0, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => ref.current && (ref.current.textContent = Math.round(v).toLocaleString()),
    });
    return () => c.stop();
  }, [inView, value]);
  return (
    <div className="flex items-baseline gap-3">
      <span className="font-display text-3xl tabular-nums md:text-4xl">
        <span ref={ref}>{value.toLocaleString()}</span><span className="text-secondary">+</span>
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">{label}</span>
    </div>
  );
}

export default function About() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 40%'] });
  const words = STATEMENT.split(' ');

  return (
    <section id="about" className="relative px-4 py-28 md:px-10 md:py-48">
      <div className="mx-auto grid max-w-[1600px] grid-cols-12 gap-y-12 md:gap-x-8">
        <div className="col-span-12 flex items-start gap-6 md:col-span-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-secondary">02</span>
          <span className="vertical hidden font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 md:block">The person behind the work</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/40 md:hidden">The person behind the work</span>
        </div>

        <p ref={ref} className="col-span-12 text-[clamp(1.8rem,4.4vw,4.4rem)] font-medium leading-[1.06] tracking-[-0.03em] md:col-span-10">
          {words.map((w, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>{w}</Word>
          ))}
        </p>
      </div>

      {/* Staircase of chapters — each step offset, not a grid */}
      <ol className="mx-auto mt-24 max-w-[1600px] md:mt-40">
        {CHAPTERS.map((c, i) => (
          <motion.li
            key={c.n}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '0px 0px -12% 0px' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className={cn('group grid grid-cols-12 items-baseline gap-x-4 border-t border-white/10 py-7 md:gap-x-8 md:py-9', i === CHAPTERS.length - 1 && 'border-b')}
          >
            <span className={cn('col-span-3 font-display text-5xl leading-none md:col-span-2 md:text-7xl', i % 2 ? 'text-outline-orange' : 'text-outline')} style={{ marginLeft: `${i * 4}%` }}>
              {c.n}
            </span>
            <h3 className="col-span-9 font-serif text-3xl italic md:col-span-3 md:text-4xl" style={{ paddingLeft: `${i * 6}%` }}>
              {c.title}
            </h3>
            <p className="col-span-12 mt-3 max-w-lg text-white/60 transition-colors duration-500 group-hover:text-white/90 md:col-span-6 md:col-start-7 md:mt-0">
              {c.body}
            </p>
          </motion.li>
        ))}
      </ol>

      <div className="mx-auto mt-16 flex max-w-[1600px] flex-wrap gap-x-12 gap-y-6 md:mt-20">
        {STATS.map((s) => <Counter key={s.label} value={s.value} label={s.label} />)}
      </div>
    </section>
  );
}
