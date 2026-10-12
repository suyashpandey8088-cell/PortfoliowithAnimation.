import { useEffect, useState } from 'react';

/**
 * Generic media-query hook. Used to fork behaviour between pointer/touch
 * devices and between viewport widths, rather than guessing from screen size.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    // Sync in case the value changed between render and effect.
    setMatches(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** True on devices with a real hovering pointer (mouse, trackpad, stylus). */
export function useFinePointer(): boolean {
  return useMediaQuery('(pointer: fine) and (hover: hover)');
}

/** True from the `lg` breakpoint up — the pinned desktop layouts. */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}
