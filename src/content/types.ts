/**
 * Content types.
 *
 * Every piece of copy on the site is described by one of these shapes and
 * lives in `src/content/`. Editing your portfolio should never require
 * touching a component file.
 */

/**
 * A link that may not exist yet. Empty string or a string starting with
 * `TODO` means "not configured" — the UI renders an honest disabled state
 * instead of a button that goes nowhere.
 */
export type OptionalLink = string;

export interface SocialLink {
  id: string;
  label: string;
  /** Screen name or handle shown in the UI. */
  handle: string;
  url: OptionalLink;
  icon: 'github' | 'linkedin' | 'mail' | 'twitter' | 'dribbble' | 'globe';
}

export interface Profile {
  firstName: string;
  lastName: string;
  monogram: string;
  role: string;
  /** The hero tagline. Editable — not a permanent biography. */
  tagline: string;
  location: string;
  education: string;
  university: string;
  /** Headline for the About spread. */
  aboutHeadline: [string, string];
  /** Short paragraphs, revealed in readable groups. */
  aboutBody: string[];
  interests: string[];
  /** Shown as the small nav status pill. */
  availability: string;
  socials: SocialLink[];
  contactEmail: OptionalLink;
}

export interface ExperienceEntry {
  /** Two-digit chapter number as displayed. */
  index: string;
  role: string;
  /** TODO(suyash): replace with the real organisation name. */
  company: string;
  startDate: string;
  endDate: string;
  /** City, or "Remote". */
  location: string;
  focus: string;
  description: string;
  responsibilities: string[];
  technologies: string[];
  /** Only list things you can actually evidence. */
  achievements: string[];
  /** Optional logo path under /public. Empty = the SP fallback mark. */
  logo?: OptionalLink;
  /** Accent used for this chapter's number and progress line. */
  accent: 'volt' | 'ember' | 'flare' | 'cobalt' | 'grape';
}

export interface SkillGroup {
  id: string;
  title: string;
  /** Short caption shown when the group is opened. */
  caption: string;
  accent: 'volt' | 'ember' | 'flare' | 'cobalt' | 'grape';
  skills: Skill[];
}

export interface Skill {
  name: string;
  /** One-line note shown on hover / focus / tap. */
  note?: string;
  /**
   * Self-assessed breadth, deliberately coarse. Deliberately NOT a
   * percentage — an invented number is a claim you have to defend.
   */
  level: 'learning' | 'working' | 'confident';
  /** Ids of skills in the same group that light up alongside this one. */
  related?: string[];
}

export interface ProjectCaseStudy {
  summary: string;
  problem: string[];
  solution: string[];
  role: string[];
  architecture: string[];
  process: { title: string; body: string }[];
  challenges: string[];
  /** Only include verified, measurable outcomes. */
  results: string[];
  lessons: string[];
}

export interface Project {
  slug: string;
  /** Oversized number in the gallery. */
  number: string;
  title: string;
  tagline: string;
  problem: string;
  contribution: string;
  technologies: string[];
  category: string;
  /** Visual identity for this card. */
  accent: 'volt' | 'ember' | 'flare' | 'cobalt' | 'grape' | 'ink';
  /** Layout slot in the asymmetric gallery. */
  size: 'feature' | 'wide' | 'tall' | 'standard';
  /** Cover artwork under /public. Empty = generated SVG placeholder. */
  cover?: OptionalLink;
  demoUrl: OptionalLink;
  repoUrl: OptionalLink;
  status: 'shipped' | 'in-progress' | 'concept';
  caseStudy?: ProjectCaseStudy;
}

export interface Achievement {
  id: string;
  title: string;
  kind: 'certification' | 'event' | 'leadership' | 'award' | 'milestone';
  /** Empty until verified — the card then renders as a placeholder. */
  organisation: string;
  date: string;
  detail: string;
  verified: boolean;
}
