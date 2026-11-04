import { motion, useScroll, useTransform } from 'motion/react';
import React, { useRef, useState } from 'react';
import { TOOLKIT } from '../../constants';
import { cn } from '../../lib/utils';

/**
 * The toolkit laid out as an edit session: each discipline is a track,
 * each tool a clip. No percentages — just what's on the timeline.
 */
const TRACKS = [
  { code: 'V2', group: 'motion' },
  { code: 'V1', group: 'edit' },
  { code: 'A1', group: 'color' },
  { code: 'A2', group: 'story' },
];

export default function Skills() {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<{ track: string; idx: number; tool: string; label: string } | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 30%'] });
  const playhead = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section id="toolkit" className="relative px-4 py-28 md:px-10 md:py-44">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid grid-cols-12 items-end gap-y-6 md:gap-x-8">
          <div className="col-span-12 md:col-span-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-secondary">04 — Creative toolkit</p>
            <h2 className="mt-5 font-display uppercase leading-[0.92]">
              <span className="block text-[17vw] md:text-[9vw]">The production</span>
              <span className="text-outline block text-[24vw] md:text-[13vw]">desk</span>
            </h2>
          </div>
          <p className="col-span-12 max-w-sm text-white/55 md:col-span-4 md:ml-auto md:text-right">
            From the first assembly to the final grade and mix — every tool I reach for, laid out like a session on the timeline.
          </p>
        </div>

        <div ref={ref} className="relative mt-14 border border-white/10 bg-ink-2/60 md:mt-20">
          {/* Session header */}
          <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">
            <span>Session — DHYAN.S / Toolkit_v02</span>
            <span className="hidden sm:inline">25 fps · 4 tracks</span>
          </div>

          {/* Ruler */}
          <div aria-hidden className="ml-44 hidden h-6 border-b border-white/10 lg:flex">
            {Array.from({ length: 24 }).map((_, i) => (
              <span key={i} className="relative flex-1 border-l border-white/10">
                {i % 4 === 0 && <span className="absolute left-1 top-1 font-mono text-[9px] text-white/30">00:{String(i * 2).padStart(2, '0')}</span>}
              </span>
            ))}
          </div>

          <div className="relative">
            {/* Playhead */}
            <div aria-hidden className="pointer-events-none absolute inset-y-0 left-44 right-0 z-10 hidden lg:block">
              <motion.div style={{ left: playhead }} className="absolute inset-y-0 w-px bg-secondary">
                <span className="absolute -left-[5px] -top-1 border-x-[5px] border-t-[7px] border-x-transparent border-t-secondary" />
              </motion.div>
            </div>

            {TRACKS.map((t, ti) => {
              const g = TOOLKIT.find((x) => x.id === t.group)!;
              const video = t.code.startsWith('V');
              return (
                <div key={t.code} className="flex flex-col border-b border-white/10 last:border-b-0 lg:flex-row">
                  <div className="flex shrink-0 items-center gap-3 border-white/10 px-3 py-2.5 lg:w-44 lg:border-r">
                    <span className={cn('font-display text-xl', video ? 'text-primary-glow' : 'text-secondary')}>{t.code}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">{g.label}</span>
                  </div>
                  {/* The row watches the viewport: a clip at scaleX(0) has no area to intersect */}
                  <motion.ul
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                    className="flex flex-1 flex-wrap gap-1 p-1.5 lg:flex-nowrap"
                    aria-label={g.label}
                  >
                    {g.tools.map((tool, i) => (
                      <motion.li
                        key={tool}
                        variants={{
                          hidden: { scaleX: 0 },
                          show: { scaleX: 1, transition: { duration: 0.8, delay: ti * 0.08 + i * 0.06, ease: [0.76, 0, 0.24, 1] } },
                        }}
                        style={{ flexGrow: tool.length + 6, transformOrigin: 'left' }}
                        onPointerEnter={() => setHover({ track: t.code, idx: i, tool, label: g.label })}
                        onPointerLeave={() => setHover(null)}
                        className={cn(
                          'group/clip relative min-w-0 cursor-default overflow-hidden border px-2.5 py-3 transition-colors duration-300 md:py-4',
                          video
                            ? 'border-primary/50 bg-primary/15 hover:bg-primary'
                            : 'border-secondary/50 bg-secondary/10 hover:bg-secondary'
                        )}
                      >
                        <span className="block truncate text-sm font-semibold tracking-tight md:text-[15px]">{tool}</span>
                        {/* Fake waveform / thumbnail strip */}
                        <span aria-hidden className={cn('mt-2 block h-1.5 opacity-50', video ? 'bg-[repeating-linear-gradient(90deg,currentColor_0_14px,transparent_14px_16px)]' : 'bg-[repeating-linear-gradient(90deg,currentColor_0_2px,transparent_2px_4px)]')} />
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>
              );
            })}
          </div>

          {/* Status bar */}
          <div className="flex min-h-9 items-center justify-between gap-4 border-t border-white/10 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/45" aria-live="polite">
            <span>{hover ? <><span className="text-secondary">{hover.track} · {String(hover.idx + 1).padStart(2, '0')}</span> — {hover.tool}</> : 'Hover a clip'}</span>
            <span className="hidden sm:inline">{hover ? hover.label : `${TOOLKIT.reduce((n, g) => n + g.tools.length, 0)} clips`}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
