/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Layout from './components/layout/Layout';
import Navbar from './components/layout/Navbar';
import Hero from './components/sections/Hero';
import Portfolio from './components/sections/Portfolio';
import Experience from './components/sections/Experience';
import Skills from './components/sections/Skills';
import Contact from './components/sections/Contact';
import FloatingAvatar from './components/FloatingAvatar';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial asset loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6"
          >
            <div className="relative mb-8">
              <motion.div
                className="w-24 h-24 rounded-full border-4 border-white/5 border-t-primary animate-spin"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-0 flex items-center justify-center p-1">
                <div className="w-full h-full rounded-full overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center relative shadow-2xl shadow-primary/20">
                  {/* Base Grayscale Logo */}
                  <img 
                    src="https://i.postimg.cc/50nzByRk/Chat-GPT-Image-May-2-2026-12-06-49-AM.png" 
                    alt="Logo Base" 
                    className="w-full h-full object-cover grayscale opacity-30"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  
                  {/* Animated Color Fill Layer */}
                  <motion.div 
                    className="absolute inset-0 z-10"
                    initial={{ clipPath: 'polygon(0% 100%, 25% 100%, 50% 100%, 75% 100%, 100% 100%, 100% 100%, 0% 100%)' }}
                    animate={{ 
                      clipPath: [
                        'polygon(0% 100%, 25% 100%, 50% 100%, 75% 100%, 100% 100%, 100% 100%, 0% 100%)',
                        'polygon(0% 75%, 25% 82%, 50% 70%, 75% 85%, 100% 75%, 100% 100%, 0% 100%)',
                        'polygon(0% 45%, 25% 38%, 50% 52%, 75% 41%, 100% 48%, 100% 100%, 0% 100%)',
                        'polygon(0% 15%, 25% 22%, 50% 12%, 75% 25%, 100% 18%, 100% 100%, 0% 100%)',
                        'polygon(0% 0%, 25% 0%, 50% 0%, 75% 0%, 100% 0%, 100% 100%, 0% 100%)'
                      ]
                    }}
                    transition={{ duration: 2.8, ease: [0.45, 0.05, 0.55, 0.95] }}
                  >
                    <img 
                      src="https://i.postimg.cc/50nzByRk/Chat-GPT-Image-May-2-2026-12-06-49-AM.png" 
                      alt="Logo Fill" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement?.parentElement;
                        if (parent && !parent.querySelector('.fallback-text')) {
                          const span = document.createElement('span');
                          span.className = "fallback-text absolute inset-0 flex items-center justify-center text-[10px] font-mono uppercase tracking-[0.2em] font-bold";
                          span.innerText = "BUFF";
                          parent.appendChild(span);
                        }
                      }}
                    />
                  </motion.div>

                  {/* Shimmer/Glow Edge Effect */}
                  <motion.div 
                    className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-t from-transparent via-primary/30 to-transparent h-4 w-full"
                    initial={{ bottom: "0%", opacity: 0 }}
                    animate={{ 
                      bottom: ["0%", "100%"],
                      opacity: [0, 0.8, 1, 0.8, 0]
                    }}
                    transition={{ duration: 2.8, ease: [0.45, 0.05, 0.55, 0.95] }}
                  />
                </div>
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <h1 className="text-2xl font-display font-black tracking-tighter mb-2">DHYAN.S</h1>
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em]">Cinematic Portfolio</p>
            </motion.div>

            {/* Video Editing Timeline Loader */}
            <div className="mt-20 w-80">
              <div className="relative h-12 bg-white/5 rounded-lg border border-white/10 overflow-hidden flex flex-col justify-center px-2">
                {/* Timeline Tracks */}
                <div className="absolute inset-0 flex flex-col divide-y divide-white/5">
                  <div className="h-1/2 w-full" />
                  <div className="h-1/2 w-full" />
                </div>
                
                {/* Clips */}
                <div className="relative z-10 flex gap-2 h-6">
                  <motion.div 
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: 0.1 }}
                    className="w-20 h-full bg-primary/40 rounded border border-primary/30" 
                  />
                  <motion.div 
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: 0.3 }}
                    className="w-32 h-full bg-secondary/40 rounded border border-secondary/30" 
                  />
                  <motion.div 
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: 0.5 }}
                    className="w-16 h-full bg-primary/40 rounded border border-primary/30" 
                  />
                </div>

                {/* Playhead */}
                <motion.div 
                  className="absolute top-0 bottom-0 w-[2px] bg-red-500 z-20 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                  initial={{ left: 0 }}
                  animate={{ left: "100%" }}
                  transition={{ duration: 2.5, ease: "linear" }}
                >
                  <div className="absolute -top-1 -left-[5px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-red-500" />
                </motion.div>

                {/* Ruler ticks */}
                <div className="absolute top-0 left-0 right-0 h-2 flex justify-between px-2 opacity-20">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="w-[1px] h-full bg-white" />
                  ))}
                </div>
              </div>
              <div className="mt-4 flex justify-between text-[8px] font-mono text-white/20 uppercase tracking-widest">
                <span>00:00:00:01</span>
                <span className="text-secondary animate-pulse">Rendering Cinematic Experience...</span>
                <span>00:00:02:50</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <Layout key="main">
            <Navbar />
            <FloatingAvatar />
            <Hero />
            <Portfolio />
            <Experience />
            <Skills />
            <Contact />
          </Layout>
        )}
      </AnimatePresence>
    </>
  );
}
