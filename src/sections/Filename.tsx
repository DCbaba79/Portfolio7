import React from 'react';
import { motion } from 'motion/react';
import { PROFILE } from '../data/site';
import { Fade, Line } from '../components/Reveal';

const EASE = [0.16, 1, 0.3, 1] as const;

/** The alias as a wordmark, with the mascot beside it. */
export default function Filename() {
  return (
    <section id="file" className="safe-x relative pb-32 pt-28 md:pb-44 md:pt-40">
      <div className="mb-10 flex items-center justify-between border-b border-paper/10 pb-4 md:mb-16">
        <span className="label text-paper/45">01 — The alias</span>
        <span className="label hidden text-paper/45 md:block">Project · {PROFILE.file}</span>
      </div>

      <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <h2 className="leading-[0.8] lg:col-span-8" aria-label={PROFILE.file}>
          <motion.span
            aria-hidden
            className="display block text-[clamp(5rem,19vw,17rem)] text-paper"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -15% 0px' }}
            transition={{ duration: 1, ease: EASE }}
          >
            {PROFILE.alias}
          </motion.span>
          <motion.span
            aria-hidden
            className="tc block text-[clamp(5rem,19vw,17rem)] tracking-[-0.06em] text-teal-3"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -15% 0px' }}
            transition={{ duration: 1, ease: EASE, delay: 0.1 }}
          >
            .drp
          </motion.span>
        </h2>

        <Fade className="lg:col-span-4" y={50}>
          <figure className="relative mx-auto max-w-[360px] lg:ml-auto">
            <div className="relative aspect-square overflow-hidden">
              <img
                src={PROFILE.raccoon}
                alt="DJ79's mascot: a raccoon in blue sunglasses and an orange hoodie, on a teal background"
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_80px_rgba(3,7,18,0.55)]" />
              <span className="tc absolute left-3 top-3 bg-ink/70 px-1.5 py-0.5 text-[10px] text-paper/80">REC ● 23:59:59:23</span>
            </div>
          </figure>
        </Fade>
      </div>

      <div className="mt-28 md:mt-40">
        <Line className="text-[clamp(2.2rem,6.4vw,6.5rem)] font-medium leading-[0.95] tracking-[-0.045em]">
          Ordinary ideas in.
        </Line>
        <Line delay={0.1} className="text-[clamp(2.4rem,7vw,7rem)] leading-[0.95] md:pl-[12vw]">
          <span className="accent accent-hover">Extraordinary cuts out.</span>
        </Line>
      </div>
    </section>
  );
}
