import { motion, useInView } from 'motion/react';
import React, { useRef, useEffect, useState } from 'react';
import { STATS } from '../../constants';

interface CounterProps {
  value: number | string;
  label: string;
  key?: string;
}

function Counter({ value, label }: CounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView && typeof value === 'number') {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    } else if (isInView && typeof value === 'string') {
      // Just set it directly if it's a string (like 50K)
      // We could parse it and animate it, but for now let's just make it visible
      // As setCount only takes numbers, we can't really use it for "50K"
    }
  }, [isInView, value]);

  const displayValue = typeof value === 'string' ? value : count.toLocaleString();

  return (
    <div ref={ref} className="text-center group">
      <div className="text-2xl md:text-6xl font-display font-black text-white mb-2 tracking-tighter transition-colors">
        <span className="hover-outline">{displayValue}+</span>
      </div>
      <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">
        {label.split(" ").map((word, i) => (
          <span key={i} className="hover-outline mr-1">{word}</span>
        ))}
      </div>
    </div>
  );
}

export default function Experience() {
  return (
    <section id="stats" className="py-20 md:py-32 bg-white/[0.02] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-16">
        {STATS.map((stat) => (
          <Counter key={stat.label} value={stat.value} label={stat.label} />
        ))}
      </div>
    </section>
  );
}
