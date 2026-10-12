import { useEffect, useRef, type ReactNode } from 'react';
import { initGsap } from '@/lib/gsap';

/**
 * PARALLAX
 * ─────────────────────────────────────────────────────────────────────────
 * Category E. Deliberately small displacements — `speed` is a fraction of the
 * distance the element travels through the viewport, so 0.06 means 6%.
 *
 * Anything above ~0.15 starts to feel disorienting and is a smell; keep
 * parallax on decoration, never on body copy.
 */
interface ParallaxProps {
  children: ReactNode;
  /** Fraction of viewport travel applied as vertical offset. */
  speed?: number;
  className?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
}

export default function Parallax({
  children,
  speed = 0.05,
  className = '',
  ...rest
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const g = initGsap();
    const ctx = g.context(() => {
      g.fromTo(
        el,
        { yPercent: -speed * 100 },
        {
          yPercent: speed * 100,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      );
    }, ref);

    return () => ctx.revert();
  }, [speed]);

  return (
    <div ref={ref} className={className} {...rest}>
      {children}
    </div>
  );
}
