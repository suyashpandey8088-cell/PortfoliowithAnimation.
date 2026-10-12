import type { SkillGroup } from './types';

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  SKILL UNIVERSE — REVIEW AND PRUNE ME.
 *
 *  This is a *starter* set drawn only from the areas your internships
 *  describe. Deliberately conservative:
 *
 *    • No percentages. `level` is a coarse three-step self-assessment
 *      (learning / working / confident) — an invented number is a claim
 *      you would have to defend in an interview.
 *    • Nothing is marked `confident` unless it is a core daily tool.
 *
 *  Delete anything you could not discuss for five minutes, and add what is
 *  missing. The constellation in <Skills /> re-lays itself out automatically
 *  from whatever is left, so pruning is safe.
 * ─────────────────────────────────────────────────────────────────────────
 */
export const skillGroups: SkillGroup[] = [
  {
    id: 'ai',
    title: 'Artificial Intelligence & Machine Learning',
    caption: 'Models, data prep, and the plumbing between them.',
    accent: 'flare',
    skills: [
      {
        name: 'Python',
        note: 'Primary language for AI and scripting work.',
        level: 'confident',
        related: ['NumPy', 'Pandas', 'Scikit-learn'],
      },
      {
        name: 'NumPy',
        note: 'Numerical arrays and vectorised operations.',
        level: 'working',
        related: ['Python', 'Pandas'],
      },
      {
        name: 'Pandas',
        note: 'Tabular data wrangling and cleaning.',
        level: 'working',
        related: ['NumPy', 'Data Cleaning'],
      },
      {
        name: 'Scikit-learn',
        note: 'Classical ML pipelines and evaluation.',
        level: 'working',
        related: ['Python', 'Data Cleaning'],
      },
      {
        name: 'Data Cleaning',
        note: 'Getting messy real-world data into shape.',
        level: 'working',
        related: ['Pandas', 'Data Validation'],
      },
      {
        name: 'Prompt Engineering',
        note: 'Shaping model inputs for reliable output.',
        level: 'learning',
        related: ['Python'],
      },
    ],
  },
  {
    id: 'languages',
    title: 'Programming Languages',
    caption: 'The core set I reach for first.',
    accent: 'volt',
    skills: [
      {
        name: 'Python',
        note: 'Daily driver across AI and backend work.',
        level: 'confident',
        related: ['Java', 'C++'],
      },
      {
        name: 'JavaScript',
        note: 'Browser-side logic and interactivity.',
        level: 'working',
        related: ['TypeScript', 'HTML', 'CSS'],
      },
      {
        name: 'TypeScript',
        note: 'Typed JavaScript for anything that grows.',
        level: 'working',
        related: ['JavaScript'],
      },
      {
        name: 'Java',
        note: 'Object-oriented fundamentals and coursework.',
        level: 'working',
        related: ['Python', 'C++'],
      },
      {
        name: 'C++',
        note: 'Used for problem solving and DSA practice.',
        level: 'learning',
        related: ['Java'],
      },
    ],
  },
  {
    id: 'web',
    title: 'Web Development',
    caption: 'Interfaces, responsiveness, and feel.',
    accent: 'cobalt',
    skills: [
      {
        name: 'HTML',
        note: 'Semantic structure and accessibility basics.',
        level: 'confident',
        related: ['CSS', 'Accessibility'],
      },
      {
        name: 'CSS',
        note: 'Layout, motion and responsive composition.',
        level: 'confident',
        related: ['HTML', 'Tailwind CSS'],
      },
      {
        name: 'Tailwind CSS',
        note: 'Utility-first styling at speed.',
        level: 'working',
        related: ['CSS'],
      },
      {
        name: 'React',
        note: 'Component-driven interfaces.',
        level: 'working',
        related: ['TypeScript', 'Tailwind CSS'],
      },
      {
        name: 'Responsive Design',
        note: 'Mobile-first layouts that hold up everywhere.',
        level: 'working',
        related: ['CSS'],
      },
      {
        name: 'Accessibility',
        note: 'Keyboard, focus and screen-reader basics.',
        level: 'learning',
        related: ['HTML', 'Responsive Design'],
      },
    ],
  },
  {
    id: 'data',
    title: 'Data & Databases',
    caption: 'Storing it, querying it, trusting it.',
    accent: 'ember',
    skills: [
      {
        name: 'SQL',
        note: 'Querying and joining relational data.',
        level: 'working',
        related: ['MySQL', 'Data Validation'],
      },
      {
        name: 'MySQL',
        note: 'Relational schema design basics.',
        level: 'learning',
        related: ['SQL'],
      },
      {
        name: 'Excel',
        note: 'Analysis, pivot tables, large manual datasets.',
        level: 'working',
        related: ['Data Validation'],
      },
      {
        name: 'Google Sheets',
        note: 'Collaborative data handling.',
        level: 'working',
        related: ['Excel'],
      },
      {
        name: 'Data Validation',
        note: 'Accuracy checks and entry QA.',
        level: 'working',
        related: ['Excel', 'Data Cleaning'],
      },
    ],
  },
  {
    id: 'tools',
    title: 'Development Tools',
    caption: 'The workbench.',
    accent: 'grape',
    skills: [
      {
        name: 'Git',
        note: 'Version control and branching.',
        level: 'working',
        related: ['GitHub'],
      },
      {
        name: 'GitHub',
        note: 'Repositories, issues and collaboration.',
        level: 'working',
        related: ['Git'],
      },
      {
        name: 'VS Code',
        note: 'Primary editor.',
        level: 'confident',
        related: [],
      },
      {
        name: 'Figma',
        note: 'Reading and following design files.',
        level: 'learning',
        related: [],
      },
      {
        name: 'Vercel',
        note: 'Frontend deployment.',
        level: 'learning',
        related: ['GitHub'],
      },
    ],
  },
  {
    id: 'soft',
    title: 'Problem Solving & Collaboration',
    caption: 'The part that never shows up in a stack list.',
    accent: 'flare',
    skills: [
      {
        name: 'Data Structures & Algorithms',
        note: 'Ongoing DSA practice.',
        level: 'working',
        related: ['Python', 'C++'],
      },
      {
        name: 'Debugging',
        note: 'Reading errors before guessing at them.',
        level: 'working',
        related: [],
      },
      {
        name: 'Team Collaboration',
        note: 'Working inside an existing team process.',
        level: 'working',
        related: ['Communication'],
      },
      {
        name: 'Communication',
        note: 'Explaining technical work plainly.',
        level: 'working',
        related: ['Team Collaboration'],
      },
      {
        name: 'Rapid Prototyping',
        note: 'Building the rough version first, on purpose.',
        level: 'working',
        related: ['Debugging'],
      },
    ],
  },
];
