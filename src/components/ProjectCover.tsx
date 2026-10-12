import { useState } from 'react';
import type { Project } from '@/content/types';
import { accentHex, type Accent } from '@/lib/accents';
import { Starburst, Blob, ZigZag } from './graphics/Primitives';

/**
 * PROJECT COVER ARTWORK
 * ─────────────────────────────────────────────────────────────────────────
 * If a real screenshot exists it is used (lazy, with reserved dimensions so
 * nothing shifts). If not, a generated composition stands in — built from the
 * project's own accent and number, so every placeholder still has a distinct
 * visual identity rather than a grey box.
 *
 * Nothing here pretends to be a product screenshot.
 */
export default function ProjectCover({
  project,
  className = '',
}: {
  project: Project;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const hasImage = Boolean(project.cover) && !failed;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Skeleton — shown until the real image lands, or forever if there is none */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{ backgroundColor: '#151515' }}
      >
        <GeneratedArt accent={project.accent} number={project.number} />
      </div>

      {hasImage ? (
        <img
          src={project.cover}
          alt={`${project.title} — cover`}
          loading="lazy"
          decoding="async"
          width={1200}
          height={800}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`relative h-full w-full object-cover transition-opacity duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : (
        // No asset configured: the generated artwork *is* the cover.
        <span className="relative block h-full w-full" aria-hidden="true">
          <GeneratedArt accent={project.accent} number={project.number} />
        </span>
      )}
    </div>
  );
}

function GeneratedArt({ accent, number }: { accent: Accent; number: string }) {
  const hex = accentHex[accent];
  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 400 280"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect width="400" height="280" fill="#151515" />
      <g opacity="0.5">
        {Array.from({ length: 14 }, (_, i) => (
          <circle
            key={i}
            cx={(i * 53) % 400}
            cy={(i * 97) % 280}
            r={2 + (i % 3)}
            fill={hex}
            opacity={0.25 + (i % 4) * 0.12}
          />
        ))}
      </g>
      <g transform="translate(300 60)" opacity="0.85">
        <Starburst rays={12} className="h-24 w-24" style={{ color: hex }} />
      </g>
      <g transform="translate(24 190)" opacity="0.6">
        <Blob variant={2} className="h-20 w-20" style={{ color: hex }} />
      </g>
      <g transform="translate(24 30)" opacity="0.7">
        <ZigZag className="h-6 w-28" style={{ color: hex }} />
      </g>
      <text
        x="24"
        y="252"
        fontFamily="'Archivo Black', 'Arial Black', sans-serif"
        fontSize="86"
        fill="none"
        stroke={hex}
        strokeWidth="2"
        opacity="0.55"
      >
        {number}
      </text>
    </svg>
  );
}
