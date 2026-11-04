import React from 'react';
import type { Project } from '../data/site';
import { Link } from '../lib/router';
import { cn } from '../lib/utils';

export function MetaGrid({ p, className }: { p: Project; className?: string }) {
  const rows: [string, string | undefined][] = [
    ['Client', p.client],
    ['Year', p.year],
    ['Role', p.role],
    ['Format', p.duration ? `${p.format} · ${p.duration}` : p.format],
    ['Tools', p.tools.join(', ')],
  ];
  return (
    <dl className={cn('grid grid-cols-2 gap-x-6 gap-y-5', className)}>
      {rows
        .filter(([, v]) => v)
        .map(([k, v]) => (
          <div key={k} className={k === 'Client' ? 'col-span-2' : ''}>
            <dt className="label text-paper/40">{k}</dt>
            <dd className="mt-1.5 text-[14px] leading-snug text-paper/85">{v}</dd>
          </div>
        ))}
    </dl>
  );
}

export function OpenCut({ p, className, tone = 'orange' }: { p: Project; className?: string; tone?: 'orange' | 'teal' }) {
  return (
    <Link
      to={`/work/${p.id}`}
      className={cn(
        'group inline-flex items-center gap-4 border-b pb-2 text-[15px] font-medium tracking-[-0.01em] transition-colors',
        tone === 'orange' ? 'border-orange/60 hover:border-orange' : 'border-teal-3/60 hover:border-teal-3',
        className
      )}
    >
      Open the full cut
      <span className="relative block h-3 w-6 overflow-hidden">
        <span className="absolute inset-0 flex items-center transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-full">→</span>
        <span className="absolute inset-0 flex -translate-x-full items-center transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-0">→</span>
      </span>
    </Link>
  );
}

export function Process({ steps, className }: { steps: string[]; className?: string }) {
  return (
    <ol className={cn('space-y-3', className)}>
      {steps.map((s, i) => (
        <li key={i} className="flex gap-4 text-[14.5px] leading-relaxed text-paper/70">
          <span className="tc pt-0.5 text-[11px] text-paper/35">{String(i + 1).padStart(2, '0')}</span>
          <span>{s}</span>
        </li>
      ))}
    </ol>
  );
}
