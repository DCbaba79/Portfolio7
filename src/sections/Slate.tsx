import React from 'react';
import { motion } from 'motion/react';
import { PROFILE } from '../data/site';

const FIELDS = [
  ['Prod.', `${PROFILE.alias} Showreel`],
  ['Roll', '001'],
  ['Scene', '—'],
  ['Take', 'In ideation'],
  ['Director', PROFILE.name],
  ['Date', 'Soon'],
];

/** The showreel isn't cut yet, so the spot is held with a slate, not a fake reel. */
export default function Slate() {
  return (
    <section id="reel" className="safe-x relative py-24 md:py-36">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <span className="label text-paper/45">02 — Showreel</span>
          <span className="label flex items-center gap-2 text-paper/45">
            <span className="h-1.5 w-1.5 rounded-full bg-orange" /> Still in the edit
          </span>
        </div>

        <div className="relative">
          {/* clapper sticks */}
          <motion.div
            className="stripes h-10 origin-[0%_100%] md:h-14"
            initial={{ rotate: -14 }}
            whileInView={{ rotate: [-14, -14, 0, -2, 0] }}
            viewport={{ once: true, margin: '0px 0px -30% 0px' }}
            transition={{ duration: 0.9, times: [0, 0.35, 0.6, 0.78, 1], ease: 'easeIn' }}
          />
          <div className="stripes h-10 opacity-90 md:h-14" style={{ backgroundPosition: '22px 0' }} />

          <div className="border border-t-0 border-paper/20 bg-ink-2">
            <div className="grid grid-cols-2 md:grid-cols-3">
              {FIELDS.map(([k, v]) => (
                <div key={k} className="border-b border-r border-paper/10 p-4 md:p-6">
                  <span className="label block text-paper/40">{k}</span>
                  <span className="mt-2 block text-[clamp(1.05rem,2.2vw,1.6rem)] font-medium tracking-[-0.02em]">{v}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-6 p-5 md:flex-row md:items-end md:justify-between md:p-8">
              <p className="max-w-xl text-[clamp(1.4rem,3vw,2.4rem)] leading-[1.1] tracking-[-0.03em]">
                The reel is still being cut. <span className="accent accent-hover">Until then, the selects speak.</span>
              </p>
              <span className="tc shrink-0 text-[12px] text-paper/40">00:00:00:00 / --:--:--:--</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
