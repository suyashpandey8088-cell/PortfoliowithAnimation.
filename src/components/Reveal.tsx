import { useEffect, useRef, type ElementType, type ReactNode } from 'react';
import { initGsap, ease, motion } from '@/lib/gsap';

/**
 * SHARED REVEAL PRIMITIVES
 * ─────────────────────────────────────────────────────────────────────────
 * Category A of the animation system: masked typography reveals.
 *
 * Each line is wrapped in a clipping container and the *glyph* slides up from
 * below it. Because only `transform` moves, line metrics never change and
 * nothing reflows mid-animation.
 */

interface MaskedTextProps {
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  /** Stagger between lines, in seconds. */
  stagger?: number;
  /** Start position as a percentage of the line height. */
  from?: number;
  id?: string;
}

export function MaskedText({
  lines,
  as: Tag = 'h2',
  className = '',
  lineClassName = '',
  stagger = 0.09,
  from = 110,
  id,
}: MaskedTextProps) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const g = initGsap();
    const ctx = g.context(() => {
      g.from('[data-mask-line] > span', {
        yPercent: from,
        rotate: 2,
        duration: motion.enter + 0.2,
        ease: ease.expo,
        stagger,
        scrollTrigger: { trigger: el, start: 'top 82%', once: true },
      });
    }, rootRef);

    return () => ctx.revert();
  }, [stagger, from]);

  return (
    <Tag ref={rootRef} id={id} className={className}>
      {lines.map((line, i) => (
        <span key={i} data-mask-line className={`line-mask ${lineClassName}`}>
          <span className="block will-change-transform">{line}</span>
        </span>
      ))}
    </Tag>
  );
}

/**
 * Scroll-triggered fade + rise. Used for body copy and supporting graphics,
 * revealed in short readable groups rather than all at once.
 */
interface FadeUpProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: ElementType;
}

export function FadeUp({ children, className = '', delay = 0, y = 26, as: Tag = 'div' }: FadeUpProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const g = initGsap();
    const ctx = g.context(() => {
      g.from(el, {
        autoAlpha: 0,
        y,
        duration: motion.enter,
        ease: ease.expo,
        delay,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    }, ref);

    return () => ctx.revert();
  }, [delay, y]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/**
 * Staggered group: children reveal one after another as the group enters.
 * Cheaper than giving every child its own ScrollTrigger.
 */
interface StaggerGroupProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  from?: { y?: number; x?: number; scale?: number };
}

export function StaggerGroup({ children, className = '', stagger = 0.07, from = { y: 30 } }: StaggerGroupProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Use the element's children directly instead of a relative selector —
    // `el.querySelectorAll('> *')` is invalid in several browsers and in jsdom.
    const items = Array.from(el.children);

    const g = initGsap();
    const ctx = g.context(() => {
      g.from(items, {
        autoAlpha: 0,
        ...from,
        duration: motion.enter,
        ease: ease.expo,
        stagger,
        scrollTrigger: { trigger: el, start: 'top 84%', once: true },
      });
    }, ref);

    return () => ctx.revert();
  }, [stagger, from]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
