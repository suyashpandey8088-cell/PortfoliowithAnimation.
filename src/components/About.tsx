import { profile } from '@/content/profile';
import { MaskedText, FadeUp } from './Reveal';
import {
  Starburst,
  Blob,
  SquiggleUnderline,
  TechDiagram,
  CrossMark,
  CircularLabel,
} from './graphics/Primitives';
import Parallax from './Parallax';

/**
 * ABOUT — an editorial spread, not a biography card.
 * Dominant colour: cobalt. Cream carries the type.
 *
 * Deliberately no photograph is invented. The "portrait" is a designed
 * typographic avatar built from the SP monogram, which is also the mark used
 * in the nav, the preloader and the hero's final composition — so the
 * identity stays continuous.
 */
export default function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative overflow-hidden bg-cobalt text-cream"
    >
      {/* Decorative field */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="halftone absolute inset-x-0 top-0 h-40 text-cream/10" />
        <Starburst
          rays={18}
          className="absolute -top-24 -left-24 h-80 w-80 animate-spin-slow text-cream/[0.08]"
        />
        <div className="grain-layer absolute inset-0" />
        {/* Dashed path threading the layout together */}
        <svg
          className="absolute inset-0 h-full w-full text-cream/20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="5 7"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <path d="M12 8C40 22 22 44 46 52s34-8 42 14-30 26-16 34" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-[1600px] px-4 py-24 sm:px-6 sm:py-32 lg:px-10 lg:py-40">
        {/* Section label */}
        <FadeUp className="mb-10 flex items-center gap-3 font-mono text-[0.6rem] tracking-[0.3em] text-cream/60">
          <CrossMark className="h-3 w-3 text-volt" />
          <span>01 / ABOUT</span>
          <span className="h-px w-16 bg-cream/25" />
        </FadeUp>

        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          {/* ── Headline side ────────────────────────────────────────── */}
          <div>
            <MaskedText
              as="h2"
              id="about-heading"
              lines={[
                profile.aboutHeadline[0],
                <span key="2" className="text-volt">
                  {profile.aboutHeadline[1]}
                </span>,
              ]}
              className="font-display text-[clamp(2.4rem,7.6vw,6.4rem)] leading-[0.87] tracking-[-0.035em]"
            />

            {/* Body copy, revealed in readable groups */}
            <div className="mt-10 max-w-2xl space-y-5">
              {profile.aboutBody.map((paragraph, i) => (
                <FadeUp key={i} delay={i * 0.08}>
                  <p
                    className={
                      i === 0
                        ? 'text-[clamp(1.02rem,2.1vw,1.3rem)] leading-relaxed font-medium text-cream'
                        : 'text-[clamp(0.92rem,1.7vw,1.05rem)] leading-relaxed text-cream/72'
                    }
                  >
                    {paragraph}
                  </p>
                </FadeUp>
              ))}
            </div>

            {/* Interests as sticker chips */}
            <FadeUp delay={0.2} className="mt-10">
              <p className="mb-4 font-mono text-[0.58rem] tracking-[0.28em] text-cream/50">
                PROFESSIONAL INTERESTS /
              </p>
              <ul className="flex flex-wrap gap-2.5">
                {profile.interests.map((interest) => (
                  <li
                    key={interest}
                    className="group cursor-default border border-cream/30 bg-cream/5 px-3.5 py-2 font-mono text-[0.6rem] tracking-[0.14em] uppercase transition-all duration-200 hover:-translate-y-0.5 hover:border-volt hover:bg-volt hover:text-ink"
                  >
                    {interest}
                  </li>
                ))}
              </ul>
            </FadeUp>
          </div>

          {/* ── Portrait / details side ──────────────────────────────── */}
          <div className="relative">
            <Parallax speed={-0.06} className="relative mx-auto w-full max-w-sm lg:max-w-none">
              {/* Typographic avatar — abstract, no invented photograph */}
              <div className="relative aspect-square w-full">
                <Blob
                  variant={1}
                  className="absolute inset-0 h-full w-full text-cream"
                  aria-hidden="true"
                />
                <div className="absolute inset-0 grid place-items-center">
                  <span
                    className="font-display text-ink"
                    style={{ fontSize: 'clamp(5rem, 20vw, 11rem)', letterSpacing: '-0.09em' }}
                    aria-hidden="true"
                  >
                    SP
                  </span>
                </div>
                <CircularLabel
                  id="about-ring"
                  text="· NAVI MUMBAI · INDIA · AI & DATA SCIENCE · "
                  className="absolute -right-4 -bottom-4 h-28 w-28 animate-spin-slow text-cream sm:h-32 sm:w-32"
                  aria-hidden="true"
                />
                <Starburst
                  rays={10}
                  className="absolute -top-3 -left-3 h-12 w-12 animate-spin-rev text-flare"
                  aria-hidden="true"
                />
              </div>
            </Parallax>

            {/* Detail table */}
            <FadeUp delay={0.15} className="mt-10 border-t border-cream/20">
              <dl className="divide-y divide-cream/12">
                <DetailRow label="NAME" value={`${profile.firstName} ${profile.lastName}`} />
                <DetailRow label="LOCATION" value={profile.location} />
                <DetailRow label="EDUCATION" value={profile.education} />
                <DetailRow label="UNIVERSITY" value={profile.university} note="Confirm the official institution name before publishing." />
                <DetailRow label="FOCUS" value="AI · Web · Solutions · Creative tech" />
              </dl>
            </FadeUp>

            <Parallax speed={0.05} className="mt-10 hidden lg:block" aria-hidden="true">
              <TechDiagram className="h-28 w-full text-cream/35" />
            </Parallax>
          </div>
        </div>

        {/* Pull quote / editorial annotation */}
        <FadeUp delay={0.1} className="relative mt-20 max-w-3xl">
          <p className="relative font-display text-[clamp(1.35rem,4.2vw,2.9rem)] leading-[1.02]">
            CURIOSITY FIRST.{' '}
            <span className="text-expressive text-flare">USEFULNESS</span> ALWAYS.
            <SquiggleUnderline className="absolute -bottom-3 left-0 h-3 w-40 text-volt sm:w-64" />
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

function DetailRow({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="grid gap-1 py-4 sm:grid-cols-[8.5rem_1fr] sm:gap-6">
      <dt className="font-mono text-[0.58rem] tracking-[0.24em] text-cream/45">{label}</dt>
      <dd>
        <span className="block text-[clamp(0.95rem,1.8vw,1.1rem)] font-medium text-cream">
          {value}
        </span>
        {note ? (
          <span className="mt-1 block font-mono text-[0.55rem] tracking-[0.12em] text-flare/80">
            ⚠ {note}
          </span>
        ) : null}
      </dd>
    </div>
  );
}
