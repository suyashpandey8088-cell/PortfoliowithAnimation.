import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { navItems, themeForSection } from '@/content/nav';
import { profile } from '@/content/profile';
import { scrollToSection } from '@/lib/links';
import { useActiveSection } from '@/lib/useActiveSection';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { Starburst } from './graphics/Primitives';

/**
 * NAVIGATION
 * ─────────────────────────────────────────────────────────────────────────
 * Fixed, frameless, and re-themed per section rather than blended.
 *
 * Links are real anchors pointing at section ids, so they still work if the
 * scroll handler never attaches; JavaScript only upgrades them to a
 * reduced-motion-aware smooth scroll.
 */
export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reducedMotion = useReducedMotion();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const sectionIds = useMemo(() => navItems.map((n) => n.id), []);
  const active = useActiveSection(sectionIds);
  const theme = themeForSection(active === '' ? 'hero' : active);

  const isDark = theme === 'dark';

  /* Collapse the nav's padding once the visitor is past the hero. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = useCallback(
    (id: string) => (event: React.MouseEvent) => {
      event.preventDefault();
      setOpen(false);
      if (id === 'hero') {
        window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
        return;
      }
      scrollToSection(id, reducedMotion);
    },
    [reducedMotion],
  );

  /* Escape closes the menu; Tab is trapped inside it while open. */
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
      if (e.key !== 'Tab' || !menuRef.current) return;

      const focusables = menuRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    // Move focus into the panel so keyboard users land somewhere sensible.
    const focusables = menuRef.current?.querySelectorAll<HTMLElement>('a[href]');
    focusables?.[0]?.focus();

    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  /* Lock page scroll behind the open menu. */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const fg = isDark ? 'text-ink' : 'text-cream';
  const subtle = isDark ? 'text-ink/55' : 'text-cream/55';

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[100] transition-[padding,background-color] duration-300 ${
          scrolled ? 'py-2' : 'py-4'
        } ${scrolled ? (isDark ? 'bg-cream/85' : 'bg-ink/70') : 'bg-transparent'} backdrop-blur-[2px]`}
      >
        <nav
          aria-label="Primary"
          className={`mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10 ${fg}`}
        >
          {/* Logo — also the landing target for the preloader's monogram */}
          <a
            href="#hero"
            onClick={go('hero')}
            data-nav-logo
            className="group relative flex items-center gap-2.5"
            aria-label="Suyash Pandey — back to top"
          >
            <span
              className={`relative z-10 font-display text-2xl leading-none transition-transform duration-300 group-hover:scale-110 sm:text-[1.7rem] ${
                isDark ? 'text-ink' : 'text-volt'
              }`}
              style={{ letterSpacing: '-0.07em' }}
            >
              SP
            </span>
            <Starburst
              rays={10}
              className="h-4 w-4 text-flare transition-transform duration-500 group-hover:rotate-90 sm:h-5 sm:w-5"
            />
            <span className={`hidden font-mono text-[0.55rem] tracking-[0.24em] sm:block ${subtle}`}>
              / PORTFOLIO
            </span>
          </a>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={go(item.id)}
                    aria-current={isActive ? 'true' : undefined}
                    className="group relative flex items-baseline gap-1.5 overflow-hidden px-3 py-2 font-mono text-[0.68rem] tracking-[0.18em] uppercase"
                  >
                    <span className={`text-[0.55rem] transition-colors ${isActive ? 'text-flare' : subtle}`}>
                      {item.index}
                    </span>
                    {/* Label slides up, a duplicate slides in from below. */}
                    <span className="relative block h-[1.1em] overflow-hidden">
                      <span className="block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full">
                        {item.label}
                      </span>
                      <span className="absolute inset-x-0 top-0 block translate-y-full text-flare transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0">
                        {item.label}
                      </span>
                    </span>
                    {/* Underline grows from the left */}
                    <span
                      className={`absolute inset-x-3 bottom-1 h-[2px] origin-left bg-current transition-transform duration-300 ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            {/* Availability — never colour-only; the dot is paired with text */}
            <span
              className={`hidden items-center gap-2 border px-2.5 py-1.5 font-mono text-[0.52rem] tracking-[0.18em] lg:inline-flex ${
                isDark ? 'border-ink/25 text-ink/70' : 'border-cream/25 text-cream/70'
              }`}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-volt opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-volt" />
              </span>
              {profile.availability}
            </span>

            {/* Menu control */}
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className={`flex h-11 w-11 flex-col items-center justify-center gap-[5px] border transition-colors md:hidden ${
                isDark ? 'border-ink/25' : 'border-cream/25'
              }`}
            >
              <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
              <span
                aria-hidden="true"
                className={`block h-[2px] w-5 bg-current transition-transform duration-300 ${
                  open ? 'translate-y-[3.5px] rotate-45' : ''
                }`}
              />
              <span
                aria-hidden="true"
                className={`block h-[2px] w-5 bg-current transition-transform duration-300 ${
                  open ? '-translate-y-[3.5px] -rotate-45' : ''
                }`}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        ref={menuRef}
        hidden={!open}
        className="fixed inset-0 z-[99] flex flex-col justify-center bg-ink px-6 md:hidden"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <Starburst
            rays={16}
            className="absolute -right-16 -bottom-16 h-64 w-64 text-volt/10 animate-spin-slow"
          />
          <div className="halftone absolute inset-x-0 top-0 h-32 text-flare/10" />
        </div>

        <p className="relative mb-6 font-mono text-[0.6rem] tracking-[0.3em] text-cream/40">
          NAVIGATE /
        </p>
        <ul className="relative space-y-2">
          {navItems.map((item, i) => (
            <li
              key={item.id}
              style={{
                animation: open ? `menu-in 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 0.06 + 0.05}s both` : undefined,
              }}
            >
              <a
                href={`#${item.id}`}
                onClick={go(item.id)}
                className="group flex items-baseline gap-3 border-b border-cream/10 py-3"
              >
                <span className="font-mono text-[0.6rem] text-flare">{item.index}</span>
                <span className="font-display text-[clamp(2rem,11vw,3.5rem)] text-cream transition-colors group-hover:text-volt">
                  {item.label}
                </span>
              </a>
            </li>
          ))}
        </ul>
        <p className="relative mt-8 font-mono text-[0.55rem] tracking-[0.2em] text-cream/35">
          {profile.location.toUpperCase()}
        </p>

        <style>{`@keyframes menu-in{from{opacity:0;transform:translate3d(0,24px,0)}to{opacity:1;transform:none}}`}</style>
      </div>
    </>
  );
}
