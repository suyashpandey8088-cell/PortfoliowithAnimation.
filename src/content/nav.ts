/**
 * NAVIGATION + SECTION THEMES
 *
 * `navTheme` is the single place that decides what the fixed navigation looks
 * like over each section. Deliberately an explicit per-section switch rather
 * than `mix-blend-mode`: blending is unreliable over animated backgrounds and
 * can drop the contrast ratio below readable. Explicit themes always hold.
 */

export interface NavItem {
  id: string;
  label: string;
  /** Two-digit index shown next to the label on desktop. */
  index: string;
}

export const navItems: NavItem[] = [
  { id: 'about', label: 'About', index: '01' },
  { id: 'experience', label: 'Experience', index: '02' },
  { id: 'projects', label: 'Projects', index: '03' },
  { id: 'contact', label: 'Contact', index: '04' },
];

export type NavTheme = 'dark' | 'light';

/** Every section id, in document order. */
export const sectionIds = [
  'hero',
  'about',
  'experience',
  'skills',
  'projects',
  'achievements',
  'contact',
] as const;

/**
 * Which navigation treatment sits over which section.
 *  dark  = ink text   (over cream / volt / ember)
 *  light = cream text (over ink / cobalt / grape)
 */
export const sectionThemes: Record<string, NavTheme> = {
  hero: 'dark',
  about: 'light',
  experience: 'light',
  skills: 'dark',
  projects: 'light',
  achievements: 'dark',
  contact: 'dark',
};

export function themeForSection(id: string): NavTheme {
  return sectionThemes[id] ?? 'dark';
}
