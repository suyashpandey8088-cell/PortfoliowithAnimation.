import { Link } from 'react-router-dom';
import { projects } from '@/content/projects';
import type { Project } from '@/content/types';
import { accentText, accentBg } from '@/lib/accents';
import { isConfigured } from '@/lib/links';
import { useTilt } from '@/hooks/useTilt';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { MaskedText, FadeUp } from './Reveal';
import Marquee from './Marquee';
import ProjectCover from './ProjectCover';
import { HandArrow, CrossMark, Starburst } from './graphics/Primitives';

/**
 * PROJECTS — A MAXIMALIST GALLERY
 * ─────────────────────────────────────────────────────────────────────────
 * Asymmetric editorial grid: every card occupies a different slot, carries a
 * different aspect ratio, and has its own accent. Deliberately not a grid of
 * identical rectangles.
 *
 * Hover reveals supplementary detail on desktop; on touch devices that same
 * detail is simply always present, so nothing is locked behind a pointer.
 */

const SPANS = [
  'lg:col-span-7',
  'lg:col-span-5',
  'lg:col-span-5',
  'lg:col-span-7',
  'lg:col-span-12',
];

const RATIOS = ['aspect-[4/3]', 'aspect-[1/1]', 'aspect-[3/4]', 'aspect-[16/10]', 'aspect-[21/9]'];

const STATUS_LABEL: Record<Project['status'], string> = {
  shipped: 'SHIPPED',
  'in-progress': 'IN PROGRESS',
  concept: 'CONCEPT',
};

export default function Projects() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="relative overflow-hidden bg-grape text-cream"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="halftone absolute inset-x-0 top-0 h-40 text-cream/10" />
        <Starburst
          rays={14}
          className="absolute -top-20 left-1/3 h-64 w-64 animate-spin-rev text-flare/15"
        />
        <div className="grain-layer absolute inset-0" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-4 pt-24 sm:px-6 sm:pt-32 lg:px-10">
        <FadeUp className="mb-10 flex items-center gap-3 font-mono text-[0.6rem] tracking-[0.3em] text-cream/60">
          <CrossMark className="h-3 w-3 text-volt" />
          <span>04 / PROJECTS</span>
          <span className="h-px w-16 bg-cream/25" />
        </FadeUp>

        <MaskedText
          as="h2"
          id="projects-heading"
          lines={["THINGS I'VE MADE.", <span key="2" className="text-flare">THINGS I'M BUILDING.</span>]}
          className="font-display text-[clamp(2rem,6.6vw,5.8rem)] leading-[0.9] tracking-[-0.035em]"
        />

        <FadeUp delay={0.12} className="mt-6 max-w-2xl">
          <p className="text-[clamp(0.92rem,1.8vw,1.1rem)] leading-relaxed text-cream/72">
            A mix of finished work and things still on the bench. Entries without a live link
            say so plainly — no button here pretends to go somewhere it does not.
          </p>
        </FadeUp>
      </div>

      {/* Tech marquee — a divider that keeps moving */}
      <Marquee className="mt-14 border-y-2 border-cream/15 py-3">
        {['PYTHON', 'REACT', 'TYPESCRIPT', 'TAILWIND', 'GSAP', 'PANDAS', 'SCIKIT-LEARN', 'SQL', 'VITE'].map(
          (word, i) => (
            <span key={i} className="flex items-center">
              <span className="px-5 font-display text-[clamp(1rem,2.4vw,1.8rem)] text-cream/80">
                {word}
              </span>
              <Starburst rays={8} className="h-4 w-4 text-volt" />
            </span>
          ),
        )}
      </Marquee>

      {/* Gallery */}
      <div className="relative mx-auto max-w-[1600px] px-4 py-16 sm:px-6 sm:py-24 lg:px-10">
        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.slug}
              project={project}
              span={SPANS[i % SPANS.length]}
              ratio={RATIOS[i % RATIOS.length]}
            />
          ))}
        </div>

        <FadeUp className="mt-12 border-t border-cream/15 pt-6">
          <p className="font-mono text-[0.55rem] leading-relaxed tracking-[0.14em] text-volt/85">
            ⚠ PROJECTS ARE LABELLED PLACEHOLDERS — ADD REAL COVERS, LINKS AND COPY IN{' '}
            <code className="text-cream/70">src/content/projects.ts</code>
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  span,
  ratio,
}: {
  project: Project;
  span: string;
  ratio: string;
}) {
  const reducedMotion = useReducedMotion();
  const tiltRef = useTilt(5);

  const hasDemo = isConfigured(project.demoUrl);
  const hasRepo = isConfigured(project.repoUrl);
  const hasCaseStudy = Boolean(project.caseStudy);

  // Prefer a case study, then the demo, then the repository.
  const primaryHref = hasCaseStudy
    ? `/work/${project.slug}`
    : hasDemo
      ? project.demoUrl
      : hasRepo
        ? project.repoUrl
        : null;
  const isInternal = hasCaseStudy;

  return (
    <article
      className={`group relative flex flex-col border-2 border-ink bg-cream text-ink shadow-block-lg transition-transform duration-300 will-change-transform ${span}`}
    >
      {/* Cover */}
      <div className={`relative ${ratio}`}>
        <div
          ref={reducedMotion ? undefined : (tiltRef as React.Ref<HTMLDivElement>)}
          className="absolute inset-0"
        >
          <ProjectCover
            project={project}
            className="h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
          />
        </div>

        {/* Oversized number, masked into the corner */}
        <span
          className={`pointer-events-none absolute -top-4 -left-2 font-display leading-none ${accentText[project.accent]}`}
          style={{ fontSize: 'clamp(3.5rem, 9vw, 7.5rem)', WebkitTextStroke: '2px #151515' }}
          aria-hidden="true"
        >
          {project.number}
        </span>

        {/* Status sticker */}
        <span
          className={`absolute top-3 right-3 border-2 border-ink px-2.5 py-1 font-mono text-[0.5rem] tracking-[0.18em] ${accentBg[project.accent]} text-ink`}
        >
          {STATUS_LABEL[project.status]}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5 sm:p-7">
        <p className="font-mono text-[0.55rem] tracking-[0.22em] text-ink/45 uppercase">
          {project.category}
        </p>

        <h3 className="mt-2 font-display text-[clamp(1.3rem,3.2vw,2.4rem)] leading-[0.95]">
          {primaryHref && isInternal ? (
            <Link to={primaryHref} className="after:absolute after:inset-0 after:content-['']">
              {project.title}
            </Link>
          ) : primaryHref ? (
            <a
              href={primaryHref}
              target="_blank"
              rel="noopener noreferrer"
              className="after:absolute after:inset-0 after:content-['']"
            >
              {project.title}
            </a>
          ) : (
            project.title
          )}
        </h3>

        <p className="mt-3 text-[clamp(0.88rem,1.6vw,1rem)] leading-relaxed text-ink/70">
          {project.tagline}
        </p>

        {/* Supplementary detail — always present on touch, revealed on hover/focus on desktop */}
        <div className="mt-5 space-y-3 lg:max-h-0 lg:overflow-hidden lg:opacity-0 lg:transition-all lg:duration-500 lg:group-hover:max-h-80 lg:group-hover:opacity-100 lg:group-focus-within:max-h-80 lg:group-focus-within:opacity-100">
          <div>
            <p className="font-mono text-[0.5rem] tracking-[0.2em] text-flare uppercase">Problem</p>
            <p className="mt-1 text-[0.85rem] leading-snug text-ink/70">{project.problem}</p>
          </div>
          <div>
            <p className="font-mono text-[0.5rem] tracking-[0.2em] text-flare uppercase">My contribution</p>
            <p className="mt-1 text-[0.85rem] leading-snug text-ink/70">{project.contribution}</p>
          </div>
        </div>

        {/* Tech labels */}
        <ul className="mt-5 flex flex-wrap gap-1.5">
          {project.technologies.map((tech) => (
            <li
              key={tech}
              className="border border-ink/25 px-2 py-1 font-mono text-[0.52rem] tracking-[0.12em] text-ink/65"
            >
              {tech}
            </li>
          ))}
        </ul>

        {/* Links — honest about what is and is not wired up */}
        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-ink/12 pt-5">
          {hasCaseStudy ? (
            <CardLink to={`/work/${project.slug}`} label="Case study" />
          ) : null}

          {hasDemo ? (
            <CardLink href={project.demoUrl} label="Live demo" />
          ) : (
            <DisabledChip label="Demo coming soon" />
          )}

          {hasRepo ? (
            <CardLink href={project.repoUrl} label="Source code" />
          ) : (
            <DisabledChip label="Repo coming soon" />
          )}

          <span
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink transition-transform duration-300 group-hover:rotate-45"
            aria-hidden="true"
          >
            <HandArrow towards="right" className="h-4 w-4" />
          </span>
        </div>
      </div>
    </article>
  );
}

function CardLink({ to, href, label }: { to?: string; href?: string; label: string }) {
  const cls =
    'relative z-10 inline-flex items-center gap-2 border-2 border-ink bg-ink px-3.5 py-2 font-mono text-[0.55rem] tracking-[0.16em] text-cream uppercase transition-colors duration-200 hover:bg-flare hover:text-ink';
  if (to) {
    return (
      <Link to={to} className={cls}>
        {label}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {label}
    </a>
  );
}

/** A visibly inert chip — never styled like something clickable. */
function DisabledChip({ label }: { label: string }) {
  return (
    <span
      className="inline-flex cursor-not-allowed items-center gap-2 border-2 border-dashed border-ink/25 px-3.5 py-2 font-mono text-[0.55rem] tracking-[0.16em] text-ink/35 uppercase"
      title="Not configured yet"
    >
      <span aria-hidden="true">○</span>
      {label}
    </span>
  );
}
