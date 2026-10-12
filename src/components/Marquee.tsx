import type { ReactNode } from 'react';

/**
 * Infinite marquee strip.
 *
 * The content is rendered twice and the track translates by exactly -50%, so
 * the loop is seamless and the animation is a single compositor-only
 * transform. `aria-hidden` on the duplicate keeps screen readers from
 * hearing everything twice.
 */
interface MarqueeProps {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
  /** Pauses when the strip is off-screen. */
  pauseOnHover?: boolean;
}

export default function Marquee({
  children,
  className = '',
  reverse = false,
  pauseOnHover = true,
}: MarqueeProps) {
  return (
    <div
      className={`group relative flex overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <div
        className={`marquee-track ${reverse ? 'animate-marquee-rev' : 'animate-marquee'} ${
          pauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''
        }`}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center">{children}</div>
      </div>
    </div>
  );
}
