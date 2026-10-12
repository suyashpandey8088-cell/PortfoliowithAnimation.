import { useEffect, useRef } from 'react';
import { profile } from '@/content/profile';
import { isConfigured } from '@/lib/links';
import { initGsap } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/useReducedMotion';
import Marquee from './Marquee';
import SocialIcon from './SocialIcon';
import { Starburst, CrossMark } from './graphics/Primitives';

/**
 * FOOTER — the closing scene.
 *
 * The oversized outlined "SUYASH PANDEY" echoes the hero headline, so the
 * experience ends on the same typographic note it started on. The name
 * expands slightly as it enters, giving the page a deliberate full stop
 * instead of running out of content.
 */
export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const year = new Date().getFullYear();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    const g = initGsap();
    const ctx = g.context(() => {
      g.fromTo(
        '[data-signoff]',
        { scale: 0.86, autoAlpha: 0.2 },
        {
          scale: 1,
          autoAlpha: 1,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 95%', end: 'bottom bottom', scrub: true },
        },
      );
    }, ref);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <footer ref={ref} className="relative overflow-hidden bg-ink text-cream">
      <Marquee reverse className="border-b-2 border-cream/12 py-4">
        {['OPEN TO OPPORTUNITIES', 'AI', 'WEB', 'DATA', 'SOLUTIONS', 'CREATIVE TECH'].map(
          (word, i) => (
            <span key={i} className="flex items-center">
              <span className="px-6 font-mono text-[0.65rem] tracking-[0.3em] text-cream/45">
                {word}
              </span>
              <CrossMark className="h-3 w-3 text-volt" />
            </span>
          ),
        )}
      </Marquee>

      <div className="relative mx-auto max-w-[1600px] px-4 py-16 sm:px-6 lg:px-10">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <Starburst
            rays={16}
            className="absolute -top-10 right-0 h-48 w-48 animate-spin-slow text-volt/[0.08]"
          />
        </div>

        {/* Sign-off */}
        <div className="relative">
          <p className="font-mono text-[0.58rem] tracking-[0.3em] text-cream/45">
            THANKS FOR SCROLLING ALL THE WAY DOWN /
          </p>
          <p
            data-signoff
            className="mt-6 font-display text-[clamp(2.4rem,12vw,10rem)] leading-[0.85] tracking-[-0.045em] text-cream text-outline will-change-transform"
          >
            SUYASH
            <br />
            PANDEY.
          </p>
          <p className="mt-6 max-w-md text-[0.92rem] leading-relaxed text-cream/60">
            Built by hand — art direction, animation system and all. No template was harmed in
            the making of this portfolio.
          </p>
        </div>

        {/* Links + meta */}
        <div className="relative mt-14 grid gap-10 border-t border-cream/12 pt-8 sm:grid-cols-[1fr_auto]">
          <div className="flex flex-wrap gap-4">
            {profile.socials.map((social) =>
              isConfigured(social.url) ? (
                <a
                  key={social.id}
                  href={social.url}
                  {...(social.url.startsWith('http')
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className="group flex items-center gap-2 border border-cream/25 px-3.5 py-2 font-mono text-[0.58rem] tracking-[0.16em] uppercase transition-colors duration-200 hover:border-volt hover:bg-volt hover:text-ink"
                >
                  <SocialIcon icon={social.icon} className="h-4 w-4" />
                  {social.label}
                </a>
              ) : (
                <span
                  key={social.id}
                  className="flex cursor-not-allowed items-center gap-2 border border-dashed border-cream/20 px-3.5 py-2 font-mono text-[0.58rem] tracking-[0.16em] text-cream/30 uppercase"
                  title="Not configured yet"
                >
                  <SocialIcon icon={social.icon} className="h-4 w-4" />
                  {social.label}
                </span>
              ),
            )}
          </div>

          <div className="flex flex-col items-start gap-2 font-mono text-[0.55rem] tracking-[0.18em] text-cream/40 sm:items-end">
            <span>© {year} SUYASH PANDEY</span>
            <span>{profile.location.toUpperCase()}</span>
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
              }}
              className="group inline-flex items-center gap-2 text-cream/70 transition-colors hover:text-volt"
            >
              BACK TO TOP
              <span
                className="inline-block transition-transform duration-300 group-hover:-translate-y-1"
                aria-hidden="true"
              >
                ↑
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
