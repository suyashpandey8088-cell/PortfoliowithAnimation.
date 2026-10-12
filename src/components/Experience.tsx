import { useEffect, useRef, useState } from 'react';
import { experiences } from '@/content/experience';
import { accentText, type Accent } from '@/lib/accents';
import { initGsap } from '@/lib/gsap';
import { useIsDesktop } from '@/lib/useMediaQuery';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { MaskedText, FadeUp } from './Reveal';
import { Starburst, Blob, Rings, ZigZag, CrossMark } from './graphics/Primitives';

/**
 * EXPERIENCE — FIVE CHAPTERS
 * ─────────────────────────────────────────────────────────────────────────
 * Desktop: one pinned stage. Scroll progress selects the active chapter, a
 * line fills to show position, and the active entry becomes dominant while
 * the others stay visible as a compact rail.
 *
 * Mobile: no pinning at all. The same content becomes a natural vertical
 * sequence — a large pinned timeline on a narrow screen is a trap, not a
 * feature.
 *
 * Accessibility: every chapter is reachable without completing the animation.
 * The rail buttons jump to a chapter directly, and a screen-reader-only list
 * exposes all five in full regardless of scroll position.
 */

const CHAPTERS = experiences.length;

/** Distinct motif per role, so chapters read as different, not repeated. */
function ChapterMotif({ index, accent }: { index: number; accent: Accent }) {
  const cls = `h-full w-full ${accentText[accent]}`;
  switch (index % 5) {
    case 0:
      return <Starburst rays={12} className={`${cls} animate-spin-slow`} />;
    case 1:
      return <Blob variant={0} className={`${cls} animate-bob`} />;
    case 2:
      return <Starburst rays={6} innerRatio={0.6} className={`${cls} animate-spin-rev`} />;
    case 3:
      return <ZigZag className={`${cls}`} />;
    default:
      return <Rings className={`${cls} animate-spin-slow`} />;
  }
}

export default function Experience() {
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();
  const pinned = isDesktop && !reducedMotion;

  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!pinned) return;
    const track = trackRef.current;
    if (!track) return;

    const g = initGsap();
    const ctx = g.context(() => {
      g.timeline({
        scrollTrigger: {
          trigger: track,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          onUpdate: (self) => {
            const next = Math.min(CHAPTERS - 1, Math.floor(self.progress * CHAPTERS));
            setActive((prev) => (prev === next ? prev : next));
          },
        },
      });

      // The fill line tracks raw progress rather than the active index, so it
      // moves continuously instead of stepping.
      g.fromTo(
        '[data-progress-fill]',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          transformOrigin: 'top center',
          scrollTrigger: { trigger: track, start: 'top top', end: 'bottom bottom', scrub: true },
        },
      );
    }, trackRef);

    return () => ctx.revert();
  }, [pinned]);

  /* Mobile / reduced-motion: the spine still fills, but over a normal
     vertical scroll rather than a pinned runway. */
  useEffect(() => {
    if (pinned || reducedMotion) return;
    const track = mobileTrackRef.current;
    if (!track) return;

    const g = initGsap();
    const ctx = g.context(() => {
      g.fromTo(
        '[data-progress-fill]',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          transformOrigin: 'top center',
          scrollTrigger: { trigger: track, start: 'top 75%', end: 'bottom 60%', scrub: true },
        },
      );
    }, mobileTrackRef);

    return () => ctx.revert();
  }, [pinned, reducedMotion]);

  /** Jump the runway so a given chapter becomes active. */
  const goToChapter = (index: number) => {
    const track = trackRef.current;
    if (!track || !pinned) return;
    const rect = track.getBoundingClientRect();
    const trackHeight = rect.height - window.innerHeight;
    const target = window.scrollY + rect.top + (trackHeight * index) / CHAPTERS + 4;
    window.scrollTo({ top: target, behavior: 'smooth' });
  };


  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="relative overflow-hidden bg-ink text-cream"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="halftone absolute inset-x-0 bottom-0 h-52 text-volt/[0.06]" />
        <Starburst
          rays={20}
          className="absolute -top-32 right-0 h-96 w-96 animate-spin-slow text-ember/[0.07]"
        />
        <div className="grain-layer absolute inset-0" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="pt-24 sm:pt-32 lg:pt-40">
          <FadeUp className="mb-10 flex items-center gap-3 font-mono text-[0.6rem] tracking-[0.3em] text-cream/60">
            <CrossMark className="h-3 w-3 text-volt" />
            <span>02 / EXPERIENCE</span>
            <span className="h-px w-16 bg-cream/25" />
          </FadeUp>

          <MaskedText
            as="h2"
            id="experience-heading"
            lines={['FIVE INTERNSHIPS.', <span key="2" className="text-volt">FIVE DIFFERENT PERSPECTIVES.</span>]}
            className="font-display text-[clamp(2.1rem,6.6vw,5.8rem)] leading-[0.9] tracking-[-0.035em]"
          />

          <FadeUp delay={0.15} className="mt-8 max-w-2xl">
            <p className="text-[clamp(0.95rem,1.9vw,1.15rem)] leading-relaxed text-cream/70">
              Five placements across AI, data, web and solutions work. Each one taught me
              something the others could not — and each one changed how I approach the next
              problem.
            </p>
          </FadeUp>
        </div>

        {/* ── Screen-reader-only full list ───────────────────────────── */}
        <ol className="sr-only">
          {experiences.map((entry) => (
            <li key={entry.index}>
              <h3>
                {entry.index}. {entry.role} — {entry.company}
              </h3>
              <p>
                {entry.startDate} – {entry.endDate}, {entry.location}
              </p>
              <p>{entry.description}</p>
            </li>
          ))}
        </ol>

        {pinned ? (
          /* ── DESKTOP: pinned chapter stage ─────────────────────────── */
          <div ref={trackRef} className="relative h-[440vh]">
            <div className="sticky top-0 flex h-[100svh] items-center py-24">
              <div className="grid w-full grid-cols-[16rem_1px_1fr] gap-10">
                {/* Rail */}
                <ul ref={railRef} className="space-y-1">
                  {experiences.map((entry, i) => {
                    const isActive = i === active;
                    return (
                      <li key={entry.index}>
                        <button
                          type="button"
                          onClick={() => goToChapter(i)}
                          aria-current={isActive ? 'step' : undefined}
                          className={`group flex w-full items-baseline gap-3 border-l-2 py-2.5 pl-4 text-left transition-all duration-300 ${
                            isActive
                              ? 'border-volt bg-cream/[0.04]'
                              : 'border-cream/12 hover:border-cream/40'
                          }`}
                        >
                          <span
                            className={`font-mono text-[0.6rem] transition-colors ${
                              isActive ? accentText[entry.accent] : 'text-cream/35'
                            }`}
                          >
                            {entry.index}
                          </span>
                          <span
                            className={`font-display text-[clamp(0.85rem,1.5vw,1.15rem)] transition-colors ${
                              isActive ? 'text-cream' : 'text-cream/40 group-hover:text-cream/70'
                            }`}
                          >
                            {entry.role}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                  <li className="pt-6 font-mono text-[0.55rem] leading-relaxed tracking-[0.16em] text-cream/30">
                    SCROLL TO MOVE
                    <br />
                    THROUGH THE CHAPTERS
                  </li>
                </ul>

                {/* Progress line */}
                <div className="relative h-full bg-cream/10">
                  <div data-progress-fill className="absolute inset-x-0 top-0 h-full bg-volt" />
                  <div
                    className="absolute -left-1.5 h-3 w-3 rounded-full bg-volt ring-4 ring-ink transition-[top] duration-300"
                    style={{ top: `${(active / Math.max(1, CHAPTERS - 1)) * 100}%` }}
                    aria-hidden="true"
                  />
                </div>

                {/* Chapter stage */}
                <div className="relative min-h-[24rem]">
                  {experiences.map((entry, i) => {
                    const isActive = i === active;
                    return (
                      <article
                        key={entry.index}
                        aria-hidden={!isActive}
                        className={`absolute inset-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          isActive
                            ? 'visible translate-y-0 opacity-100'
                            : 'invisible translate-y-6 opacity-0'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-6">
                          <span
                            className={`font-display leading-none ${accentText[entry.accent]}`}
                            style={{ fontSize: 'clamp(4rem, 13vw, 10rem)' }}
                          >
                            {entry.index}
                          </span>
                          <div className="h-16 w-16 shrink-0 sm:h-20 sm:w-20" aria-hidden="true">
                            <ChapterMotif index={i} accent={entry.accent} />
                          </div>
                        </div>

                        <h3 className="mt-2 font-display text-[clamp(1.6rem,4.4vw,3.6rem)] leading-[0.95]">
                          {entry.role}
                        </h3>

                        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[0.6rem] tracking-[0.18em] text-cream/50">
                          <span className="text-cream/85">{entry.company}</span>
                          <span className="text-cream/25">|</span>
                          <span>
                            {entry.startDate} — {entry.endDate}
                          </span>
                          <span className="text-cream/25">|</span>
                          <span>{entry.location}</span>
                        </div>

                        <p className="mt-5 max-w-2xl text-[clamp(0.95rem,1.7vw,1.1rem)] leading-relaxed text-cream/72">
                          {entry.description}
                        </p>

                        <p className="mt-4 font-mono text-[0.6rem] tracking-[0.2em] text-flare/80 uppercase">
                          FOCUS / {entry.focus}
                        </p>

                        <ul className="mt-6 flex flex-wrap gap-2">
                          {entry.technologies.map((tech) => (
                            <li
                              key={tech}
                              className="border border-cream/25 px-3 py-1.5 font-mono text-[0.58rem] tracking-[0.14em] text-cream/70"
                            >
                              {tech}
                            </li>
                          ))}
                        </ul>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ── MOBILE / REDUCED MOTION: natural vertical sequence ───── */
          <div ref={mobileTrackRef} className="relative mt-14 pb-24 sm:mt-20 lg:pb-32">
            <div className="absolute top-0 bottom-0 left-[0.4rem] w-px bg-cream/12" aria-hidden="true">
              <div className="h-full w-full origin-top bg-volt/60" data-progress-fill />
            </div>

            <ol className="space-y-10">
              {experiences.map((entry, i) => (
                <FadeUp as="li" key={entry.index} className="relative pl-10">
                  <span
                    className={`absolute top-2 -left-[0.35rem] h-3.5 w-3.5 rounded-full ring-4 ring-ink ${
                      i === active ? 'bg-volt' : 'bg-cream/30'
                    }`}
                    aria-hidden="true"
                  />
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className={`font-display leading-none ${accentText[entry.accent]}`}
                      style={{ fontSize: 'clamp(2.6rem, 12vw, 4.5rem)' }}
                    >
                      {entry.index}
                    </span>
                    <div className="h-10 w-10 shrink-0" aria-hidden="true">
                      <ChapterMotif index={i} accent={entry.accent} />
                    </div>
                  </div>

                  <h3 className="mt-2 font-display text-[clamp(1.4rem,6vw,2.2rem)] leading-[0.95]">
                    {entry.role}
                  </h3>

                  <div className="mt-3 space-y-1 font-mono text-[0.58rem] tracking-[0.16em] text-cream/50">
                    <p className="text-cream/85">{entry.company}</p>
                    <p>
                      {entry.startDate} — {entry.endDate} · {entry.location}
                    </p>
                  </div>

                  <p className="mt-4 text-[0.95rem] leading-relaxed text-cream/72">
                    {entry.description}
                  </p>

                  <p className="mt-3 font-mono text-[0.55rem] tracking-[0.18em] text-flare/80 uppercase">
                    FOCUS / {entry.focus}
                  </p>

                  <ul className="mt-4 flex flex-wrap gap-2">
                    {entry.technologies.map((tech) => (
                      <li
                        key={tech}
                        className="border border-cream/25 px-2.5 py-1 font-mono text-[0.55rem] tracking-[0.12em] text-cream/70"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </FadeUp>
              ))}
            </ol>
          </div>
        )}

        {/* Editorial note on the placeholder state */}
        <FadeUp className="border-t border-cream/12 py-6">
          <p className="font-mono text-[0.55rem] leading-relaxed tracking-[0.14em] text-ember/80">
            ⚠ COMPANY NAMES, DATES AND TECHNOLOGIES ARE PLACEHOLDERS — EDIT{' '}
            <code className="text-cream/70">src/content/experience.ts</code>
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
