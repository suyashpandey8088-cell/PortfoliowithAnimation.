import { useEffect, useRef, useState } from 'react';
import { Starburst, CrossMark } from './graphics/Primitives';
import { useReadiness } from '@/lib/useReadiness';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { initGsap, ease } from '@/lib/gsap';

/**
 * MAIN PRELOADER
 * ─────────────────────────────────────────────────────────────────────────
 * Establishes the visual language before the homepage: ink black, electric
 * lime, monospaced metadata, one rotating starburst.
 *
 * The percentage is real — see lib/readiness.ts. The exit choreography
 * physically carries the SP monogram into the nav logo's slot, so the
 * hand-off into the hero is a continuation rather than a cut.
 */

const PHRASE = 'LOADING MY UNIVERSE';

/** Rotating technical labels — cosmetic, and clearly so. */
const TICKER = [
  'INIT CORE',
  'WARM TYPE',
  'BUILD STAGE',
  'RIG SCROLL',
  'PAINT UNIVERSE',
];

interface PreloaderProps {
  onFinish: () => void;
}

export default function Preloader({ onFinish }: PreloaderProps) {
  const { progress, complete } = useReadiness(750);
  const reducedMotion = useReducedMotion();
  const [finished, setFinished] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const monogramRef = useRef<HTMLSpanElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  const percent = Math.round(Math.min(1, progress) * 100);

  // Take over the static boot splash the moment React is live.
  useEffect(() => {
    document.getElementById('boot-splash')?.remove();
  }, []);

  // Lock scrolling for the duration of the intro.
  useEffect(() => {
    document.body.dataset.scrollLocked = 'true';
    return () => {
      delete document.body.dataset.scrollLocked;
    };
  }, []);

  /* ── Exit choreography ─────────────────────────────────────────────── */
  useEffect(() => {
    if (!complete || startedRef.current) return;
    startedRef.current = true;

    const g = initGsap();
    const ctx = g.context(() => {
      const tl = g.timeline({
        // Only now does the site become interactive.
        onComplete: () => {
          setFinished(true);
          delete document.body.dataset.scrollLocked;
          onFinish();
        },
      });

      // Fly the monogram into the nav logo's slot. If the nav is not there
      // yet (edge case), fall back to a simple scale-down.
      const target = document.querySelector('[data-nav-logo]');
      const from = monogramRef.current?.getBoundingClientRect();
      const to = target?.getBoundingClientRect();

      tl.to('.pl-meta', {
        opacity: 0,
        y: -14,
        duration: 0.3,
        stagger: 0.03,
        ease: ease.snap,
      });

      if (from && to) {
        const dx = to.left + to.width / 2 - (from.left + from.width / 2);
        const dy = to.top + to.height / 2 - (from.top + from.height / 2);
        const scale = Math.max(0.12, to.width / from.width);

        tl.to(
          monogramRef.current,
          {
            x: dx,
            y: dy,
            scale,
            duration: 0.75,
            ease: 'power3.inOut',
          },
          '-=0.12',
        );
      } else {
        tl.to(monogramRef.current, { scale: 0.2, opacity: 0, duration: 0.5 }, '-=0.12');
      }

      // Panels wipe upward, revealing the hero already composed underneath.
      tl.to(
        '.pl-panel',
        {
          yPercent: -102,
          duration: 0.72,
          stagger: 0.055,
          ease: 'power4.inOut',
        },
        '-=0.25',
      );
    }, rootRef);

    return () => {
      startedRef.current = false;
      ctx.revert();
    };
  }, [complete, onFinish]);

  /* ── Reduced motion: skip the choreography entirely ────────────────── */
  useEffect(() => {
    if (!reducedMotion || !complete || startedRef.current) return;
    startedRef.current = true;
    setFinished(true);
    delete document.body.dataset.scrollLocked;
    onFinish();
  }, [reducedMotion, complete, onFinish]);

  if (finished) return null;

  const tickerIndex = Math.min(TICKER.length - 1, Math.floor(progress * TICKER.length));
  const revealedCount = Math.round(progress * PHRASE.length);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[150] overflow-hidden bg-ink text-cream"
      aria-busy={!complete}
    >
      {/* Wipe panels sit above the content and lift away on exit. */}
      <div ref={panelsRef} className="pointer-events-none absolute inset-0 z-20 flex" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="pl-panel h-full flex-1 bg-ink" />
        ))}
      </div>

      {/* Decorative field */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <Starburst
          rays={16}
          className="absolute -top-24 -right-24 h-72 w-72 text-volt/15 animate-spin-slow sm:h-96 sm:w-96"
        />
        <Starburst
          rays={8}
          className="absolute -bottom-20 -left-20 h-56 w-56 text-flare/20 animate-spin-rev"
        />
        <div className="halftone absolute inset-x-0 bottom-0 h-40 text-volt/10" />
        <div className="grain-layer absolute inset-0" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-8 px-6">
        {/* Monogram — the element that travels into the nav */}
        <div className="relative">
          <span
            ref={monogramRef}
            data-nav-logo-target
            className="block font-display text-[clamp(4rem,18vw,11rem)] leading-none text-volt"
            style={{ letterSpacing: '-0.07em' }}
          >
            SP
          </span>
          <Starburst
            rays={10}
            className="absolute -top-4 -right-8 h-10 w-10 text-flare animate-spin-slow sm:-right-12 sm:h-14 sm:w-14"
          />
        </div>

        {/* Phrase, revealed letter by letter as real progress advances */}
        <p className="pl-meta font-mono text-[clamp(0.62rem,2.4vw,0.9rem)] tracking-[0.32em] text-cream/80">
          <span aria-hidden="true">
            {PHRASE.split('').map((char, i) => (
              <span
                key={i}
                className="inline-block transition-opacity duration-200"
                style={{ opacity: i < revealedCount ? 1 : 0.14 }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </span>
          <span className="sr-only">
            {complete ? 'Loading complete' : 'Loading my universe'}
          </span>
        </p>

        {/* Progress track — a block that fills, not a thin generic bar */}
        <div className="pl-meta w-full max-w-md">
          <div
            className="relative h-2.5 w-full overflow-hidden border border-volt/40"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            aria-label="Loading portfolio"
          >
            <div
              className="absolute inset-y-0 left-0 bg-volt transition-[width] duration-150 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="mt-3 flex items-baseline justify-between font-mono text-[0.62rem] tracking-[0.2em] text-cream/55 sm:text-xs">
            <span className="text-volt">{TICKER[tickerIndex]}</span>
            <span className="tabular-nums text-3xl font-bold text-cream sm:text-4xl">
              {String(percent).padStart(2, '0')}
              <span className="text-volt">%</span>
            </span>
          </div>
        </div>

        <div className="pl-meta flex items-center gap-3 font-mono text-[0.55rem] tracking-[0.3em] text-cream/35 sm:text-[0.65rem]">
          <CrossMark className="h-3 w-3 text-volt" />
          <span>SUYASH PANDEY</span>
          <span className="text-volt">/</span>
          <span>PORTFOLIO 2026</span>
          <CrossMark className="h-3 w-3 text-volt" />
        </div>
      </div>

      {/*
        Screen-reader status is announced twice only — at the start and when
        the site is ready — rather than on every percentage tick.
      */}
      <span className="sr-only" aria-live="assertive" aria-atomic="true">
        {complete ? 'Portfolio ready' : ''}
      </span>
    </div>
  );
}
