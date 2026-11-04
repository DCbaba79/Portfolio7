import React, { useEffect, useId, useRef, useState } from 'react';
import { cn } from '../lib/utils';
import { useReducedMotion } from '../lib/hooks';

/** Only one clip may speak at a time. */
const SOUND_EVENT = 'dj:sound';

interface ClipProps {
  src: string;
  poster: string;
  label: string;
  className?: string;
  /** Show the Instagram-style sound toggle (bottom right) */
  sound?: boolean;
  /** Fill the parent with object-cover */
  cover?: boolean;
  /** Play regardless of viewport (used by hover previews) */
  playing?: boolean;
}

export default function Clip({ src, poster, label, className, sound = true, cover = true, playing }: ClipProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const id = useId();
  const reduced = useReducedMotion();
  const [inView, setInView] = useState(false);
  const [muted, setMuted] = useState(true);
  const [load, setLoad] = useState(false);

  // Load lazily, play only while on screen
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting);
        if (e.isIntersecting) setLoad(true);
      },
      { rootMargin: '200px 0px', threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const shouldPlay = playing ?? (inView && (!reduced || !muted));

  useEffect(() => {
    const el = ref.current;
    if (!el || !load) return;
    if (shouldPlay) el.play().catch(() => {});
    else el.pause();
  }, [shouldPlay, load]);

  // Leaving the screen or another clip unmuting silences this one
  useEffect(() => {
    if (!inView && playing === undefined) setMuted(true);
  }, [inView, playing]);
  useEffect(() => {
    const onOther = (e: Event) => {
      if ((e as CustomEvent).detail !== id) setMuted(true);
    };
    window.addEventListener(SOUND_EVENT, onOther);
    return () => window.removeEventListener(SOUND_EVENT, onOther);
  }, [id]);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !muted;
    setMuted(next);
    if (!next) {
      window.dispatchEvent(new CustomEvent(SOUND_EVENT, { detail: id }));
      ref.current?.play().catch(() => {});
    }
  };

  return (
    <div className={cn('group/clip relative overflow-hidden bg-ink-3', className)}>
      <video
        ref={ref}
        src={load ? src : undefined}
        poster={poster}
        muted={muted}
        loop
        playsInline
        preload="none"
        aria-label={label}
        onClick={sound ? toggle : undefined}
        className={cn('h-full w-full', cover ? 'object-cover' : 'object-contain', sound && 'cursor-pointer')}
      />
      {sound && (
        <button
          type="button"
          onClick={toggle}
          aria-label={muted ? `Unmute ${label}` : `Mute ${label}`}
          aria-pressed={!muted}
          className={cn(
            'absolute bottom-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-ink/60 text-paper backdrop-blur-sm transition-opacity duration-300',
            muted
              ? 'opacity-70 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/clip:opacity-100 focus-visible:opacity-100'
              : 'opacity-100'
          )}
        >
          <SpeakerIcon muted={muted} />
        </button>
      )}
    </div>
  );
}

export function SpeakerIcon({ muted }: { muted: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
      {muted ? (
        <path d="M17 9l5 6M22 9l-5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      ) : (
        <path d="M17 8.5a5 5 0 0 1 0 7M19.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      )}
    </svg>
  );
}
