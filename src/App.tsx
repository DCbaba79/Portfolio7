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
import { scrollToTarget } from './lib/scroll';

const WIPE = [0.83, 0, 0.17, 1] as const;

/** Two-layer colour wipe between routes, in the brand teal and orange. */
function Curtain() {
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[95] bg-secondary"
        variants={{
          initial: { scaleY: 1, transformOrigin: '50% 0%' },
          enter: { scaleY: 0, transformOrigin: '50% 0%', transition: { duration: 0.7, ease: WIPE, delay: 0.05 } },
          exit: { scaleY: 1, transformOrigin: '50% 100%', transition: { duration: 0.55, ease: WIPE } },
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[96] flex items-center justify-center bg-primary"
        variants={{
          initial: { scaleY: 1, transformOrigin: '50% 0%' },
          enter: { scaleY: 0, transformOrigin: '50% 0%', transition: { duration: 0.7, ease: WIPE, delay: 0.15 } },
          exit: { scaleY: 1, transformOrigin: '50% 100%', transition: { duration: 0.55, ease: WIPE, delay: 0.08 } },
        }}
      >
        <span className="font-display text-sm font-bold tracking-[0.3em] text-white/80">DHYAN.S</span>
      </motion.div>
    </>
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
      if (hash) scrollToTarget(hash.slice(1), { immediate: true });
      else scrollToTarget(saved ?? 0, { immediate: true });
    });
  };

  return (
    <AnimatePresence mode="wait" initial={false} onExitComplete={onExitComplete}>
      <motion.div key={match ? `work-${match[1]}` : 'home'} initial="initial" animate="enter" exit="exit">
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
