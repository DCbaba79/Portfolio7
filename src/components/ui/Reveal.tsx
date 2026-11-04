import { motion } from 'motion/react';
import React from 'react';
import { cn } from '../../lib/utils';

const EASE = [0.16, 1, 0.3, 1] as const;

interface MaskLinesProps {
  lines: React.ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  /** Animate on mount instead of when scrolled into view */
  immediate?: boolean;
}

/** Each line slides up from behind a mask — the core editorial reveal. */
export function MaskLines({ lines, className, lineClassName, delay = 0, stagger = 0.08, immediate }: MaskLinesProps) {
  const trigger = immediate
    ? { animate: 'show' }
    : { whileInView: 'show', viewport: { once: true, margin: '0px 0px -10% 0px' } };
  return (
    <motion.span initial="hidden" {...trigger} className={cn('block', className)}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className={cn('block will-change-transform', lineClassName)}
            variants={{
              hidden: { y: '110%' },
              show: { y: '0%', transition: { duration: 1.1, ease: EASE, delay: delay + i * stagger } },
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

interface FadeUpProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number;
  as?: 'div' | 'li' | 'p';
}

export function FadeUp({ children, className, delay = 0 }: FadeUpProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Section label in the style of an edit-suite track header: "02 — Selected Work". */
export function SectionTag({ index, label, className }: { index: string; label: string; className?: string }) {
  return (
    <div className={cn('flex items-center gap-4 eyebrow', className)}>
      <span className="text-secondary">{index}</span>
      <span className="h-px w-10 bg-white/20" />
      <span>{label}</span>
    </div>
  );
}
