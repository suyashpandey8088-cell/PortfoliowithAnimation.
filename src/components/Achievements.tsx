import { achievements } from '@/content/achievements';
import { MaskedText, FadeUp, StaggerGroup } from './Reveal';
import { CrossMark, Starburst, Rings } from './graphics/Primitives';

/**
 * ACHIEVEMENTS — COLLECTIBLE CARDS
 * ─────────────────────────────────────────────────────────────────────────
 * Deliberately small. A long strip of empty cards would be padding, so this
 * section renders only what exists and states plainly when it is a
 * placeholder. Nothing is fabricated, and unverified entries are visibly
 * unfinished rather than dressed up as claims.
 */

const KIND_LABEL: Record<string, string> = {
  certification: 'CERTIFICATION',
  event: 'EVENT',
  leadership: 'LEADERSHIP',
  award: 'AWARD',
  milestone: 'MILESTONE',
};

export default function Achievements() {
  const verified = achievements.filter((a) => a.verified);
  const placeholders = achievements.filter((a) => !a.verified);

  return (
    <section
      id="achievements"
      aria-labelledby="achievements-heading"
      className="relative overflow-hidden bg-volt text-ink"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="halftone absolute inset-x-0 bottom-0 h-40 text-ink/[0.07]" />
        <Starburst
          rays={18}
          className="absolute -top-16 -right-16 h-72 w-72 animate-spin-slow text-ink/[0.06]"
        />
        <div className="grain-layer absolute inset-0" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-4 py-24 sm:px-6 sm:py-32 lg:px-10">
        <FadeUp className="mb-10 flex items-center gap-3 font-mono text-[0.6rem] tracking-[0.3em] text-ink/55">
          <CrossMark className="h-3 w-3 text-grape" />
          <span>05 / HIGHLIGHTS</span>
          <span className="h-px w-16 bg-ink/20" />
        </FadeUp>

        <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-end">
          <MaskedText
            as="h2"
            id="achievements-heading"
            lines={['WHAT I HAVE', <span key="2" className="text-grape">COLLECTED SO FAR.</span>]}
            className="font-display text-[clamp(1.9rem,5.8vw,4.8rem)] leading-[0.9] tracking-[-0.035em]"
          />
          <FadeUp delay={0.12}>
            <p className="max-w-md text-[clamp(0.9rem,1.7vw,1.05rem)] leading-relaxed text-ink/70">
              Certifications, events, leadership and milestones. Only verified entries are
              published here — this section would rather be short than inflated.
            </p>
          </FadeUp>
        </div>

        {/* Oversized count strip */}
        <FadeUp delay={0.16} className="mt-12 flex flex-wrap items-end gap-x-10 gap-y-4 border-y-2 border-ink py-6">
          <Counter value={verified.length} label="VERIFIED ENTRIES" />
          <Counter value={placeholders.length} label="AWAITING ENTRY" />
          <p className="max-w-sm font-mono text-[0.55rem] leading-relaxed tracking-[0.14em] text-ink/50">
            ADD REAL ENTRIES IN <code className="text-ink/75">src/content/achievements.ts</code>{' '}
            AND SET <code className="text-ink/75">verified: true</code>.
          </p>
        </FadeUp>

        {verified.length > 0 ? (
          <StaggerGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
            {verified.map((item) => (
              <article
                key={item.id}
                className="group relative border-2 border-ink bg-cream p-6 shadow-block transition-transform duration-300 hover:-translate-y-1.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-mono text-[0.5rem] tracking-[0.2em] text-grape">
                    {KIND_LABEL[item.kind] ?? item.kind.toUpperCase()}
                  </span>
                  <Rings className="h-8 w-8 text-ink/25 transition-transform duration-500 group-hover:rotate-90" />
                </div>
                <h3 className="mt-4 font-display text-[clamp(1.05rem,2.4vw,1.5rem)] leading-tight">
                  {item.title}
                </h3>
                {item.organisation ? (
                  <p className="mt-2 font-mono text-[0.55rem] tracking-[0.14em] text-ink/55">
                    {item.organisation}
                    {item.date ? ` · ${item.date}` : ''}
                  </p>
                ) : null}
                <p className="mt-3 text-[0.85rem] leading-snug text-ink/70">{item.detail}</p>
              </article>
            ))}
          </StaggerGroup>
        ) : null}

        {placeholders.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {placeholders.map((item) => (
              <article
                key={item.id}
                className="relative border-2 border-dashed border-ink/35 p-6"
                aria-label="Placeholder entry awaiting content"
              >
                <span className="absolute top-4 right-4 border border-ink/30 px-2 py-0.5 font-mono text-[0.45rem] tracking-[0.2em] text-ink/45">
                  PLACEHOLDER
                </span>
                <h3 className="font-display text-[clamp(1rem,2.2vw,1.35rem)] leading-tight text-ink/45">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-sm text-[0.82rem] leading-snug text-ink/45">
                  {item.detail}
                </p>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Counter({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <span
        className="block font-display leading-none"
        style={{ fontSize: 'clamp(2.5rem, 8vw, 5.5rem)' }}
      >
        {String(value).padStart(2, '0')}
      </span>
      <span className="mt-1 block font-mono text-[0.52rem] tracking-[0.22em] text-ink/55">
        {label}
      </span>
    </div>
  );
}
