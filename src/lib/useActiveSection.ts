import { useEffect, useState } from 'react';

/**
 * Tracks which section is currently dominant, using IntersectionObserver
 * rather than a scroll listener — no work happens on the scroll thread.
 *
 * The threshold set is biased so a section only "wins" once it genuinely
 * owns the viewport, which stops the active link flickering between two
 * sections at a boundary.
 */
export function useActiveSection(ids: string[], enabled = true): string {
  const [active, setActive] = useState(ids[0] ?? '');

  useEffect(() => {
    if (!enabled || ids.length === 0) return;
    if (typeof IntersectionObserver === 'undefined') return;

    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        let bestId = '';
        let bestRatio = 0;
        ratios.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });
        // Only commit a change once a section is meaningfully on screen.
        if (bestId && bestRatio > 0.15) setActive(bestId);
      },
      { threshold: [0, 0.15, 0.35, 0.6, 0.85, 1], rootMargin: '-25% 0px -35% 0px' },
    );

    const nodes: Element[] = [];
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) {
        nodes.push(el);
        observer.observe(el);
      }
    }

    return () => observer.disconnect();
  }, [ids, enabled]);

  return active;
}
