import { motion } from 'motion/react';
import React from 'react';
import { EXPERIENCE } from '../../constants';
import { MaskLines, SectionTag } from '../ui/Reveal';

export default function Experience() {
  return (
    <section id="experience" className="relative px-4 py-24 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid grid-cols-12 items-end gap-y-6 lg:gap-x-8">
          <div className="col-span-12 lg:col-span-8">
            <SectionTag index="03" label="Experience" />
            <h2 className="mt-6 font-display text-[clamp(2.4rem,8vw,7.5rem)] font-bold uppercase leading-[0.9] tracking-[-0.04em]">
              <MaskLines lines={[<>Roles &</>, <span className="text-outline">credits</span>]} />
            </h2>
          </div>
          <p className="col-span-12 max-w-sm text-white/55 lg:col-span-4 lg:ml-auto lg:text-right">
            Post-production, frontend engineering and creative leadership across startups and tech communities.
          </p>
        </div>

        <ol className="mt-14 border-t border-white/10 md:mt-20">
          {EXPERIENCE.map((item, i) => (
            <motion.li
              key={item.org}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
              className="group relative grid grid-cols-12 gap-x-4 gap-y-5 border-b border-white/10 py-10 md:gap-x-8 md:py-14"
            >
              {/* Hover sweep line */}
              <span aria-hidden className="absolute left-0 top-[-1px] h-px w-full origin-left scale-x-0 bg-secondary transition-transform duration-700 ease-out-expo group-hover:scale-x-100" />

              <div className="col-span-12 flex items-baseline gap-4 md:col-span-1 md:block">
                <span className="font-mono text-xs text-secondary">{String(i + 1).padStart(2, '0')}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 md:mt-3 md:block">{item.kind}</span>
              </div>

              <div className="col-span-12 md:col-span-6 lg:col-span-5">
                <h3 className="font-display text-[clamp(1.4rem,3vw,2.6rem)] font-bold uppercase leading-[1] tracking-[-0.03em] transition-colors duration-500 group-hover:text-primary-glow">
                  {item.role}
                </h3>
                <p className="mt-3 font-serif text-xl italic text-secondary md:text-2xl">{item.org}</p>
              </div>

              <div className="col-span-12 md:col-span-5 lg:col-span-6">
                {item.description && <p className="leading-relaxed text-white/70">{item.description}</p>}
                {item.points.length > 0 && (
                  <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                    {item.points.map((pt) => (
                      <li key={pt} className="flex gap-3 text-sm text-white/50">
                        <span className="mt-2 h-px w-3 shrink-0 bg-primary-bright" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
