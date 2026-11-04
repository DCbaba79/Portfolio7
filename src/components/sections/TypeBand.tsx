import { motion, useScroll, useSpring, useTransform, useVelocity } from 'motion/react';
import React from 'react';

const WORDS = ['Edit', 'Motion', 'Story', 'Design', 'Code', 'Color', 'Sound', 'Systems'];

/** Loud full-bleed interlude. Rows run in opposite directions and lean with scroll speed. */
export default function TypeBand() {
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { stiffness: 120, damping: 40 });
  const skew = useTransform(velocity, [-2500, 0, 2500], [8, 0, -8], { clamp: true });

  const row = (reverse?: boolean) => (
    <motion.div style={{ skewX: skew }} className="flex w-max" aria-hidden>
      <div className="flex w-max animate-marquee" style={{ animationDirection: reverse ? 'reverse' : 'normal', animationDuration: '46s' }}>
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {WORDS.map((w, i) => (
              <span key={w} className="flex items-center font-display text-[18vw] uppercase leading-[0.9] md:text-[13vw]">
                <span className={(i + (reverse ? 1 : 0)) % 2 ? 'text-outline' : 'text-paper'}>{w}</span>
                <span className="mx-[0.25em] text-[0.35em] text-secondary">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <section aria-label="Disciplines" className="relative overflow-hidden border-y border-white/10 bg-primary/[0.06] py-6 md:py-10">
      {row()}
      {row(true)}
    </section>
  );
}
