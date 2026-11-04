import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PROFILE } from '../data/site';
import { Line } from '../components/Reveal';

/** The post-credits scene: the raccoon comes back for the last word. */
export default function PostCredits() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${PROFILE.email}`;
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-ink-2">
      <div className="safe-x relative min-h-[100svh] pb-8 pt-24 md:pt-32">
        <div className="flex items-center justify-between border-b border-paper/10 pb-4">
          <span className="label text-paper/45">07 — Post-credits scene</span>
          <span className="label hidden items-center gap-2 text-paper/45 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-3" /> Freelance & full-time · Remote
          </span>
        </div>

        <div className="relative z-10 mt-14 md:mt-20">
          <h2 className="text-[clamp(3rem,10vw,10rem)] font-semibold leading-[0.85] tracking-[-0.055em]">
            <Line>Got footage?</Line>
            <Line delay={0.08}>
              <span className="accent accent-hover">Let’s cut</span>
            </Line>
            <Line delay={0.16}>something.</Line>
          </h2>

          <div className="mt-14 flex flex-col gap-4 md:mt-20">
            <a
              href={`mailto:${PROFILE.email}`}
              className="group inline-flex w-fit items-baseline gap-4 text-[clamp(1.25rem,3.2vw,2.6rem)] font-medium tracking-[-0.03em]"
            >
              <span className="border-b border-paper/30 pb-1 transition-colors group-hover:border-orange group-hover:text-orange">
                {PROFILE.email}
              </span>
              <span aria-hidden className="text-orange transition-transform duration-500 group-hover:translate-x-2">→</span>
            </a>
            <button type="button" onClick={copy} className="label w-fit py-1 text-paper/50 transition-colors hover:text-paper" aria-live="polite">
              {copied ? 'Copied to clipboard' : 'Copy address'}
            </button>
            <p className="label flex items-center gap-2 text-paper/55 sm:hidden">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-3" /> Freelance & full-time · Remote
            </p>
          </div>

          <ul className="mt-14 flex flex-wrap gap-x-10 gap-y-4">
            {[
              { k: 'Instagram', ...PROFILE.instagram },
              { k: 'LinkedIn', ...PROFILE.linkedin },
            ].map((s) => (
              <li key={s.k}>
                <a href={s.href} target="_blank" rel="noreferrer" className="group block">
                  <span className="label block text-paper/40">{s.k}</span>
                  <span className="mt-1 block text-[17px] transition-colors group-hover:text-teal-3">{s.handle} ↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* the raccoon, peeking in from the edge of frame */}
        <motion.img
          src={PROFILE.raccoon}
          alt="The DJ79 raccoon, peeking in"
          loading="lazy"
          className="pointer-events-none absolute -bottom-[6%] right-[-8%] w-[min(52vw,560px)] select-none [mask-image:linear-gradient(to_top,transparent,black_30%)] md:right-[3%]"
          initial={{ y: '40%', rotate: 8, opacity: 0 }}
          whileInView={{ y: '0%', rotate: -4, opacity: 1 }}
          viewport={{ once: true, margin: '0px 0px -20% 0px' }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        />

        <footer className="relative z-10 mt-32 flex max-w-[52%] flex-col gap-2 border-t border-paper/10 pt-5 sm:max-w-none md:mt-40 md:flex-row md:justify-between">
          <span className="tc text-[11px] text-paper/40">© {new Date().getFullYear()} {PROFILE.name} · {PROFILE.file}</span>
          <span className="tc text-[11px] text-paper/40">Every frame on this page is from the work. Except the raccoon.</span>
        </footer>
      </div>
    </section>
  );
}
