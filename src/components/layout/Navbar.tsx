import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import React, { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';
import { useRouter } from '../../lib/router';
import { scrollToTarget, stopScroll } from '../../lib/scroll';
import { PROFILE, SOCIALS } from '../../data/profile';
import Magnetic from '../ui/Magnetic';

const NAV_LINKS = [
  { name: 'Work', id: 'work' },
  { name: 'About', id: 'about' },
  { name: 'Experience', id: 'experience' },
  { name: 'Toolkit', id: 'toolkit' },
];

/** Text that rolls up to a duplicate on hover. */
function RollText({ children }: { children: string }) {
  return (
    <span className="relative inline-flex overflow-hidden">
      <span className="block transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-full">{children}</span>
      <span aria-hidden className="absolute inset-0 block translate-y-full text-secondary transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0">
        {children}
      </span>
    </span>
  );
}

export default function Navbar() {
  const { path, navigate } = useRouter();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > 400 && y > prev && !open);
  });

  // Track which section is in view for the active indicator
  useEffect(() => {
    if (path !== '/') return setActive('');
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    ['home', ...NAV_LINKS.map((l) => l.id), 'contact'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [path]);

  useEffect(() => {
    stopScroll(open);
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (open) {
      // Release the scroll lock now, not after the effect, so the jump isn't swallowed
      stopScroll(false);
      document.body.style.overflow = '';
      setOpen(false);
    }
    if (path === '/') scrollToTarget(id);
    else navigate(`/#${id}`);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: hidden ? -100 : 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={cn(
            'mx-auto flex max-w-[1600px] items-center justify-between px-4 transition-[padding,background-color] duration-500 md:px-10',
            scrolled ? 'py-3 md:py-4' : 'py-5 md:py-8'
          )}
        >
          <a href="/" onClick={go('home')} className="group flex items-center gap-3" aria-label={`${PROFILE.name} — home`}>
            <span className="relative h-9 w-9 overflow-hidden rounded-full border border-white/15 bg-white/5 md:h-10 md:w-10">
              <img src={PROFILE.logo} alt="" width={40} height={40} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-brand text-[13px] font-bold tracking-[0.08em] md:text-sm">DHYAN SALAVI</span>
              <span className="mt-1 hidden font-mono text-[9px] uppercase tracking-[0.3em] text-white/45 sm:block">Video · Design · Code</span>
            </span>
          </a>

          <nav
            aria-label="Primary"
            className={cn(
              'hidden items-center gap-1 border px-2 py-1.5 transition-colors duration-500 lg:flex',
              scrolled ? 'border-white/10 bg-ink/70 backdrop-blur-md' : 'border-transparent'
            )}
          >
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.id}
                href={`/#${link.id}`}
                onClick={go(link.id)}
                className={cn(
                  'group relative flex items-center gap-1.5 px-4 py-2 text-[12px] font-medium uppercase tracking-[0.18em] transition-colors',
                  active === link.id ? 'text-white' : 'text-white/55 hover:text-white'
                )}
              >
                <span className="font-mono text-[9px] text-white/30">0{i + 1}</span>
                <RollText>{link.name}</RollText>
                {active === link.id && (
                  <motion.span layoutId="nav-active" className="absolute inset-x-4 -bottom-0.5 h-px bg-primary-bright" transition={{ type: 'spring', stiffness: 400, damping: 35 }} />
                )}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Magnetic className="hidden lg:block">
              <a
                href="/#contact"
                onClick={go('contact')}
                className="group flex items-center gap-2.5 bg-paper py-2.5 pl-4 pr-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors duration-300 hover:bg-secondary hover:text-white"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary group-hover:bg-white" />
                </span>
                <RollText>Available — Let's talk</RollText>
              </a>
            </Magnetic>

            <button
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-ink/60 backdrop-blur lg:hidden"
            >
              <span className={cn('absolute h-px w-4 bg-white transition-transform duration-500', open ? 'rotate-45' : '-translate-y-1')} />
              <span className={cn('absolute h-px w-4 bg-white transition-transform duration-500', open ? '-rotate-45' : 'translate-y-1')} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: [0.83, 0, 0.17, 1] }}
            className="fixed inset-0 z-[45] flex flex-col justify-between bg-ink px-4 pb-10 pt-28 lg:hidden"
          >
            <nav aria-label="Mobile" className="flex flex-col">
              {[...NAV_LINKS, { name: 'Contact', id: 'contact' }].map((link, i) => (
                <motion.a
                  key={link.id}
                  href={`/#${link.id}`}
                  onClick={go(link.id)}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 + i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-baseline gap-4 border-b border-white/10 py-4"
                >
                  <span className="font-mono text-xs text-secondary">0{i + 1}</span>
                  <span className={cn('font-display text-[15vw] uppercase leading-[0.9]', active === link.id ? 'text-primary-bright' : 'text-paper')}>
                    {link.name}
                  </span>
                </motion.a>
              ))}
            </nav>
            <div className="flex flex-wrap gap-x-6 gap-y-3 font-mono text-xs uppercase tracking-[0.2em] text-white/60">
              {SOCIALS.map((s) => (
                <a key={s.label} href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="hover:text-secondary">
                  {s.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
