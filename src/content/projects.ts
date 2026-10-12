import type { Project } from './types';

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  PROJECTS — EDIT ME.
 *
 *  These are clearly-labelled *placeholder* projects. Nothing here claims a
 *  finished product, a live URL, usage numbers or a business result.
 *
 *  How to publish a real one:
 *    1. Replace title / tagline / problem / contribution / technologies.
 *    2. Put a cover image in /public/projects/ and set `cover` to its path
 *       (e.g. '/projects/foo.webp'). Leave it empty to keep the generated
 *       SVG artwork.
 *    3. Add `demoUrl` / `repoUrl`. Until then the UI shows an honest
 *       "Link coming soon" chip instead of a dead button.
 *    4. Optional: add a `caseStudy` object to get a /work/<slug> page.
 *
 *  `size` controls the asymmetric gallery slot — mix them, don't uniformise.
 * ─────────────────────────────────────────────────────────────────────────
 */
export const projects: Project[] = [
  {
    slug: 'intelligent-systems',
    number: '01',
    title: 'Intelligent Systems, Explored',
    tagline: 'A working space for AI experiments and small model pipelines.',
    problem:
      'Learning AI in isolation makes it hard to see how the pieces connect — data prep, model choice, evaluation and serving each feel like separate subjects until you build something end to end.',
    contribution:
      'Placeholder entry. Describe what you built, the part you owned, and what you changed between the first and last attempt.',
    technologies: ['Python', 'Pandas', 'Scikit-learn'],
    category: 'Artificial Intelligence',
    accent: 'flare',
    size: 'feature',
    demoUrl: '',
    repoUrl: '',
    status: 'in-progress',
    caseStudy: {
      summary:
        'A reusable space for taking an AI idea from raw data to a working model, and for keeping the experiments honest.',
      problem: [
        'Most early AI work dies at the same place: a notebook that works once, on one dataset, and cannot be rerun or explained.',
        'Placeholder paragraph. Replace with the real problem — who had it, how often, and what it cost them.',
      ],
      solution: [
        'A repeatable pipeline rather than a one-off script: ingest, clean, transform, train, evaluate, compare.',
        'Placeholder paragraph. Describe the approach you actually took and why you rejected the obvious alternative.',
      ],
      role: [
        'Placeholder: state your role precisely — solo build, pair work, or a slice of a larger team effort.',
      ],
      architecture: [
        'Data layer — ingestion and validation.',
        'Feature layer — transformation and cleaning.',
        'Model layer — training and evaluation.',
        'Placeholder: replace with your real architecture.',
      ],
      process: [
        {
          title: '01 — Framing',
          body: 'Placeholder. What question were you actually answering, and how did you decide the first version was worth building?',
        },
        {
          title: '02 — Data reality check',
          body: 'Placeholder. What the data looked like when you opened it, versus what you hoped it would look like.',
        },
        {
          title: '03 — First working version',
          body: 'Placeholder. The simplest thing that ran end to end, and what it told you.',
        },
        {
          title: '04 — Iteration',
          body: 'Placeholder. What you changed, what got worse first, and how you knew when to stop.',
        },
      ],
      challenges: [
        'Placeholder. Name the hardest technical problem and how you worked around it.',
        'Placeholder. Name a non-technical problem — scope, ambiguity, time.',
      ],
      results: [
        'No results published yet. Add verified, measurable outcomes only once they exist.',
      ],
      lessons: [
        'Placeholder. The thing you would tell yourself at the start of the next one.',
      ],
    },
  },
  {
    slug: 'data-accuracy-toolkit',
    number: '02',
    title: 'Data Accuracy Toolkit',
    tagline: 'Utilities for validating large manual datasets without losing your mind.',
    problem:
      'Manual data entry scales badly: errors compound, and by the time somebody notices, tracing them back through thousands of rows is nearly impossible.',
    contribution:
      'Placeholder entry. Describe the validation rules you built or the workflow you improved.',
    technologies: ['Python', 'Pandas', 'Excel'],
    category: 'Data',
    accent: 'ember',
    size: 'wide',
    demoUrl: '',
    repoUrl: '',
    status: 'concept',
  },
  {
    slug: 'interface-experiments',
    number: '03',
    title: 'Interface Experiments',
    tagline: 'Small, self-contained web pieces built to learn one interaction each.',
    problem:
      'Interaction design is hard to learn from reading. Each of these is a single idea pushed far enough to understand it properly.',
    contribution:
      'Placeholder entry. This portfolio is one of them — describe the others.',
    technologies: ['TypeScript', 'React', 'CSS'],
    category: 'Web Development',
    accent: 'cobalt',
    size: 'tall',
    demoUrl: '',
    repoUrl: '',
    status: 'in-progress',
  },
  {
    slug: 'solution-scaffolds',
    number: '04',
    title: 'Solution Scaffolds',
    tagline: 'Starter structures for turning an ambiguous brief into a working build.',
    problem:
      'Every new brief starts in the same fog. A reusable scaffold cuts the time between "what is this?" and "here is something running".',
    contribution:
      'Placeholder entry. Describe the scaffolds you built and who they were for.',
    technologies: ['Add your stack'],
    category: 'Solutions',
    accent: 'grape',
    size: 'standard',
    demoUrl: '',
    repoUrl: '',
    status: 'concept',
  },
  {
    slug: 'this-website',
    number: '05',
    title: 'This Website',
    tagline: 'The thing you are scrolling through right now.',
    problem:
      'Most developer portfolios look the same — a hero, then three identical cards. That tells a recruiter nothing about how the person actually thinks.',
    contribution:
      'Designed and built end to end: art direction, a scroll-driven animation system, custom loading identity, accessibility and deployment.',
    technologies: ['TypeScript', 'React', 'GSAP', 'Tailwind CSS', 'Vite'],
    category: 'Web Development',
    accent: 'volt',
    size: 'standard',
    // Self-referential and real — the only project with a live link at launch.
    demoUrl: '',
    repoUrl: 'https://github.com/suyashpandey8088-cell/PortfoliowithAnimation.',
    status: 'shipped',
  },
];

export const featuredProjectSlug = 'intelligent-systems';

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getRelatedProjects(slug: string, count = 2): Project[] {
  return projects.filter((p) => p.slug !== slug).slice(0, count);
}
