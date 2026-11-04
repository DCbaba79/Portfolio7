import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import React, { useMemo, useRef, useState } from 'react';
import { PROJECTS, Project } from '../../constants';
import { cn } from '../../lib/utils';
import { Link } from '../../lib/router';
import { useFinePointer } from '../../lib/hooks';
import { MaskLines, SectionTag } from '../ui/Reveal';

/**
 * Layout slots for the editorial grid — each project gets its own
 * proportion and placement rather than an identical card.
 */
const SLOTS = [
  { wrap: 'lg:col-span-12', aspect: 'aspect-[4/3] md:aspect-[21/9]', variant: 'feature' },
  { wrap: 'lg:col-span-7', aspect: 'aspect-[4/3]', variant: 'caption' },
  { wrap: 'lg:col-span-4 lg:col-start-9 lg:mt-40', aspect: 'aspect-[4/5]', variant: 'caption' },
  { wrap: 'lg:col-span-5 lg:col-start-2 lg:-mt-16', aspect: 'aspect-square', variant: 'side' },
  { wrap: 'lg:col-span-5 lg:col-start-8 lg:mt-24', aspect: 'aspect-[16/10]', variant: 'caption' },
  { wrap: 'lg:col-span-10 lg:col-start-2', aspect: 'aspect-[4/3] md:aspect-[2/1]', variant: 'feature' },
] as const;

function ProjectMedia({ project, aspect, priority }: { project: Project; aspect: string; priority?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  return (
    <motion.div
      ref={ref}
      initial={{ clipPath: 'inset(18% 6% 18% 6%)' }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.3, ease: [0.83, 0, 0.17, 1] }}
      className={cn('relative overflow-hidden bg-ink-2', aspect)}
    >
      <motion.img
        style={{ y }}
        src={project.thumbnail}
        alt={`${project.title} — still`}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className="absolute inset-[-8%] h-[116%] w-[116%] object-cover transition-[transform,filter] duration-[1.2s] ease-out-expo group-hover:scale-[1.06] md:grayscale-[35%] md:group-hover:grayscale-0"
      />
      {/* Teal wash that sweeps away on hover */}
      <div className="pointer-events-none absolute inset-0 bg-primary/25 mix-blend-color transition-[clip-path] duration-700 ease-out-expo [clip-path:inset(0_0_0_0)] group-hover:[clip-path:inset(0_0_0_100%)] max-md:hidden" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
    </motion.div>
  );
}

function Meta({ project, index }: { project: Project; index: number }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">
      <span className="text-secondary">{String(index + 1).padStart(2, '0')}</span>
      <span>{project.category}</span>
      <span className="h-px w-6 bg-white/20" />
      <span>{project.role}</span>
    </div>
  );
}

function ShowcaseItem({ project, index, slot }: { project: Project; index: number; slot: (typeof SLOTS)[number] }) {
  const to = `/work/${project.id}`;

  if (slot.variant === 'feature') {
    return (
      <article className={cn('col-span-12', slot.wrap)}>
        <Link to={to} data-cursor="View" className="group block" aria-label={`${project.title} — view project`}>
          <div className="relative">
            <ProjectMedia project={project} aspect={slot.aspect} priority={index === 0} />
            <div className="relative mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-4 lg:absolute lg:inset-x-0 lg:bottom-0 lg:mt-0 lg:p-8">
              <div className="max-w-3xl">
                <Meta project={project} index={index} />
                <h3 className="mt-3 font-display text-[clamp(1.6rem,5vw,4.5rem)] font-bold uppercase leading-[0.95] tracking-[-0.03em]">
                  {project.title}
                </h3>
              </div>
              <p className="max-w-xs text-sm text-white/60 md:text-right lg:text-white/70">{project.logline}</p>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (slot.variant === 'side') {
    return (
      <article className={cn('col-span-12', slot.wrap)}>
        <Link to={to} data-cursor="View" className="group grid grid-cols-1 gap-5" aria-label={`${project.title} — view project`}>
          <ProjectMedia project={project} aspect={slot.aspect} />
          <div className="flex items-start justify-between gap-6 border-t border-white/10 pt-4">
            <div>
              <Meta project={project} index={index} />
              <h3 className="mt-3 font-serif text-3xl italic leading-tight text-paper transition-colors duration-500 group-hover:text-secondary md:text-4xl">
                {project.title}
              </h3>
              <p className="mt-2 max-w-sm text-sm text-white/55">{project.logline}</p>
            </div>
            <ArrowUpRight className="mt-1 shrink-0 text-white/40 transition-all duration-500 group-hover:rotate-45 group-hover:text-secondary" />
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className={cn('col-span-12', slot.wrap)}>
      <Link to={to} data-cursor="View" className="group block" aria-label={`${project.title} — view project`}>
        <ProjectMedia project={project} aspect={slot.aspect} />
        <div className="mt-4 flex items-start justify-between gap-6">
          <div>
            <Meta project={project} index={index} />
            <h3 className="mt-2 text-2xl font-semibold tracking-tight transition-colors duration-500 group-hover:text-primary-glow md:text-3xl">
              {project.title}
            </h3>
          </div>
          <span className="mt-1 hidden max-w-[14rem] text-right text-sm text-white/50 sm:block">{project.logline}</span>
        </div>
      </Link>
    </article>
  );
}

/** Text index with a preview that follows the cursor on desktop. */
function IndexList({ projects }: { projects: Project[] }) {
  const fine = useFinePointer();
  const [hovered, setHovered] = useState<Project | null>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 250, damping: 30 });
  const y = useSpring(useMotionValue(0), { stiffness: 250, damping: 30 });

  return (
    <div
      className="relative"
      onPointerMove={(e) => {
        x.set(e.clientX);
        y.set(e.clientY);
      }}
      onPointerLeave={() => setHovered(null)}
    >
      <ul className="border-t border-white/10">
        {projects.map((p) => (
          <li key={p.id} onPointerEnter={() => setHovered(p)}>
            <Link
              to={`/work/${p.id}`}
              data-cursor="View"
              className="group grid grid-cols-12 items-center gap-4 border-b border-white/10 py-6 transition-colors duration-500 hover:bg-white/[0.02] md:py-8"
            >
              <span className="col-span-2 font-mono text-xs text-secondary md:col-span-1">{String(PROJECTS.indexOf(p) + 1).padStart(2, '0')}</span>
              <span className="col-span-10 font-display text-xl font-bold uppercase leading-none tracking-[-0.02em] transition-transform duration-700 ease-out-expo group-hover:translate-x-3 md:col-span-6 md:text-4xl">
                {p.title}
              </span>
              {!fine && (
                <img src={p.thumbnail} alt="" loading="lazy" className="col-span-12 aspect-video w-full object-cover md:hidden" />
              )}
              <span className="col-span-6 font-mono text-[10px] uppercase tracking-[0.25em] text-white/50 md:col-span-2">{p.category}</span>
              <span className="col-span-6 text-right font-mono text-[10px] uppercase tracking-[0.25em] text-white/50 md:col-span-3">{p.role}</span>
            </Link>
          </li>
        ))}
      </ul>

      {fine && (
        <motion.div
          aria-hidden
          style={{ x, y }}
          className="pointer-events-none fixed left-0 top-0 z-30 hidden md:block"
        >
          <AnimatePresence>
            {hovered && (
              <motion.img
                key={hovered.id}
                src={hovered.thumbnail}
                alt=""
                initial={{ opacity: 0, scale: 0.8, rotate: -4 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="absolute -translate-x-1/2 -translate-y-1/2 aspect-[16/10] w-[340px] object-cover shadow-2xl shadow-black/60"
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [view, setView] = useState<'showcase' | 'index'>('showcase');

  const categories = useMemo(() => ['All', ...Array.from(new Set(PROJECTS.map((p) => p.category)))], []);
  const filtered = useMemo(
    () => (activeCategory === 'All' ? PROJECTS : PROJECTS.filter((p) => p.category === activeCategory)),
    [activeCategory]
  );

  return (
    <section id="work" className="relative px-4 py-24 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid grid-cols-12 gap-y-8 lg:gap-8">
          <div className="col-span-12 lg:col-span-7">
            <SectionTag index="01" label="Selected Work" />
            <h2 className="mt-6 font-display text-[clamp(2.4rem,8vw,7.5rem)] font-bold uppercase leading-[0.9] tracking-[-0.04em]">
              <MaskLines lines={[<>Curated</>, <><span className="orange-to-teal normal-case tracking-normal">show</span>reel</>]} />
            </h2>
          </div>
          <div className="col-span-12 flex flex-col justify-end gap-6 lg:col-span-5">
            <p className="max-w-md text-white/55 lg:ml-auto lg:text-right">
              Commercials, explainers, music and event films — each cut with intent: pacing, color and sound working toward one story.
            </p>
            <div className="flex flex-wrap items-center gap-2 lg:justify-end" role="group" aria-label="View mode">
              {(['showcase', 'index'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  aria-pressed={view === v}
                  className={cn(
                    'rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] transition-colors',
                    view === v ? 'border-paper bg-paper text-ink' : 'border-white/15 text-white/60 hover:border-white/40 hover:text-white'
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex gap-2 overflow-x-auto border-y border-white/10 py-3 scrollbar-none md:mt-14" role="group" aria-label="Filter by category">
          {categories.map((cat) => {
            const count = cat === 'All' ? PROJECTS.length : PROJECTS.filter((p) => p.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                aria-pressed={activeCategory === cat}
                className={cn(
                  'flex shrink-0 items-start gap-1 rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] transition-colors',
                  activeCategory === cat ? 'bg-primary text-white' : 'text-white/50 hover:text-white'
                )}
              >
                {cat}
                <sup className="font-mono text-[9px] opacity-60">{count}</sup>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${view}-${activeCategory}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 md:mt-20"
          >
            {view === 'showcase' ? (
              <div className="grid grid-cols-12 gap-y-16 md:gap-y-24 lg:gap-x-8">
                {filtered.map((p, i) => (
                  <ShowcaseItem key={p.id} project={p} index={PROJECTS.indexOf(p)} slot={SLOTS[i % SLOTS.length]} />
                ))}
              </div>
            ) : (
              <IndexList projects={filtered} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
