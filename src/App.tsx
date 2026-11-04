/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import Layout from './components/layout/Layout';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import ProjectPage from './pages/ProjectPage';
import { RouterProvider, useRouter, consumeHomeScroll } from './lib/router';
import { scrollToTarget, scrollToSettled } from './lib/scroll';

const WIPE = [0.76, 0, 0.24, 1] as const;

/**
 * One continuous curtain between routes: it rises to cover, the scroll resets
 * underneath, and it keeps rising to reveal — a single motion, like a wipe in the edit.
 */
function Curtain() {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[96] flex items-center justify-center bg-primary will-change-transform"
      variants={{
        initial: { y: '0%' },
        enter: { y: '-100%', transition: { duration: 0.75, ease: WIPE, delay: 0.08 } },
        exit: { y: ['100%', '0%'], transition: { duration: 0.6, ease: WIPE } },
      }}
    >
      <span className="font-brand text-sm font-bold tracking-[0.3em] text-white/80">DHYAN.S</span>
    </motion.div>
  );
}

function Routes() {
  const { path, hash } = useRouter();
  const match = path.match(/^\/work\/([^/]+)\/?$/);

  const onExitComplete = () => {
    if (match) {
      scrollToTarget(0, { immediate: true });
      return;
    }
    const saved = consumeHomeScroll();
    requestAnimationFrame(() => {
      if (hash) scrollToSettled(hash.slice(1));
      else scrollToSettled(saved ?? 0);
    });
  };

  return (
    <AnimatePresence mode="wait" initial={false} onExitComplete={onExitComplete}>
      <motion.div
        key={match ? `work-${match[1]}` : 'home'}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        {match ? <ProjectPage id={decodeURIComponent(match[1])} /> : <Home />}
        <Curtain />
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <RouterProvider>
        <Layout>
          <Navbar />
          <Routes />
        </Layout>
      </RouterProvider>
    </MotionConfig>
  );
}
