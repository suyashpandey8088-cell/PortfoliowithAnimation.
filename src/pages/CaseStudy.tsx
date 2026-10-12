import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProject, getRelatedProjects } from '@/content/projects';
import { accentText, accentBg } from '@/lib/accents';
import { isConfigured } from '@/lib/links';
import { MaskedText, FadeUp } from '@/components/Reveal';
import ProjectCover from '@/components/ProjectCover';
import NotFound from './NotFound';
import { HandArrow, Starburst, CrossMark } from '@/components/graphics/Primitives';

/**
 * CASE STUDY TEMPLATE
 * ─────────────────────────────────────────────────────────────────────────
 * One reusable editorial layout, re-skinned per project from its `accent`.
 * Any project with a `caseStudy` object in src/content/projects.ts gets a
 * page here automatically at /work/<slug>.
 *
 * Browser navigation works properly: the back control is a real link, and the
 * route pushes a history entry like any other page.
 */
export default function CaseStudy() {
  const { slug = '' } = useParams();
  const project = getProject(slug);

  useEffect(() => {
    if (!project) return;
    document.title = `${project.title} — Case Study · Suyash Pandey`;
  }, [project]);

  if (!project?.caseStudy) return <NotFound />;

  const study = project.caseStudy;
  const related = getRelatedProjects(project.slug);

  return (
    <main className="bg-ink text-cream">
      {/* Header */}
      <section className={`relative overflow-hidden ${accentBg[project.accent]} text-ink`}>
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <Starburst
            rays={18}
            className="absolute -top-24 -right-24 h-96 w-96 animate-spin-slow text-ink/[0.07]"
          />
          <div className="halftone absolute inset-x-0 bottom-0 h-40 text-ink/[0.06]" />
        </div>

        <div className="relative mx-auto max-w-[1200px] px-4 pt-28 pb-16 sm:px-6 lg:px-10 lg:pt-36">
          <Link
            to="/#projects"
            className="group inline-flex items-center gap-2 border-2 border-ink px-3.5 py-2 font-mono text-[0.55rem] tracking-[0.2em] uppercase transition-colors hover:bg-ink hover:text-cream"
          >
            <span
              className="inline-block transition-transform duration-300 group-hover:-translate-x-1"
              aria-hidden="true"
            >
              ←
            </span>
            All projects
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3 font-mono text-[0.55rem] tracking-[0.2em] uppercase">
            <span className="border-2 border-ink px-2.5 py-1">{project.category}</span>
            <span>PROJECT {project.number}</span>
            <span>·</span>
            <span>{project.status.replace('-', ' ')}</span>
          </div>

          <MaskedText
            as="h1"
            lines={[project.title]}
            className="mt-6 font-display text-[clamp(2.2rem,8vw,6rem)] leading-[0.9] tracking-[-0.04em]"
          />

          <FadeUp delay={0.1} className="mt-6 max-w-2xl">
            <p className="text-[clamp(1rem,2.2vw,1.35rem)] leading-relaxed font-medium text-ink/80">
              {study.summary}
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Hero visual */}
      <section className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-10">
        <ProjectCover project={project} className="aspect-[16/9] w-full border-2 border-cream/20" />
      </section>

      {/* Body */}
      <section className="mx-auto max-w-[1200px] px-4 pb-24 sm:px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.32fr_0.68fr]">
          <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
            <MetaBlock label="Role" items={study.role} />
            <MetaBlock label="Stack" items={project.technologies} />
            <div className="space-y-3">
              {isConfigured(project.demoUrl) ? (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 border-2 border-cream px-4 py-3 font-mono text-[0.58rem] tracking-[0.18em] uppercase transition-colors hover:bg-cream hover:text-ink"
                >
                  Live demo
                  <HandArrow towards="right" className="h-4 w-4" />
                </a>
              ) : null}
              {isConfigured(project.repoUrl) ? (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 border-2 border-cream/30 px-4 py-3 font-mono text-[0.58rem] tracking-[0.18em] uppercase transition-colors hover:border-cream"
                >
                  Source code
                  <HandArrow towards="right" className="h-4 w-4" />
                </a>
              ) : null}
            </div>
          </aside>

          <div className="space-y-16">
            <Prose label="The problem" items={study.problem} accent={project.accent} />
            <Prose label="The solution" items={study.solution} accent={project.accent} />
            <Prose label="Architecture" items={study.architecture} accent={project.accent} />

            <div>
              <SectionLabel accent={project.accent}>Implementation process</SectionLabel>
              <ol className="mt-6 space-y-6">
                {study.process.map((step, i) => (
                  <FadeUp as="li" key={i} delay={i * 0.05} className="border-l-2 border-cream/15 pl-6">
                    <h3 className="font-display text-[clamp(1.05rem,2.4vw,1.5rem)]">{step.title}</h3>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-cream/70">{step.body}</p>
                  </FadeUp>
                ))}
              </ol>
            </div>

            <Prose label="Key challenges" items={study.challenges} accent={project.accent} />
            <Prose label="Results" items={study.results} accent={project.accent} />
            <Prose label="Lessons learned" items={study.lessons} accent={project.accent} />

            <div className="border-2 border-dashed border-cream/25 p-5">
              <p className="font-mono text-[0.55rem] leading-relaxed tracking-[0.14em] text-volt/85">
                ⚠ THIS CASE STUDY IS A TEMPLATE FILLED WITH PLACEHOLDER COPY. REPLACE IT IN{' '}
                <code className="text-cream/70">src/content/projects.ts</code> UNDER{' '}
                <code className="text-cream/70">caseStudy</code>.
              </p>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 ? (
          <div className="mt-20 border-t border-cream/12 pt-10">
            <SectionLabel accent={project.accent}>Related work</SectionLabel>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  to={item.caseStudy ? `/work/${item.slug}` : '/#projects'}
                  className="group flex items-center gap-4 border-2 border-cream/20 p-4 transition-colors hover:border-cream"
                >
                  <span className={`font-display text-2xl ${accentText[item.accent]}`}>
                    {item.number}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-[1.05rem] leading-tight">
                      {item.title}
                    </span>
                    <span className="block truncate font-mono text-[0.55rem] tracking-[0.14em] text-cream/45">
                      {item.category}
                    </span>
                  </span>
                  <span
                    className="ml-auto h-5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  >
                    <HandArrow towards="right" className="h-5 w-5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}

function SectionLabel({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <h2 className="flex items-center gap-3 font-display text-[clamp(1.2rem,3vw,1.9rem)]">
      <CrossMark className={`h-4 w-4 ${accentText[accent as keyof typeof accentText]}`} />
      {children}
    </h2>
  );
}

function Prose({
  label,
  items,
  accent,
}: {
  label: string;
  items: string[];
  accent: string;
}) {
  return (
    <div>
      <SectionLabel accent={accent}>{label}</SectionLabel>
      <div className="mt-5 space-y-4">
        {items.map((item, i) => (
          <FadeUp key={i} delay={i * 0.05}>
            <p className="text-[clamp(0.95rem,1.8vw,1.08rem)] leading-relaxed text-cream/72">
              {item}
            </p>
          </FadeUp>
        ))}
      </div>
    </div>
  );
}

function MetaBlock({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="font-mono text-[0.52rem] tracking-[0.24em] text-cream/45 uppercase">
        {label} /
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((item, i) => (
          <li
            key={i}
            className="border border-cream/25 px-2.5 py-1.5 font-mono text-[0.55rem] tracking-[0.12em] text-cream/70"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
