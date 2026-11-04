import React from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { useReducedMotion } from '../lib/hooks';

/**
 * Ambient light behind the whole page: one soft, liquid blob that drifts,
 * swells and shifts between the brand teal and orange as the visitor scrolls.
 *
 * Cheap by design: the colour lives in static radial gradients (painted once);
 * everything that changes is transform or opacity, so it stays on the compositor.
 * The idle "breathing" is a slow CSS rotation of offset ellipses, which reads
 * as the shape morphing. Reduced motion gets the same light, held still.
 */

// Scroll keyframes, page progress 0 → 1. Roughly follows the chapters.
const STOPS = [0, 0.14, 0.3, 0.5, 0.66, 0.82, 1];
const X = [-12, 34, 58, 18, 46, 62, 22]; // vw offset of the blob centre from left
const Y = [-8, 30, 12, 48, 20, 40, 58]; // vh
const SCALE = [1, 1.18, 0.92, 1.25, 1.05, 1.15, 0.95];
const WARM = [0.15, 0.3, 0.75, 0.35, 0.2, 0.7, 0.9]; // share of orange in the mix
const GLOW = [0.85, 1, 0.8, 1, 0.75, 0.95, 1]; // overall intensity

function lerpStops(values: number[]) {
  return (v: number) => {
    for (let i = 1; i < STOPS.length; i++) {
      if (v <= STOPS[i]) {
        const t = (v - STOPS[i - 1]) / (STOPS[i] - STOPS[i - 1]);
        const e = t * t * (3 - 2 * t); // smoothstep: no hard corners between stops
        return values[i - 1] + (values[i] - values[i - 1]) * e;
      }
    }
    return values[values.length - 1];
  };
}

export default function Ambient() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  // A heavy spring so the light lags behind the scroll, like it has mass
  const p = useSpring(scrollYProgress, { stiffness: 30, damping: 20, mass: 1.2 });

  const x = useTransform(p, (v) => `${lerpStops(X)(v)}vw`);
  const y = useTransform(p, (v) => `${lerpStops(Y)(v)}vh`);
  const scale = useTransform(p, lerpStops(SCALE));
  const warm = useTransform(p, lerpStops(WARM));
  const cool = useTransform(warm, (w) => 1 - w);
  const glow = useTransform(p, lerpStops(GLOW));

  const still = { x: '10vw', y: '6vh', scale: 1.1 };

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute left-0 top-0 h-[78vmax] w-[78vmax] -translate-x-1/2 -translate-y-1/2 will-change-transform"
        style={reduced ? still : { x, y, scale, opacity: glow }}
      >
        {/* teal body */}
        <motion.div className="absolute inset-0" style={{ opacity: reduced ? 1 : cool }}>
          <div className="ambient-morph absolute inset-0 [animation-duration:38s]">
            <div className="absolute inset-[4%_16%_12%_2%] rounded-full bg-[radial-gradient(closest-side,rgb(13_148_136/0.26),rgb(13_148_136/0.1)_45%,transparent)]" />
          </div>
          <div className="ambient-morph-rev absolute inset-0 [animation-duration:52s]">
            <div className="absolute inset-[18%_4%_10%_26%] rounded-full bg-[radial-gradient(closest-side,rgb(20_184_166/0.16),transparent)]" />
          </div>
        </motion.div>
        {/* orange body, same shape: the two crossfade so the colour shifts without repainting */}
        <motion.div className="absolute inset-0" style={{ opacity: reduced ? 0.35 : warm }}>
          <div className="ambient-morph absolute inset-0 [animation-duration:38s]">
            <div className="absolute inset-[4%_16%_12%_2%] rounded-full bg-[radial-gradient(closest-side,rgb(249_115_22/0.17),rgb(249_115_22/0.06)_45%,transparent)]" />
          </div>
          <div className="ambient-morph-rev absolute inset-0 [animation-duration:52s]">
            <div className="absolute inset-[22%_20%_4%_8%] rounded-full bg-[radial-gradient(closest-side,rgb(249_115_22/0.1),transparent)]" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
