import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Starburst, HandArrow } from '@/components/graphics/Primitives';

/** Branded 404 — echoes the hero's typographic language. */
export default function NotFound() {
  useEffect(() => {
    document.title = 'Page not found — Suyash Pandey';
  }, []);

  return (
    <main className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-ink px-6 text-center text-cream">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <Starburst
          rays={18}
          className="absolute -top-24 -left-24 h-96 w-96 animate-spin-slow text-volt/10"
        />
        <Starburst
          rays={10}
          className="absolute -right-20 -bottom-20 h-80 w-80 animate-spin-rev text-flare/10"
        />
        <div className="grain-layer absolute inset-0" />
      </div>

      <div className="relative">
        <p className="font-mono text-[0.6rem] tracking-[0.3em] text-cream/45">ERROR 404 /</p>
        <p
          className="mt-4 font-display text-[clamp(4rem,22vw,14rem)] leading-none text-volt"
          style={{ letterSpacing: '-0.08em' }}
        >
          404
        </p>
        <h1 className="mt-4 font-display text-[clamp(1.2rem,4vw,2.4rem)] leading-tight">
          THIS CORNER OF THE UNIVERSE
          <br />
          <span className="text-flare">IS STILL EMPTY.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-[0.95rem] leading-relaxed text-cream/60">
          The page you were looking for does not exist — or has not been built yet.
        </p>

        <Link
          to="/"
          className="group mt-10 inline-flex items-center gap-3 border-2 border-cream px-6 py-4 font-mono text-[0.62rem] tracking-[0.24em] uppercase transition-colors duration-200 hover:bg-volt hover:text-ink"
        >
          Back to the portfolio
          <span
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          >
            <HandArrow towards="right" className="h-4 w-4" />
          </span>
        </Link>
      </div>
    </main>
  );
}
