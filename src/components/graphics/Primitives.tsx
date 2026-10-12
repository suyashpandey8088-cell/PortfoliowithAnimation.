import type { SVGProps } from 'react';

/**
 * DECORATIVE GRAPHICS LIBRARY
 * ─────────────────────────────────────────────────────────────────────────
 * Original SVG only — no stock imagery anywhere on this site.
 *
 * Every graphic inherits `currentColor` so it takes the colour of its
 * container, and every one is `aria-hidden` by default: decoration must
 * never be announced to a screen reader. If a graphic is meaningful, pass
 * `decorative={false}` plus a `title`.
 */

interface GraphicProps extends Omit<SVGProps<SVGSVGElement>, 'title'> {
  title?: string;
  decorative?: boolean;
}

function withA11y({ title, decorative = true, ...rest }: GraphicProps) {
  return {
    ...rest,
    ...(decorative
      ? { 'aria-hidden': true as const, focusable: false as const, role: 'presentation' as const }
      : { role: 'img' as const, 'aria-label': title }),
  };
}

/* ── Starburst ─────────────────────────────────────────────────────────── */

export function Starburst({
  rays = 12,
  innerRatio = 0.42,
  ...props
}: GraphicProps & { rays?: number; innerRatio?: number }) {
  const path: string[] = [];
  const total = rays * 2;
  for (let i = 0; i < total; i += 1) {
    const r = i % 2 === 0 ? 50 : 50 * innerRatio;
    const angle = (Math.PI * i) / rays - Math.PI / 2;
    const x = 50 + r * Math.cos(angle);
    const y = 50 + r * Math.sin(angle);
    path.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  path.push('Z');

  return (
    <svg viewBox="0 0 100 100" fill="currentColor" {...withA11y(props)}>
      <path d={path.join(' ')} />
    </svg>
  );
}

/* ── Organic blob ──────────────────────────────────────────────────────── */

const BLOB_PATHS = [
  'M62 6C86 12 99 30 95 52c-4 21-19 36-40 41C33 98 13 88 6 68-2 46 8 24 27 13 38 7 50 3 62 6Z',
  'M57 4C80 9 97 25 98 47c1 22-15 39-37 45-23 6-45-2-54-22C-2 51 5 27 25 14 34 8 46 2 57 4Z',
  'M66 5C88 13 100 34 94 55c-6 22-25 37-47 38C24 94 6 80 3 58c-3-23 10-42 31-49C43 6 55 2 66 5Z',
];

export function Blob({ variant = 0, ...props }: GraphicProps & { variant?: number }) {
  const d = BLOB_PATHS[((variant % BLOB_PATHS.length) + BLOB_PATHS.length) % BLOB_PATHS.length];
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" {...withA11y(props)}>
      <path d={d} />
    </svg>
  );
}

/* ── Hand-drawn arrow ──────────────────────────────────────────────────── */

export function HandArrow({
  towards = 'right',
  ...props
}: GraphicProps & { towards?: 'right' | 'down' | 'left' | 'up' }) {
  const rotation = { right: 0, down: 90, left: 180, up: 270 }[towards];
  return (
    // Square viewBox so any rotation stays inside the frame.
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="7"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...withA11y(props)}
    >
      <g transform={`rotate(${rotation} 50 50)`}>
        {/* Slightly wobbly shaft reads as hand-drawn, not vector-clean. */}
        <path d="M12 54c16-7 32-9 47-7 13 2 23 5 29 3" />
        <path d="M72 38l16 12-16 12" />
      </g>
    </svg>
  );
}

/* ── Hand-drawn underline ──────────────────────────────────────────────── */

export function SquiggleUnderline({ ...props }: GraphicProps) {
  return (
    <svg
      viewBox="0 0 200 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="5"
      strokeLinecap="round"
      preserveAspectRatio="none"
      {...withA11y(props)}
    >
      <path d="M3 10c22-7 44 5 66-1s44-9 66-2 40 6 62 1" />
    </svg>
  );
}

/* ── Circular label — text wrapped around a ring ───────────────────────── */

export function CircularLabel({
  text,
  id,
  ...props
}: GraphicProps & { text: string; id: string }) {
  return (
    <svg viewBox="0 0 120 120" {...withA11y(props)}>
      <defs>
        <path
          id={id}
          d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1 -88 0"
          fill="none"
        />
      </defs>
      <circle cx="60" cy="60" r="57" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
      <text
        fill="currentColor"
        fontFamily="var(--font-mono)"
        fontSize="10.5"
        letterSpacing="2.6"
        fontWeight="700"
      >
        <textPath href={`#${id}`} startOffset="0%">
          {text}
        </textPath>
      </text>
    </svg>
  );
}

/* ── Abstract technical diagram ────────────────────────────────────────── */

export function TechDiagram({ ...props }: GraphicProps) {
  return (
    <svg
      viewBox="0 0 160 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      {...withA11y(props)}
    >
      <rect x="8" y="8" width="46" height="30" />
      <rect x="106" y="8" width="46" height="30" />
      <rect x="57" y="82" width="46" height="30" />
      <path d="M54 23h52M31 38v26h49v18M129 38v26H80v18" strokeDasharray="4 4" />
      <circle cx="80" cy="64" r="6" fill="currentColor" stroke="none" />
      <circle cx="31" cy="64" r="3.5" fill="currentColor" stroke="none" />
      <circle cx="129" cy="64" r="3.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ── Halftone block — pure CSS gradient, no raster ─────────────────────── */

export function HalftoneBlock({ ...props }: GraphicProps) {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" {...withA11y(props)}>
      <defs>
        <pattern id="ht" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="1.9" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#ht)" />
    </svg>
  );
}

/* ── Cross / plus mark ─────────────────────────────────────────────────── */

export function CrossMark({ ...props }: GraphicProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      {...withA11y(props)}
    >
      <path d="M12 3v18M3 12h18" />
    </svg>
  );
}

/* ── Wave divider — used between sections ──────────────────────────────── */

export function WaveDivider({ ...props }: GraphicProps) {
  return (
    <svg
      viewBox="0 0 1200 60"
      preserveAspectRatio="none"
      fill="currentColor"
      {...withA11y(props)}
    >
      <path d="M0 30c60-30 120 30 180 30s120-60 180-60 120 60 180 60 120-60 180-60 120 60 180 60 120-60 180-60v60H0Z" />
    </svg>
  );
}

/* ── Smiley — a small custom character, not a stock emoji ──────────────── */

export function Smiley({ ...props }: GraphicProps) {
  return (
    <svg viewBox="0 0 100 100" {...withA11y(props)}>
      <circle cx="50" cy="50" r="46" fill="currentColor" />
      <circle cx="35" cy="42" r="6" fill="#151515" />
      <circle cx="65" cy="42" r="6" fill="#151515" />
      <path
        d="M28 60c6 12 14 18 22 18s16-6 22-18"
        fill="none"
        stroke="#151515"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ── Zig-zag ───────────────────────────────────────────────────────────── */

export function ZigZag({ ...props }: GraphicProps) {
  return (
    <svg
      viewBox="0 0 120 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinejoin="round"
      strokeLinecap="round"
      {...withA11y(props)}
    >
      <path d="M4 16 20 4l16 12L52 4l16 12L84 4l16 12 16-12" />
    </svg>
  );
}

/* ── Concentric rings — the shared motif across chapters ───────────────── */

export function Rings({ ...props }: GraphicProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" {...withA11y(props)}>
      <circle cx="50" cy="50" r="48" strokeWidth="1" opacity="0.4" />
      <circle cx="50" cy="50" r="34" strokeWidth="1.5" opacity="0.6" />
      <circle cx="50" cy="50" r="20" strokeWidth="2" opacity="0.8" />
      <circle cx="50" cy="50" r="6" fill="currentColor" stroke="none" />
    </svg>
  );
}
