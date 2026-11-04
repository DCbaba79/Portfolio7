import { motion } from 'motion/react';
import { ArrowUpRight, Check, Copy, Send } from 'lucide-react';
import React, { useState } from 'react';
import { PROFILE, SOCIALS } from '../../data/profile';
import { scrollToTarget } from '../../lib/scroll';
import { MaskLines, SectionTag } from '../ui/Reveal';
import Magnetic from '../ui/Magnetic';

/** Composes an email in the visitor's mail client — no backend required. */
function InquiryForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `Project inquiry — ${form.name}`;
    const body = `${form.message}\n\n— ${form.name}${form.email ? ` (${form.email})` : ''}`;
    window.location.href = `mailto:${PROFILE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const field = 'peer w-full border-b border-white/15 bg-transparent pb-3 pt-6 text-lg text-paper outline-none transition-colors placeholder:text-transparent focus:border-primary-bright';
  const label = 'pointer-events-none absolute left-0 top-6 font-mono text-[11px] uppercase tracking-[0.25em] text-white/45 transition-all duration-300 peer-focus:top-0 peer-focus:text-primary-glow peer-[:not(:placeholder-shown)]:top-0';

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="relative">
        <input id="c-name" required value={form.name} onChange={set('name')} placeholder="Name" className={field} autoComplete="name" />
        <label htmlFor="c-name" className={label}>Your name</label>
      </div>
      <div className="relative">
        <input id="c-email" type="email" value={form.email} onChange={set('email')} placeholder="Email" className={field} autoComplete="email" />
        <label htmlFor="c-email" className={label}>Email (optional)</label>
      </div>
      <div className="relative">
        <textarea id="c-msg" required rows={3} value={form.message} onChange={set('message')} placeholder="Message" className={`${field} resize-none`} />
        <label htmlFor="c-msg" className={label}>Tell me about the project</label>
      </div>
      <button
        type="submit"
        className="group relative mt-4 inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-primary px-6 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-white"
      >
        <span className="absolute inset-0 translate-y-full bg-secondary transition-transform duration-500 ease-out-expo group-hover:translate-y-0" />
        <span className="relative">Compose email</span>
        <Send size={16} className="relative transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-1" />
      </button>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">Opens your mail app with the message pre-filled.</p>
    </form>
  );
}

export default function Contact() {
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
    <section id="contact" className="relative overflow-hidden border-t border-white/[0.07] px-4 pb-32 pt-24 md:px-10 md:pb-36 md:pt-40">
      <div aria-hidden className="pointer-events-none absolute -bottom-1/3 left-1/2 h-[80vh] w-[80vh] -translate-x-1/2 rounded-full bg-primary/15 blur-[160px]" />

      <div className="relative mx-auto max-w-[1600px]">
        <SectionTag index="05" label="Contact" />
        <h2 className="mt-8 font-display text-[clamp(2.2rem,8.5vw,9rem)] font-bold uppercase leading-[0.88] tracking-[-0.045em]">
          <MaskLines
            lines={[
              <>Have an idea?</>,
              <>Let's make</>,
              <>something <span className="orange-to-teal normal-case tracking-normal">worth</span></>,
              <span className="text-outline">remembering.</span>,
            ]}
          />
        </h2>

        <div className="mt-16 grid grid-cols-12 gap-y-16 md:mt-24 lg:gap-x-8">
          <div className="col-span-12 lg:col-span-7">
            <p className="eyebrow">Write to me</p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <Magnetic strength={0.15}>
                <a
                  href={`mailto:${PROFILE.email}`}
                  data-cursor="Email"
                  className="group relative inline-block break-all font-sans text-[clamp(1.4rem,4vw,3.6rem)] font-semibold tracking-[-0.03em]"
                >
                  {PROFILE.email}
                  <span className="absolute -bottom-1 left-0 h-[2px] w-full origin-right scale-x-0 bg-secondary transition-transform duration-700 ease-out-expo group-hover:origin-left group-hover:scale-x-100" />
                </a>
              </Magnetic>
              <button
                onClick={copy}
                aria-label="Copy email address"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white hover:text-white"
              >
                {copied ? <Check size={16} className="text-primary-glow" /> : <Copy size={16} />}
              </button>
              <span aria-live="polite" className="sr-only">{copied ? 'Email copied' : ''}</span>
            </div>

            <ul className="mt-14 border-t border-white/10">
              {SOCIALS.filter((s) => s.label !== 'Email').map((s, i) => (
                <motion.li
                  key={s.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a
                    href={s.href}
                    target={s.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between border-b border-white/10 py-5"
                  >
                    <span className="font-display text-lg font-bold uppercase tracking-[-0.01em] transition-transform duration-500 ease-out-expo group-hover:translate-x-2 md:text-2xl">
                      {s.label}
                    </span>
                    <span className="flex items-center gap-4 text-white/50 transition-colors group-hover:text-secondary">
                      <span className="hidden font-mono text-xs sm:inline">{s.value}</span>
                      <ArrowUpRight size={20} className="transition-transform duration-500 group-hover:rotate-45" />
                    </span>
                  </a>
                </motion.li>
              ))}
              {PROFILE.resume && (
                <li>
                  <a href={PROFILE.resume} target="_blank" rel="noopener noreferrer" download className="group flex items-center justify-between border-b border-white/10 py-5">
                    <span className="font-display text-lg font-bold uppercase transition-transform duration-500 group-hover:translate-x-2 md:text-2xl">Resume</span>
                    <span className="flex items-center gap-4 text-white/50 group-hover:text-secondary">
                      <span className="hidden font-mono text-xs sm:inline">PDF</span>
                      <ArrowUpRight size={20} />
                    </span>
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <p className="eyebrow mb-4">Project inquiry</p>
            <InquiryForm />
          </div>
        </div>

        <footer className="mt-24 flex flex-col gap-6 border-t border-white/10 pt-8 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40 md:mt-32 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} {PROFILE.name}. All rights reserved.</span>
          <span>Edited, designed &amp; built by hand.</span>
          <a href="#home" onClick={(e) => { e.preventDefault(); scrollToTarget('home'); }} className="transition-colors hover:text-secondary">
            Back to top ↑
          </a>
        </footer>
      </div>
    </section>
  );
}
