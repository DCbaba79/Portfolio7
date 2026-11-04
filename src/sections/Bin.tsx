import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react';
import { ARCHIVE } from '../data/site';
import { Line } from '../components/Reveal';
import { Link } from '../lib/router';
import { useFinePointer } from '../lib/hooks';
import { cn } from '../lib/utils';

/**
 * The media bin: everything else, listed like clips in a bin.
 * On desktop a preview monitor trails the cursor and cuts between rows.
 */
export default function Bin() {
  const fine = useFinePointer();
  const [hover, setHover] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 26, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 220, damping: 26, mass: 0.6 });
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!fine) return;
    const onMove = (e: MouseEvent) => {
      // trail the cursor loosely, but keep clear of the clip names on the left
      x.set(Math.min(window.innerWidth - 340, window.innerWidth * 0.5 + e.clientX * 0.18));
      y.set(e.clientY);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [fine, x, y]);

  const p = hover !== null ? ARCHIVE[hover] : null;

  return (
    <section id="bin" className="safe-x relative py-28 md:py-40">
      <div className="flex items-center justify-between border-b border-paper/10 pb-4">
        <span className="label text-paper/45">05 — The bin</span>
        <span className="label text-paper/45">{ARCHIVE.length} clips</span>
      </div>

      <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-12">
        <h2 className="text-[clamp(2.2rem,5.4vw,5.4rem)] font-medium leading-[0.95] tracking-[-0.045em] md:col-span-7">
          <Line>More from</Line>
          <Line delay={0.08}>
            <span className="accent accent-hover">the bin.</span>
          </Line>
        </h2>
        <p className="self-end text-[14px] leading-relaxed text-paper/55 md:col-span-4 md:col-start-9">
          Commercials, recaps and music. Not every cut needs a whole scene, but every one is worth a look.
        </p>
      </div>

      {/* column heads, like a bin in list view */}
      <div className="label mt-16 hidden grid-cols-12 gap-4 border-b border-paper/10 pb-3 text-paper/35 md:grid">
        <span className="col-span-1">#</span>
        <span className="col-span-5">Clip name</span>
        <span className="col-span-3">Type</span>
        <span className="col-span-2">Format</span>
        <span className="col-span-1 text-right">Dur.</span>
      </div>

      <div ref={wrap} onMouseLeave={() => setHover(null)}>
        {ARCHIVE.map((item, i) => (
          <Link
            key={item.id}
            to={`/work/${item.id}`}
            onMouseEnter={() => fine && setHover(i)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
            className="group relative grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-1 border-b border-paper/10 py-5 md:grid-cols-12 md:gap-4 md:py-7"
          >
            {/* mobile thumbnail */}
            <img
              src={item.poster}
              alt=""
              loading="lazy"
              className="row-span-2 h-16 w-16 object-cover md:hidden"
            />
            <span className="tc hidden text-[12px] text-paper/35 md:col-span-1 md:block">{String(i + 1).padStart(3, '0')}</span>
            <span
              className={cn(
                'text-[clamp(1.5rem,3.6vw,3.2rem)] font-semibold leading-none tracking-[-0.04em] transition-[color,transform] duration-500 ease-[cubic-bezier(.16,1,.3,1)] md:col-span-5',
                hover === i ? 'text-orange md:translate-x-3' : hover !== null ? 'text-paper/30' : 'text-paper'
              )}
            >
              {item.short}
            </span>
            <span className="text-[13px] text-paper/55 md:col-span-3">{item.category}</span>
            <span className="hidden text-[13px] text-paper/55 md:col-span-2 md:block">{item.format}</span>
            <span className="tc hidden text-right text-[12px] text-paper/45 md:col-span-1 md:block">{item.duration ?? '—'}</span>
          </Link>
        ))}
      </div>

      {/* cursor-trailing monitor */}
      {fine && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-[60] w-[300px]"
          style={{ x: sx, y: sy, translateX: '24px', translateY: '-50%' }}
        >
          <AnimatePresence>
            {p && (
              <motion.div
                key="monitor"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden border border-paper/15 bg-ink shadow-2xl"
              >
                <div className={cn('relative w-full', p.aspect === '9/16' ? 'aspect-[4/5]' : 'aspect-video')}>
                  {ARCHIVE.map((a, i) =>
                    a.loop ? (
                      <video
                        key={a.id}
                        src={a.loop}
                        muted
                        loop
                        playsInline
                        autoPlay
                        preload="auto"
                        className={cn('absolute inset-0 h-full w-full object-cover', hover === i ? 'opacity-100' : 'opacity-0')}
                      />
                    ) : (
                      <img
                        key={a.id}
                        src={a.poster}
                        alt=""
                        className={cn('absolute inset-0 h-full w-full object-cover', hover === i ? 'opacity-100' : 'opacity-0')}
                      />
                    )
                  )}
                </div>
                <div className="flex justify-between px-2.5 py-1.5">
                  <span className="tc text-[10px] text-paper/70">{p.short}</span>
                  <span className="tc text-[10px] text-orange">● PREVIEW</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}
