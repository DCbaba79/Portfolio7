import { motion } from 'motion/react';
import React, { useState } from 'react';
import { TOOLKIT } from '../../constants';
import { cn } from '../../lib/utils';
import { useFinePointer } from '../../lib/hooks';
import { MaskLines, SectionTag } from '../ui/Reveal';

/**
 * Typographic toolkit: every tool set in one flowing block. Choosing a
 * discipline lights its tools and dims the rest — no fake percentages.
 */
export default function Skills() {
  const [active, setActive] = useState<string | null>(null);
  const fine = useFinePointer();
  const all = TOOLKIT.flatMap((g, gi) => g.tools.map((t) => ({ tool: t, group: g.id, gi })));

  return (
    <section id="toolkit" className="relative overflow-hidden border-t border-white/[0.07] px-4 py-24 md:px-10 md:py-40">
      <div className="mx-auto grid max-w-[1600px] grid-cols-12 gap-y-12 lg:gap-x-8">
        <div className="col-span-12 lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <SectionTag index="04" label="Creative Toolkit" />
            <h2 className="mt-6 font-display text-[clamp(2.4rem,10vw,4.5rem)] font-bold lg:text-[4.3vw] 2xl:text-[4.8rem] uppercase leading-[0.9] tracking-[-0.04em]">
              <MaskLines lines={[<>The</>, <span className="text-outline">arsenal</span>]} />
            </h2>
            <p className="mt-6 max-w-sm text-white/55">
              From pixel-perfect color grading to production code — the tools and disciplines I bring to a project.
            </p>

            <div className="mt-10 flex flex-wrap gap-2 lg:flex-col lg:items-start" role="group" aria-label="Filter toolkit by discipline">
              {TOOLKIT.map((g, i) => (
                <button
                  key={g.id}
                  onClick={() => setActive((a) => (a === g.id && !fine ? null : g.id))}
                  onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(g.id)}
                  aria-pressed={active === g.id}
                  className={cn(
                    'group flex items-center gap-3 rounded-full border px-4 py-2.5 text-left transition-colors duration-300 lg:w-full lg:rounded-none lg:border-x-0 lg:border-t-0 lg:px-0 lg:py-4',
                    active === g.id ? 'border-primary-bright text-white' : 'border-white/10 text-white/55 hover:text-white'
                  )}
                >
                  <span className={cn('font-mono text-[10px]', i % 2 ? 'text-secondary' : 'text-primary-glow')}>0{i + 1}</span>
                  <span className="text-sm font-medium uppercase tracking-[0.15em]">{g.label}</span>
                  <span className="ml-auto hidden font-mono text-[10px] text-white/30 lg:inline">{g.tools.length}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8" onPointerLeave={(e) => e.pointerType === 'mouse' && setActive(null)}>
          <p className="flex flex-wrap items-baseline gap-x-[0.35em] gap-y-1 text-[clamp(1.7rem,4.2vw,4rem)] font-semibold leading-[1.1] tracking-[-0.03em]">
            {all.map(({ tool, group, gi }, i) => {
              const lit = !active || active === group;
              return (
                <motion.span
                  key={tool}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: (i % 10) * 0.03, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-flex items-baseline"
                >
                  <span
                    className={cn(
                      'transition-[color,opacity] duration-500',
                      gi % 2 === 1 && 'font-serif font-bold italic',
                      lit ? 'opacity-100' : 'opacity-[0.12]',
                      lit && active ? (gi % 2 ? 'text-secondary' : 'text-primary-glow') : 'text-paper'
                    )}
                  >
                    {tool}
                  </span>
                  <span className="ml-[0.35em] text-white/15">/</span>
                </motion.span>
              );
            })}
          </p>
        </div>
      </div>
    </section>
  );
}
