import { useEffect, useMemo, useRef } from 'react';
import { profile } from '@/content/profile';
import { useHeroFlythrough } from '@/hooks/useHeroFlythrough';
import { initGsap, ease } from '@/lib/gsap';
import { useIsDesktop } from '@/lib/useMediaQuery';
import { useReducedMotion } from '@/lib/useReducedMotion';
import {
  Starburst,
  Blob,
  Smiley,
  HandArrow,
  CircularLabel,
  CrossMark,
  HalftoneBlock,
  Rings,
} from './graphics/Primitives';

/**
 * HERO
 * ─────────────────────────────────────────────────────────────────────────
 * A full-viewport opening scene that becomes a pinned camera move.
 *
 * Pinning strategy: the runway (`track`) is taller than the viewport and the
 * stage inside it is `position: sticky`. ScrollTrigger only *reads* progress
 * — it never pins anything — so there is no pin-spacer and no layout jump
 * when the section releases.
 *
 * Centring strategy: the type block is centred with the standalone CSS
 * `translate` property, not `transform`. GSAP owns `transform` outright, so
 * the two never fight, and because `translate` is percentage-based the block
 * stays centred across resizes with no re-measurement.
 */

interface HeroProps {
  /** Flips to true when the preloader exits, triggering the intro. */
  ready: boolean;
}

const LINES = ['SUYASH', 'PANDEY.'] as const;

/** Distinct sizes per line: asymmetry without breaking the centred maths. */
const LINE_SIZES = [
  'clamp(2.6rem, 11.4vw, 9.6rem)',
  'clamp(3rem, 13.4vw, 11.4rem)',
];

export default function Hero({ ready }: HeroProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();

  // Gentler travel on small screens: readable, and far cheaper to composite.
  const intensity = isDesktop ? 1 : 0.55;

  useHeroFlythrough({
    track: trackRef,
    stage: stageRef,
    enabled: !reducedMotion,
    intensity,
  });

  /* ── Intro: played once, when the preloader hands over ─────────────── */
  useEffect(() => {
    if (!ready) return;
    const stageEl = stageRef.current;
    if (!stageEl) return;

    const g = initGsap();
    const ctx = g.context(() => {
      if (reducedMotion) {
        // No entrance choreography — everything simply exists.
        g.set('[data-hl], [data-deco], [data-hero-ui]', { autoAlpha: 1, yPercent: 0 });
        return;
      }
      const tl = g.timeline({ defaults: { ease: ease.expo } });
      tl.from('[data-hl]', {
        yPercent: 122,
        rotateX: -62,
        autoAlpha: 0,
        duration: 1.1,
        stagger: { each: 0.045, from: 'start' },
      })
        .from(
          '[data-deco]',
          { scale: 0, autoAlpha: 0, duration: 0.9, stagger: 0.07, ease: 'back.out(1.6)' },
          '-=0.75',
        )
        .from('[data-hero-ui]', { autoAlpha: 0, y: 18, duration: 0.7, stagger: 0.08 }, '-=0.6');
    }, stageRef);

    return () => ctx.revert();
  }, [ready, reducedMotion]);

  const letters = useMemo(
    () =>
      LINES.map((line) =>
        line.split('').map((char, charIndex) => ({
          char,
          charIndex,
          // First letter of each line survives the scatter to form "SP".
          keeper: charIndex === 0,
        })),
      ),
    [],
  );

  return (
    <section id="hero" aria-label="Introduction" className="relative bg-cream">
      {/* Real, accessible heading — the animated letters are its visual
          twin, hidden from assistive technology. */}
      <h1 className="sr-only">
        Suyash Pandey — {profile.role}. {profile.tagline}
      </h1>

      {/*
        Reduced motion: no runway, no pinning. The section is exactly one
        viewport and the page scrolls normally.
      */}
      <div
        ref={trackRef}
        className={
          reducedMotion ? 'relative h-[100svh]' : 'relative h-[270vh] lg:h-[430vh]'
        }
      >
        <div
          ref={stageRef}
          className="sticky top-0 h-[100svh] w-full overflow-hidden bg-cream text-ink"
        >
          {/* ── Flat background layer (never transformed in 3D) ─────── */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <HalftoneBlock className="absolute inset-x-0 top-0 h-24 w-full text-ink/[0.07] sm:h-28" />
            <div className="absolute right-4 bottom-7 left-4 h-px bg-ink/15 sm:right-10 sm:left-10" />
            <div className="grain-layer absolute inset-0" />
          </div>

          {/* ── 3D stage ─────────────────────────────────────────────── */}
          <div className="absolute inset-0" style={{ perspective: '900px' }}>
            <div
              data-type-block
              className="preserve-3d absolute top-1/2 left-1/2 w-max text-center"
              style={{ translate: '-50% -50%' }}
            >
              {letters.map((line, lineIndex) => (
                <div key={lineIndex} className="preserve-3d relative block whitespace-nowrap">
                  {line.map(({ char, charIndex, keeper }) => (
                    <span
                      key={`${lineIndex}-${charIndex}`}
                      data-hl
                      {...(keeper ? { 'data-hl-keep': 'true' } : { 'data-hl-drop': 'true' })}
                      aria-hidden="true"
                      className="inline-block font-display leading-[0.85] text-ink will-change-transform"
                      style={{
                        fontSize: LINE_SIZES[lineIndex],
                        letterSpacing: '-0.045em',
                        transform: `translateZ(${(charIndex % 2 === 0 ? 1 : -1) * 8}px)`,
                      }}
                    >
                      {char === '.' ? <span className="text-flare">.</span> : char}
                    </span>
                  ))}
                </div>
              ))}

              {/* ── Decorations, distributed through Z ──────────────── */}
              <div
                data-deco
                aria-hidden="true"
                className="absolute -top-[16%] -left-[7%] w-14 sm:-left-[11%] sm:w-24 lg:w-32"
                style={{ transform: 'translateZ(60px)' }}
              >
                <Starburst rays={12} className="h-full w-full text-flare animate-spin-slow" />
              </div>

              <div
                data-deco
                aria-hidden="true"
                className="absolute -right-[5%] -bottom-[22%] w-20 text-volt sm:-right-[9%] sm:w-32 lg:w-40"
                style={{ transform: 'translateZ(120px)' }}
              >
                <div className="animate-bob">
                  <Blob variant={0} className="h-full w-full" />
                </div>
              </div>

              <div
                data-deco
                aria-hidden="true"
                className="absolute -top-[12%] right-[1%] w-12 sm:right-[5%] sm:w-20 lg:w-24"
                style={{ transform: 'translateZ(190px)' }}
              >
                <div className="animate-bob" style={{ animationDelay: '-2s' }}>
                  <Smiley className="h-full w-full text-volt" />
                </div>
              </div>

              <div
                data-deco
                aria-hidden="true"
                className="absolute bottom-[6%] left-[3%] w-24 text-ink/55 sm:w-32 lg:w-44"
                style={{ transform: 'translateZ(30px)' }}
              >
                <HandArrow towards="right" className="h-full w-full -rotate-12" />
              </div>
            </div>

            {/* ── Monogram chrome (phase 4 assembles around the lockup) ─ */}
            <div
              data-monogram-chrome
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 grid place-items-center"
            >
              <div className="relative h-[min(72vw,25rem)] w-[min(72vw,25rem)]">
                <Rings className="absolute inset-0 h-full w-full text-ink/25" />
                <CircularLabel
                  id="hero-ring"
                  text="· DEVELOPER · AI · DIGITAL EXPERIENCES · "
                  className="absolute inset-0 h-full w-full animate-spin-slow text-ink/70"
                />
                <Starburst
                  rays={14}
                  className="absolute -top-5 -right-3 h-14 w-14 animate-spin-rev text-flare sm:h-16 sm:w-16"
                />
              </div>
            </div>

            {/* ── Monogram lockup: crisp cross-fade target ──────────── */}
            <div data-monogram aria-hidden="true" className="absolute inset-0 grid place-items-center">
              <span
                className="font-display text-ink"
                style={{ fontSize: 'clamp(4rem, 15vw, 9.5rem)', letterSpacing: '-0.08em' }}
              >
                SP
              </span>
            </div>

            {/* ── Exit disc: expands into the cobalt About section ──── */}
            <div className="pointer-events-none absolute inset-0 grid place-items-center" aria-hidden="true">
              <div
                data-wipe
                className="h-[200vmax] w-[200vmax] rounded-full bg-cobalt"
              />
            </div>
          </div>

          {/* ── Flat UI layer above the stage ────────────────────────── */}
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between px-4 pt-20 pb-6 sm:px-6 lg:px-10">
            <div className="flex items-start justify-between gap-4">
              <p
                data-hero-ui
                className="font-mono text-[0.55rem] tracking-[0.28em] text-ink/60 sm:text-[0.65rem]"
              >
                PORTFOLIO / 2026
              </p>
              <p
                data-hero-ui
                className="max-w-[13rem] text-right font-mono text-[0.5rem] leading-relaxed tracking-[0.14em] text-ink/45 sm:max-w-xs sm:text-[0.6rem]"
              >
                {profile.location.toUpperCase()}
              </p>
            </div>

            <div className="flex items-end justify-between gap-6">
              <div data-hero-ui className="max-w-md">
                <p className="text-[clamp(0.82rem,2.1vw,1.05rem)] leading-snug font-medium text-ink/85">
                  {profile.tagline}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.55rem] tracking-[0.18em] text-ink/50">
                  <CrossMark className="h-2.5 w-2.5 text-flare" />
                  <span>{profile.role.toUpperCase()}</span>
                </div>
              </div>

              {/* Scroll indicator — retires on first meaningful scroll */}
              <div data-indicator data-hero-ui className="flex shrink-0 flex-col items-center gap-2">
                <span className="font-mono text-[0.5rem] tracking-[0.28em] text-ink/55 [writing-mode:vertical-rl] sm:text-[0.58rem]">
                  SCROLL TO EXPLORE
                </span>
                <span className="relative block h-14 w-px bg-ink/25 sm:h-20">
                  <span className="absolute inset-x-0 top-0 h-5 animate-[scroll-hint_1.9s_cubic-bezier(0.76,0,0.24,1)_infinite] bg-flare" />
                </span>
                <HandArrow towards="down" className="h-5 w-5 text-ink/60" />
              </div>
            </div>
          </div>

          <style>{`@keyframes scroll-hint{0%{transform:translateY(-100%)}55%,100%{transform:translateY(340%)}}`}</style>
        </div>
      </div>
    </section>
  );
}
