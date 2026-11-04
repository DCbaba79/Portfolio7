import { motion } from 'motion/react';
import React from 'react';
import { EXPERIENCE } from '../../constants';

/** Experience set as a film's end credits: role on the left of the spine, credit on the right. */
export default function Experience() {
  return (
    <section id="experience" className="relative px-4 py-28 md:px-10 md:py-44">
      <div className="mx-auto max-w-[1300px]">
        <div className="flex flex-col items-center text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-secondary">03 — Experience</p>
          <h2 className="mt-5 font-display text-[24vw] uppercase leading-[0.92] md:text-[13vw] 2xl:text-[12rem]">
            <span className="text-outline">End</span> credits
          </h2>
          <p className="mt-6 max-w-md font-serif text-xl italic text-white/60">Post-production, frontend engineering and creative leadership — in order of appearance.</p>
        </div>

        <ol className="relative mt-20 md:mt-28">
          {/* Centre spine */}
          <span aria-hidden className="absolute bottom-0 left-1/2 top-0 hidden w-px bg-white/10 md:block" />
          {EXPERIENCE.map((item, i) => (
            <motion.li
              key={item.org}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative grid grid-cols-1 gap-3 py-10 text-center md:grid-cols-2 md:gap-16 md:py-14 md:text-left"
            >
              <span aria-hidden className="absolute left-1/2 top-[3.9rem] hidden h-2 w-2 -translate-x-1/2 rotate-45 bg-ink ring-1 ring-secondary transition-colors duration-500 group-hover:bg-secondary md:block" />
              <div className="md:text-right">
                <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/40">{String(i + 1).padStart(2, '0')} · {item.kind}</p>
                <p className="mt-3 font-mono text-sm uppercase tracking-[0.25em] text-white/75 md:text-base">{item.role}</p>
              </div>
              <div>
                <h3 className="font-display text-[clamp(2.2rem,5vw,4.5rem)] uppercase leading-[0.9] transition-colors duration-500 group-hover:text-primary-glow">
                  {item.org}
                </h3>
                {item.description && <p className="mx-auto mt-4 max-w-md text-white/60 md:mx-0">{item.description}</p>}
                {item.points.length > 0 && (
                  <p className="mx-auto mt-4 max-w-md font-mono text-[11px] uppercase leading-relaxed tracking-[0.15em] text-white/40 md:mx-0">
                    {item.points.join(' / ')}
                  </p>
                )}
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
