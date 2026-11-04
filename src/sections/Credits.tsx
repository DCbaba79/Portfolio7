import React, { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView } from 'motion/react';
import { CREDITS, NUMBERS, PROFILE, TESTIMONIAL, TOOLS } from '../data/site';
import { Fade, Line } from '../components/Reveal';

function Count({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -20% 0px' });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.6, ease: [0.16, 1, 0.3, 1], onUpdate: (n) => setV(Math.round(n)) });
    return () => c.stop();
  }, [inView, to]);
  return (
    <span ref={ref} className="tabular-nums">
      {v}
      {suffix}
    </span>
  );
}

/** Experience, numbers and a word from a collaborator, set as end credits. */
export default function Credits() {
  return (
    <section id="credits" className="safe-x relative py-28 md:py-44">
      <div className="mx-auto max-w-4xl text-center">
        <span className="label text-paper/45">06 — Credits</span>
        <h2 className="mt-8 text-[clamp(2.4rem,6vw,5.6rem)] font-medium leading-[0.95] tracking-[-0.045em]">
          <Line>Cut, graded and</Line>
          <Line delay={0.08}>
            <span className="accent accent-hover">delivered by</span>
          </Line>
        </h2>
        <Fade className="mt-6">
          <p className="display text-[clamp(2.6rem,9vw,7.5rem)] text-paper">{PROFILE.name}</p>
        </Fade>

        {/* roles */}
        <ul className="mt-20 md:mt-28">
          {CREDITS.map((c, i) => (
            <motion.li
              key={c.role + c.org}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: i * 0.04 }}
              className="grid gap-1 py-5 md:grid-cols-[1fr_auto_1.5fr] md:items-baseline md:gap-8"
            >
              <span className="label text-paper/45 md:text-right">{c.role}</span>
              <span className="hidden h-px w-10 bg-paper/20 md:block" />
              <span className="md:text-left">
                <span className="block text-[clamp(1.15rem,2vw,1.5rem)] tracking-[-0.02em]">{c.org}</span>
                {c.when && <span className="tc mt-1 block text-[11px] text-paper/40">{c.when}</span>}
              </span>
            </motion.li>
          ))}
        </ul>

        {/* software */}
        <Fade className="mt-16 border-y border-paper/10 py-10">
          <span className="label text-paper/45">Primary software</span>
          <p className="mt-3 text-[clamp(1.8rem,4vw,3rem)] font-semibold tracking-[-0.04em]">
            {TOOLS.primary}
            <span className="tc ml-2 align-middle text-[0.4em] font-normal text-teal-3">.drp</span>
          </p>
          <p className="mt-3 text-[14px] text-paper/55">Also on the timeline: {TOOLS.also.join(' · ')}</p>
        </Fade>

        {/* numbers */}
        <div className="mt-16 grid grid-cols-2 gap-y-12 md:grid-cols-4">
          {NUMBERS.map((n) => (
            <Fade key={n.label} y={16}>
              <p className="text-[clamp(2.6rem,6vw,4.6rem)] font-extrabold leading-none tracking-[-0.05em]">
                <Count to={n.value} suffix={n.suffix} />
              </p>
              <p className="mx-auto mt-3 max-w-[12rem] text-[13px] leading-snug text-paper/50">{n.label}</p>
            </Fade>
          ))}
        </div>

        {/* testimonial */}
        <Fade className="mt-28 md:mt-36">
          <span className="label text-paper/45">A word from a collaborator</span>
          <blockquote className="mt-8">
            <p className="font-serif text-[clamp(1.7rem,3.6vw,3rem)] leading-[1.12] tracking-[-0.01em]">
              <span className="text-orange">“</span>
              {TESTIMONIAL.quote}
              <span className="text-orange">”</span>
            </p>
            <footer className="label mt-8 text-paper/60">— {TESTIMONIAL.name}</footer>
          </blockquote>
        </Fade>
      </div>
    </section>
  );
}
