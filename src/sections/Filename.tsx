import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PROFILE } from '../data/site';
import { Fade, Line } from '../components/Reveal';
import { cn } from '../lib/utils';

const PARTS = [
  { key: 'D', text: 'D', title: 'Dhyan', body: 'My name.' },
  {
    key: 'J',
    text: 'J',
    title: 'My father’s initial',
    body: 'In Gujarati and Marathi homes, your father’s name is your middle name. He’s in every file I save.',
  },
  { key: '79', text: '79', title: 'Seventy-nine', body: 'My favourite number. No deeper reason, and that’s fine.' },
  {
    key: 'drp',
    text: '.drp',
    title: 'A DaVinci Resolve project file',
    body: 'The extension Resolve gives a project. Where everything I make begins, and the program I cut it all in.',
  },
];

/** The alias, read like a filename: every character has a reason. */
export default function Filename() {
  const [on, setOn] = useState<string | null>(null);

  return (
    <section id="file" className="safe-x relative pb-32 pt-28 md:pb-44 md:pt-40">
      <div className="mb-10 flex items-center justify-between border-b border-paper/10 pb-4 md:mb-16">
        <span className="label text-paper/45">01 — Reading the filename</span>
        <span className="label hidden text-paper/45 md:block">Project · {PROFILE.file}</span>
      </div>

      <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-8">
          {/* the filename itself */}
          <div
            className="flex flex-wrap items-baseline leading-[0.8]"
            onMouseLeave={() => setOn(null)}
            role="list"
            aria-label={`${PROFILE.file}, explained`}
          >
            {PARTS.map((p, n) => (
              <motion.button
                key={p.key}
                type="button"
                role="listitem"
                onMouseEnter={() => setOn(p.key)}
                onFocus={() => setOn(p.key)}
                onBlur={() => setOn(null)}
                onClick={() => setOn((v) => (v === p.key ? null : p.key))}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -15% 0px' }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: n * 0.08 }}
                aria-label={`${p.text}: ${p.title}`}
                className={cn(
                  'relative text-[clamp(5rem,19vw,17rem)] transition-colors duration-500',
                  p.key === 'drp' ? 'tc font-normal tracking-[-0.06em]' : 'display',
                  on === null
                    ? p.key === 'drp' ? 'text-teal-3' : 'text-paper'
                    : on === p.key
                      ? p.key === 'drp' ? 'text-teal-3' : 'text-orange'
                      : 'text-paper/12'
                )}
              >
                {p.text}
              </motion.button>
            ))}
          </div>

          {/* annotations */}
          <ol className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 xl:grid-cols-4">
            {PARTS.map((p, n) => (
              <li
                key={p.key}
                className={cn(
                  'border-t pt-4 transition-colors duration-500',
                  on === p.key ? 'border-orange' : 'border-paper/15',
                  on && on !== p.key && 'opacity-40'
                )}
              >
                <span className="tc text-[11px] text-paper/40">
                  {String(n + 1).padStart(2, '0')} · {p.text}
                </span>
                <h3 className="mt-2 text-[17px] font-semibold tracking-[-0.02em]">{p.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-paper/60">{p.body}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* the raccoon */}
        <Fade className="relative lg:col-span-4 lg:pt-6" y={50}>
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
            <figcaption className="mt-4 flex gap-4">
              <span className="label shrink-0 pt-1 text-orange">Mascot</span>
              <span className="text-[14px] leading-relaxed text-paper/65">
                The raccoon: nocturnal, a little mischievous, does its best work after midnight. Like every
                editor on a deadline.
              </span>
            </figcaption>
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
