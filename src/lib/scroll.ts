import Lenis from 'lenis';

let lenis: Lenis | null = null;

export function initLenis(reducedMotion: boolean) {
  if (lenis || reducedMotion) return lenis;
  lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  const raf = (time: number) => {
    lenis?.raf(time);
    if (lenis) requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
  return lenis;
}

export function destroyLenis() {
  lenis?.destroy();
  lenis = null;
}

/** Scroll to a section id or absolute offset, through Lenis when it's active. */
export function scrollToTarget(target: string | number, opts: { immediate?: boolean } = {}) {
  const el = typeof target === 'string' ? document.getElementById(target) : null;
  if (typeof target === 'string' && !el) return;
  const dest = el ?? (target as number);
  if (lenis) {
    lenis.scrollTo(dest as HTMLElement | number, { immediate: opts.immediate, offset: 0, duration: 1.4 });
  } else {
    const top = el ? el.getBoundingClientRect().top + window.scrollY : (target as number);
    window.scrollTo({ top, behavior: opts.immediate ? 'auto' : 'smooth' });
  }
}

export function stopScroll(stop: boolean) {
  if (!lenis) return;
  stop ? lenis.stop() : lenis.start();
}
