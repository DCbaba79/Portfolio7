import React from 'react';
import { motion } from 'motion/react';

const EASE = [0.16, 1, 0.3, 1] as const;

/** Text line that rises out of its own mask, like a title on a cut. */
export function Line({
  children,
  delay = 0,
  className,
  as: Tag = 'span',
  play,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: 'span' | 'div';
  /** Control from the parent instead of the viewport */
  play?: boolean;
}) {
  const anim = { y: '0%' };
  return (
    <Tag className={`block overflow-hidden pb-[0.06em] -mb-[0.06em] ${className ?? ''}`}>
      <motion.span
        className="block"
        initial={{ y: '108%' }}
        {...(play === undefined
          ? { whileInView: anim, viewport: { once: true, margin: '0px 0px -12% 0px' } }
          : { animate: play ? anim : { y: '108%' } })}
        transition={{ duration: 1.1, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </Tag>
  );
}

export function Fade({
  children,
  delay = 0,
  className,
  y = 24,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
