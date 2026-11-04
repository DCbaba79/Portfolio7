import { useEffect, useState } from 'react';

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
/** True for mouse/trackpad users — gates cursor, magnetic and hover-preview effects. */
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)');

/**
 * Clamped linear map, as a plain function. Passing a function to useTransform
 * keeps the value on Motion's JS path — range-array opacity transforms can be
 * handed to native ScrollTimeline, which mis-measures sticky/pinned targets.
 */
export function range(input: [number, number], output: [number, number]) {
  return (v: number) => {
    const t = Math.min(1, Math.max(0, (v - input[0]) / (input[1] - input[0])));
    return output[0] + (output[1] - output[0]) * t;
  };
}
