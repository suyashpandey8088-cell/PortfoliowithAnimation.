import type { Achievement } from './types';

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  ACHIEVEMENTS — EMPTY ON PURPOSE.
 *
 *  Nothing is fabricated here. The section renders an honest, designed
 *  "fill me in" state until you add real entries.
 *
 *  To add one, append an object with `verified: true`. Cards with
 *  `verified: false` render as visibly unfinished placeholders so you can
 *  never accidentally ship a claim you haven't confirmed.
 *
 *  Good candidates: hackathons you attended, certifications you completed,
 *  societies you led, courses you finished, talks you gave.
 * ─────────────────────────────────────────────────────────────────────────
 */
export const achievements: Achievement[] = [
  {
    id: 'placeholder-1',
    title: 'Add your first achievement',
    kind: 'certification',
    organisation: '',
    date: '',
    detail:
      'Certifications, hackathons, leadership roles and milestones all live here. Nothing is invented — this card stays a placeholder until you fill it in.',
    verified: false,
  },
  {
    id: 'placeholder-2',
    title: 'Add your second achievement',
    kind: 'event',
    organisation: '',
    date: '',
    detail:
      'Delete this entry once you have something real, or set verified to true and complete the fields.',
    verified: false,
  },
];
