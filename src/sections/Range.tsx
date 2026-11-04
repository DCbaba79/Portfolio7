import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { RANGE, getProject } from '../data/site';
import { Line } from '../components/Reveal';
import { Link } from '../lib/router';
import { useFinePointer } from '../lib/hooks';
import { cn } from '../lib/utils';

/**
 * The one bright section: a flash frame between dark scenes.
 * Hovering a register cuts its footage into the frame on the right.
 */
export default function Range() {
  const [on, setOn] = useState(0);
  const fine = useFinePointer();
  const current = getProject(RANGE[on].seenIn[0])!;

  return (
    <section id="range" className="safe-x relative bg-paper py-24 text-ink md:py-36">
      <div className="flex items-center justify-between border-b border-ink/15 pb-4">
        <span className="label text-ink/50">05 — Range</span>
        <span className="label text-ink/50">Three registers</span>
      </div>

      <h2 className="mt-10 max-w-4xl text-[clamp(2.2rem,5.6vw,5.6rem)] font-medium leading-[0.95] tracking-[-0.045em] md:mt-14">
        <Line>One editor,</Line>
        <Line delay={0.08}>
          <span className="font-serif italic text-teal">three tempos.</span>
        </Line>
      </h2>

      <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12">
        <ol className="lg:col-span-7">
          {RANGE.map((r, i) => (
            <li key={r.id} className="border-t border-ink/15 last:border-b">
              <div
                onMouseEnter={() => fine && setOn(i)}
                onFocus={() => setOn(i)}
                onClick={() => setOn(i)}
                tabIndex={0}
                className="group grid cursor-default grid-cols-[2.2rem_1fr] gap-x-4 py-6 md:grid-cols-[3rem_1fr_auto] md:py-8"
              >
                <span className="tc pt-2 text-[12px] text-ink/40">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3
                    className={cn(
                      'text-[clamp(2.4rem,6vw,5.4rem)] font-extrabold uppercase leading-[0.85] tracking-[-0.05em] transition-colors duration-500',
                      on === i ? 'text-ink' : 'text-ink/25'
                    )}
                  >
                    {r.label}
                  </h3>
                  <div
                    className={cn(
                      'grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(.16,1,.3,1)]',
                      on === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="mt-4 max-w-lg text-[15.5px] leading-relaxed text-ink/70">{r.line}</p>
                      <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                        <span className="label text-ink/45">Seen in</span>
                        {r.seenIn.map((id) => {
                          const p = getProject(id)!;
                          return (
                            <Link key={id} to={`/work/${id}`} className="border-b border-ink/30 text-[14px] font-medium transition-colors hover:border-orange hover:text-orange">
                              {p.short}
                            </Link>
                          );
                        })}
                      </p>
                    </div>
                  </div>
                </div>
                <span className="label col-start-2 mt-3 text-ink/45 md:col-start-3 md:mt-3">{r.tempo}</span>
              </div>
            </li>
          ))}
        </ol>

        <div className="lg:col-span-4 lg:col-start-9">
          <div className="lg:sticky lg:top-28">
            <div className="frame mx-auto aspect-[4/5] w-full max-w-sm">
              <AnimatePresence initial={false}>
                <motion.video
                  key={current.id}
                  src={current.loop}
                  poster={current.poster}
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="none"
                  aria-label={`${current.short} preview`}
                  className="absolute inset-0 h-full w-full object-cover"
                  initial={{ clipPath: 'inset(0 0 0 100%)' }}
                  animate={{ clipPath: 'inset(0 0 0 0%)' }}
                  exit={{ opacity: 1 }}
                  transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
                />
              </AnimatePresence>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between bg-gradient-to-t from-ink/80 to-transparent p-3 pt-10">
                <span className="tc text-[11px] text-paper">{current.short}</span>
                <span className="tc text-[11px] text-paper/70">{RANGE[on].tempo}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
