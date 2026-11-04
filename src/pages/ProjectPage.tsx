import { motion } from 'motion/react';
import { ArrowLeft, ArrowUpRight, Play } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { PROJECTS, getVideoSource, Project } from '../constants';
import { Link } from '../lib/router';
import { MaskLines, FadeUp } from '../components/ui/Reveal';
import Magnetic from '../components/ui/Magnetic';

const EASE = [0.16, 1, 0.3, 1] as const;

/** Poster-first player: nothing heavy loads until the visitor asks for it. */
function Player({ project }: { project: Project }) {
  const source = getVideoSource(project.videoUrl);
  const [playing, setPlaying] = useState(false);

  useEffect(() => setPlaying(false), [project.id]);

  return (
    <div className="viewfinder p-2 md:p-3">
      <div className="relative aspect-video overflow-hidden bg-black">
        {playing && source.kind === 'drive' && (
          <iframe
            src={source.embed}
            title={`${project.title} — video`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        )}
        {playing && source.kind === 'file' && (
          <video src={source.src} poster={project.thumbnail} controls autoPlay playsInline className="absolute inset-0 h-full w-full bg-black object-contain" />
        )}

        {!playing && (
          <>
            <motion.img
              src={project.thumbnail}
              alt={`${project.title} — poster frame`}
              initial={{ scale: 1.15 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.6, ease: EASE }}
              className="absolute inset-0 h-full w-full object-cover"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />

            {(source.kind === 'drive' || source.kind === 'file') && (
              <button
                onClick={() => setPlaying(true)}
                data-cursor="Play"
                aria-label={`Play ${project.title}`}
                className="group absolute inset-0 flex items-center justify-center"
              >
                <span className="flex h-20 w-20 items-center justify-center bg-primary text-white shadow-2xl shadow-primary/40 transition-transform duration-500 ease-out-expo group-hover:scale-110 md:h-28 md:w-28">
                  <Play size={30} className="ml-1 fill-white" />
                </span>
              </button>
            )}

            {source.kind === 'external' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/70">Hosted on {source.platform}</p>
                <a
                  href={source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary px-6 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-secondary"
                >
                  Watch on {source.platform} <ArrowUpRight size={16} />
                </a>
              </div>
            )}

            {source.kind === 'none' && (
              <div className="absolute bottom-4 left-4 rounded-sm bg-ink/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-primary-glow backdrop-blur">
                Commercial production cut — still frame
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ProjectPage({ id }: { id: string }) {
  const index = PROJECTS.findIndex((p) => p.id === id);
  const project = PROJECTS[index];

  useEffect(() => {
    if (project) document.title = `${project.title} — Dhyan Salavi`;
    return () => { document.title = 'Dhyan Salavi — Video Editor & Motion Designer'; };
  }, [project]);

  if (!project) {
    return (
      <section className="flex min-h-[100svh] flex-col items-start justify-center px-4 md:px-10">
        <p className="eyebrow">404 — Missing footage</p>
        <h1 className="mt-6 font-display text-[clamp(3.5rem,14vw,12rem)] uppercase leading-[0.92]">Clip not found</h1>
        <Link to="/#work" className="mt-10 inline-flex items-center gap-2 border border-white/20 px-6 py-4 text-sm uppercase tracking-[0.14em] hover:bg-white hover:text-ink">
          <ArrowLeft size={16} /> Back to work
        </Link>
      </section>
    );
  }

  const next = PROJECTS[(index + 1) % PROJECTS.length];
  const source = getVideoSource(project.videoUrl);
  const watchHref = source.kind === 'drive' ? source.href : source.kind === 'external' ? source.href : source.kind === 'file' ? source.src : '';

  return (
    <article className="relative px-4 pb-32 pt-28 md:px-10 md:pt-36">
      {/* Full-bleed backdrop: the project's own still, pushed into the dark */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[110vh] overflow-hidden">
        <motion.img
          key={project.id}
          src={project.thumbnail}
          alt=""
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1.05, opacity: 0.32 }}
          transition={{ duration: 1.8, ease: EASE }}
          className="h-full w-full object-cover blur-[2px] grayscale-[40%]"
        />
        <div className="scanlines absolute inset-0 opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/70 to-ink" />
      </div>
      <span aria-hidden className="text-outline pointer-events-none absolute right-2 top-20 font-display text-[38vw] leading-none opacity-20 md:right-8 md:text-[26vw]">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="relative mx-auto max-w-[1600px]">
        <div className="flex items-center justify-between gap-4">
          <Link to="/#work" className="group inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-white/60 hover:text-white">
            <ArrowLeft size={16} className="transition-transform duration-500 group-hover:-translate-x-1" /> All work
          </Link>
          <span className="font-mono text-[11px] tabular-nums text-white/40">
            {String(index + 1).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')}
          </span>
        </div>

        <header className="mt-12 md:mt-16">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="eyebrow">
            <span className="text-secondary">{project.category}</span> — {project.role}
          </motion.p>
          <h1 className="mt-5 font-display text-[clamp(3.4rem,12vw,13rem)] uppercase leading-[0.92]">
            <MaskLines immediate delay={0.15} lines={[project.title]} />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9, ease: EASE }}
            className="mt-6 max-w-2xl font-serif text-2xl italic text-white/75 md:text-3xl"
          >
            {project.logline}
          </motion.p>
        </header>

        <motion.div
          initial={{ clipPath: 'inset(12% 4% 12% 4%)', opacity: 0 }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
          transition={{ duration: 1.3, ease: [0.83, 0, 0.17, 1], delay: 0.35 }}
          className="mt-12 md:mt-16"
        >
          <Player project={project} />
        </motion.div>

        <div className="mt-16 grid grid-cols-12 gap-y-12 md:mt-24 lg:gap-x-8">
          <FadeUp className="col-span-12 lg:col-span-7">
            <p className="eyebrow">Overview</p>
            <p className="mt-5 text-[clamp(1.25rem,2.2vw,2rem)] leading-snug tracking-[-0.01em] text-paper">{project.description}</p>
          </FadeUp>

          <FadeUp delay={0.1} className="col-span-12 lg:col-span-4 lg:col-start-9">
            <dl className="divide-y divide-white/10 border-y border-white/10">
              {[
                ['Category', project.category],
                ['Role', project.role],
                ['Format', source.kind === 'external' ? `${source.platform} release` : source.kind === 'none' ? 'Commercial reel' : 'Video'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 py-4">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">{k}</dt>
                  <dd className="text-right text-sm">{v}</dd>
                </div>
              ))}
              <div className="py-4">
                <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">Craft</dt>
                <dd className="mt-3 flex flex-wrap gap-2">
                  {project.skills.map((s) => (
                    <span key={s} className="border border-white/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-white/80">{s}</span>
                  ))}
                </dd>
              </div>
            </dl>
            {watchHref && (
              <a
                href={watchHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-full items-center justify-between border border-white/20 px-6 py-4 text-sm font-semibold uppercase tracking-[0.14em] transition-colors hover:border-secondary hover:bg-secondary"
              >
                Open original <ArrowUpRight size={16} />
              </a>
            )}
          </FadeUp>
        </div>

        {/* Next project */}
        <Link to={`/work/${next.id}`} data-cursor="Next" className="group mt-28 block border-t border-white/10 pt-10 md:mt-40">
          <p className="eyebrow">Next project</p>
          <div className="mt-6 grid grid-cols-12 items-end gap-6 lg:gap-8">
            <h2 className="col-span-12 font-display text-[clamp(3rem,10vw,10rem)] uppercase leading-[0.92] transition-colors duration-500 group-hover:text-primary-glow lg:col-span-8">
              {next.title}
            </h2>
            <div className="col-span-12 overflow-hidden lg:col-span-4">
              <img
                src={next.thumbnail}
                alt=""
                loading="lazy"
                className="aspect-[16/10] w-full object-cover grayscale transition duration-1000 ease-out-expo group-hover:scale-105 group-hover:grayscale-0"
              />
            </div>
          </div>
        </Link>

        <div className="mt-16 flex justify-center">
          <Magnetic>
            <Link to="/#contact" className="inline-flex items-center gap-2 bg-paper px-6 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-secondary hover:text-white">
              Start a project <ArrowUpRight size={16} />
            </Link>
          </Magnetic>
        </div>
      </div>
    </article>
  );
}
