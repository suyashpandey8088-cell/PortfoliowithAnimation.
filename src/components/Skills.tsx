import { useMemo, useState } from 'react';
import { skillGroups } from '@/content/skills';
import { accentText, accentBg, accentHex, type Accent } from '@/lib/accents';
import { useMediaQuery } from '@/lib/useMediaQuery';
import { MaskedText, FadeUp, StaggerGroup } from './Reveal';
import { CrossMark, Starburst } from './graphics/Primitives';
import type { Skill } from '@/content/types';

/**
 * SKILLS — A CONSTELLATION, NOT A CARD GRID
 * ─────────────────────────────────────────────────────────────────────────
 * Every skill is a labelled node. Nodes in the same category sit on a shared
 * orbit; lines connect skills that genuinely relate, so hovering one node
 * lights up its neighbours and the relationships become legible.
 *
 * Positions are deterministic (orbit maths, not random), so the layout is
 * identical on every load and never overlaps.
 *
 * Interaction: hover on desktop, tap on touch, and full keyboard support —
 * every node is a real <button> with a visible focus ring.
 *
 * Below the `md` breakpoint a dense constellation is unusable, so the same
 * data renders as grouped sticker lists. Nothing is hidden behind hover.
 */

/** Drawing space: 100 × 75 units inside a 4:3 container. */
const VIEW_W = 100;
const VIEW_H = 75;
const CLUSTER_COLS = 3;
const CLUSTER_ROWS = 2;
const ORBIT_R = 12.5;

interface Node {
  groupIndex: number;
  skill: Skill;
  /** Unique key — skill names repeat across groups (e.g. Python). */
  id: string;
  x: number;
  y: number;
  accent: Accent;
}

function buildNodes(): Node[] {
  const nodes: Node[] = [];
  skillGroups.forEach((group, groupIndex) => {
    const col = groupIndex % CLUSTER_COLS;
    const row = Math.floor(groupIndex / CLUSTER_COLS);
    const cx = ((col + 0.5) / CLUSTER_COLS) * VIEW_W;
    const cy = ((row + 0.5) / CLUSTER_ROWS) * VIEW_H;

    group.skills.forEach((skill, i) => {
      const angle = (i / group.skills.length) * Math.PI * 2 - Math.PI / 2;
      nodes.push({
        groupIndex,
        skill,
        id: `${group.id}::${skill.name}`,
        x: cx + Math.cos(angle) * ORBIT_R,
        y: cy + Math.sin(angle) * ORBIT_R,
        accent: group.accent,
      });
    });
  });
  return nodes;
}

const LEVEL_LABEL: Record<Skill['level'], string> = {
  learning: 'Learning',
  working: 'Working knowledge',
  confident: 'Confident',
};

export default function Skills() {
  const nodes = useMemo(buildNodes, []);
  const [activeId, setActiveId] = useState<string | null>(null);
  const isConstellation = useMediaQuery('(min-width: 768px)');

  const activeNode = nodes.find((n) => n.id === activeId) ?? null;

  /** Names related to the active node, resolved to node ids in-group. */
  const relatedIds = useMemo(() => {
    if (!activeNode) return new Set<string>();
    const names = new Set(activeNode.skill.related ?? []);
    return new Set(
      nodes.filter((n) => n.groupIndex === activeNode.groupIndex && names.has(n.skill.name)).map((n) => n.id),
    );
  }, [activeNode, nodes]);

  const dim = (id: string) =>
    activeId !== null && id !== activeId && !relatedIds.has(id);

  /* Relationship lines: every related pair inside a group. */
  const edges = useMemo(() => {
    const result: { from: Node; to: Node; key: string }[] = [];
    skillGroups.forEach((_unused, groupIndex) => {
      const groupNodes = nodes.filter((n) => n.groupIndex === groupIndex);
      groupNodes.forEach((node) => {
        (node.skill.related ?? []).forEach((relatedName) => {
          const target = groupNodes.find((n) => n.skill.name === relatedName);
          // Only emit each pair once, in name order.
          if (target && node.skill.name < relatedName) {
            result.push({ from: node, to: target, key: `${node.id}->${target.id}` });
          }
        });
      });
    });
    return result;
  }, [nodes]);

  const edgeActive = (from: string, to: string) =>
    activeId !== null && (from === activeId || to === activeId) && (relatedIds.has(from) || relatedIds.has(to) || from === activeId || to === activeId);

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="relative overflow-hidden bg-cream text-ink"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="halftone absolute inset-x-0 top-0 h-48 text-ink/[0.05]" />
        <Starburst
          rays={16}
          className="absolute -right-20 bottom-10 h-72 w-72 animate-spin-slow text-flare/[0.08]"
        />
        <div className="grain-layer absolute inset-0" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-4 py-24 sm:px-6 sm:py-32 lg:px-10">
        <FadeUp className="mb-10 flex items-center gap-3 font-mono text-[0.6rem] tracking-[0.3em] text-ink/55">
          <CrossMark className="h-3 w-3 text-grape" />
          <span>03 / SKILLS</span>
          <span className="h-px w-16 bg-ink/20" />
        </FadeUp>

        <MaskedText
          as="h2"
          id="skills-heading"
          lines={['TOOLS IN MY', <span key="2" className="text-flare">TOOLBOX.</span>]}
          className="font-display text-[clamp(2.2rem,7vw,6rem)] leading-[0.9] tracking-[-0.035em]"
        />

        <FadeUp delay={0.12} className="mt-6 max-w-2xl">
          <p className="text-[clamp(0.92rem,1.8vw,1.1rem)] leading-relaxed text-ink/70">
            Hover, focus or tap a node to see what it relates to. No percentages here — a
            number would be a claim. Levels are a plain three-step self-assessment.
          </p>
        </FadeUp>

        {/* Legend */}
        <StaggerGroup className="mt-10 flex flex-wrap gap-x-6 gap-y-3" stagger={0.05}>
          {skillGroups.map((group) => (
            <div key={group.id} className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${accentBg[group.accent]}`} aria-hidden="true" />
              <span className="font-mono text-[0.55rem] tracking-[0.16em] text-ink/60 uppercase">
                {group.title}
              </span>
            </div>
          ))}
        </StaggerGroup>

        {isConstellation ? (
          /* ── Constellation ─────────────────────────────────────────── */
          <div className="relative mt-12 aspect-[4/3] w-full">
            {/* Relationship lines */}
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              aria-hidden="true"
            >
              {edges.map((edge) => {
                const on = edgeActive(edge.from.id, edge.to.id);
                return (
                  <line
                    key={edge.key}
                    x1={edge.from.x}
                    y1={edge.from.y}
                    x2={edge.to.x}
                    y2={edge.to.y}
                    stroke={on ? accentHex[edge.from.accent] : '#151515'}
                    strokeOpacity={on ? 0.85 : dim(edge.from.id) && dim(edge.to.id) ? 0.06 : 0.16}
                    strokeWidth={on ? 0.35 : 0.2}
                    vectorEffect="non-scaling-stroke"
                    className="transition-all duration-300"
                  />
                );
              })}
            </svg>

            {/* Nodes */}
            {nodes.map((node) => {
              const isActive = node.id === activeId;
              const isRelated = relatedIds.has(node.id);
              const isDim = dim(node.id);
              return (
                <button
                  key={node.id}
                  type="button"
                  onMouseEnter={() => setActiveId(node.id)}
                  onMouseLeave={() => setActiveId((cur) => (cur === node.id ? null : cur))}
                  onFocus={() => setActiveId(node.id)}
                  onBlur={() => setActiveId((cur) => (cur === node.id ? null : cur))}
                  onClick={() => setActiveId((cur) => (cur === node.id ? null : node.id))}
                  aria-pressed={isActive}
                  className={`group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 transition-opacity duration-300 ${
                    isDim ? 'opacity-30' : 'opacity-100'
                  }`}
                  style={{ left: `${node.x}%`, top: `${(node.y / VIEW_H) * 100}%` }}
                >
                  <span
                    className={`block rounded-full border-2 border-ink transition-all duration-300 ${
                      isActive
                        ? `h-5 w-5 ${accentBg[node.accent]} scale-125`
                        : isRelated
                          ? `h-4 w-4 ${accentBg[node.accent]}`
                          : 'h-3 w-3 bg-cream'
                    }`}
                  />
                  <span
                    className={`whitespace-nowrap font-mono tracking-[0.08em] transition-all duration-200 ${
                      isActive
                        ? 'text-[0.72rem] font-bold text-ink'
                        : isRelated
                          ? `text-[0.62rem] font-bold ${accentText[node.accent]}`
                          : 'text-[0.6rem] text-ink/70 group-hover:text-ink'
                    }`}
                  >
                    {node.skill.name}
                  </span>
                  {isActive ? (
                    <span
                      className={`pointer-events-none absolute top-full mt-1 w-max max-w-[15rem] border-2 border-ink bg-cream px-3 py-2 text-left shadow-block`}
                    >
                      <span className="block font-mono text-[0.5rem] tracking-[0.18em] uppercase text-flare">
                        {LEVEL_LABEL[node.skill.level]}
                      </span>
                      {node.skill.note ? (
                        <span className="mt-1 block text-[0.72rem] leading-snug text-ink/80">
                          {node.skill.note}
                        </span>
                      ) : null}
                    </span>
                  ) : null}
                </button>
              );
            })}

            {/* Live region for the selected skill */}
            <p className="sr-only" aria-live="polite">
              {activeNode
                ? `${activeNode.skill.name} — ${LEVEL_LABEL[activeNode.skill.level]}. ${
                    activeNode.skill.note ?? ''
                  }`
                : ''}
            </p>
          </div>
        ) : (
          /* ── Small screens: grouped sticker lists ──────────────────── */
          <div className="mt-12 space-y-10">
            {skillGroups.map((group) => (
              <div key={group.id}>
                <h3 className="flex items-center gap-2 font-display text-[clamp(1.1rem,5vw,1.6rem)]">
                  <span className={`h-3 w-3 rounded-full ${accentBg[group.accent]}`} aria-hidden="true" />
                  {group.title}
                </h3>
                <p className="mt-1.5 font-mono text-[0.55rem] tracking-[0.14em] text-ink/45">
                  {group.caption.toUpperCase()}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <li key={`${group.id}-${skill.name}`}>
                      <details className="group border-2 border-ink bg-cream">
                        <summary className="cursor-pointer list-none px-3 py-2 font-mono text-[0.62rem] tracking-[0.1em] transition-colors group-open:bg-ink group-open:text-cream">
                          {skill.name}
                          <span className="ml-2 text-flare">{skill.level === 'confident' ? '●●●' : skill.level === 'working' ? '●●○' : '●○○'}</span>
                        </summary>
                        <div className="border-t-2 border-ink px-3 py-2">
                          <p className="font-mono text-[0.5rem] tracking-[0.16em] uppercase text-flare">
                            {LEVEL_LABEL[skill.level]}
                          </p>
                          {skill.note ? (
                            <p className="mt-1 text-[0.78rem] leading-snug text-ink/75">{skill.note}</p>
                          ) : null}
                        </div>
                      </details>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        <FadeUp className="mt-14 border-t border-ink/12 pt-6">
          <p className="font-mono text-[0.55rem] leading-relaxed tracking-[0.14em] text-ember">
            ⚠ STARTER SET — PRUNE ANYTHING YOU COULD NOT DEFEND IN AN INTERVIEW. EDIT{' '}
            <code className="text-ink/70">src/content/skills.ts</code>
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
