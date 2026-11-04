import React, { useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import Chrome from './components/Chrome';
import TitleSequence, { shouldPlayTitles } from './components/TitleSequence';
import Home from './pages/Home';
import Work from './pages/Work';
import { RouterProvider, consumeHomeScroll, useRouter } from './lib/router';
import { initLenis, destroyLenis, scrollToSettled, scrollToTarget } from './lib/scroll';
import { useReducedMotion } from './lib/hooks';
import { getProject } from './data/site';

const CUT = [0.76, 0, 0.24, 1] as const;

/**
 * Route change as a cut: a black frame wipes across with the incoming
 * clip's name and timecode, the page swaps underneath, and the frame wipes off.
 */
function CutFrame() {
  // Read the live route so the outgoing frame names the clip we're cutting *to*
  const { path } = useRouter();
  const m = path.match(/^\/work\/([^/]+)/);
  const label = m ? getProject(decodeURIComponent(m[1]))?.short ?? 'Offline' : 'DJ79.drp';
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[96] flex items-end justify-between bg-ink-3 p-5 md:p-8"
      variants={{
        initial: { clipPath: 'inset(0 0 0 0)' },
        enter: { clipPath: 'inset(0 0 0 100%)', transition: { duration: 0.7, ease: CUT, delay: 0.1 } },
        exit: { clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'], transition: { duration: 0.55, ease: CUT } },
      }}
    >
      <span className="text-[clamp(2rem,6vw,5rem)] font-semibold tracking-[-0.05em] text-paper">{label}</span>
      <span className="h-3 w-3 rounded-full bg-orange" />
    </motion.div>
  );
}

function Routes({ ready }: { ready: boolean }) {
  const { path, hash } = useRouter();
  const match = path.match(/^\/work\/([^/]+)\/?$/);
  const id = match ? decodeURIComponent(match[1]) : null;

  useEffect(() => {
    document.title = id && getProject(id)
      ? `${getProject(id)!.title} · Dhyan Salavi`
      : 'Dhyan Salavi · DJ79.drp — Short-form Video Editor';
  }, [id]);

  // Deep links like /#contact on first load
  useEffect(() => {
    if (!id && hash && ready) scrollToSettled(hash.slice(1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const onExitComplete = () => {
    if (id) return scrollToTarget(0, { immediate: true });
    const saved = consumeHomeScroll();
    requestAnimationFrame(() => (hash ? scrollToSettled(hash.slice(1)) : scrollToSettled(saved ?? 0)));
  };

  return (
    <AnimatePresence mode="wait" initial={false} onExitComplete={onExitComplete}>
      <motion.div key={id ?? 'home'} initial="initial" animate="enter" exit="exit">
        {id ? <Work id={id} /> : <Home ready={ready} />}
        <CutFrame />
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const reduced = useReducedMotion();
  const [titles, setTitles] = useState(() => window.location.pathname === '/' && !window.location.hash && shouldPlayTitles());

  useEffect(() => {
    initLenis(reduced);
    return () => destroyLenis();
  }, [reduced]);

  return (
    <MotionConfig reducedMotion="user">
      <RouterProvider>
        <div className="grain relative">
          <a href="#selects" className="label sr-only fixed left-4 top-4 z-[120] bg-paper p-3 text-ink focus:not-sr-only">
            Skip to the work
          </a>
          <Chrome />
          <Routes ready={!titles} />
          {titles && <TitleSequence onDone={() => setTitles(false)} />}
        </div>
      </RouterProvider>
    </MotionConfig>
  );
}
