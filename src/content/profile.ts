import type { Profile } from './types';

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  EDIT ME FIRST.
 *  This is your identity. Everything here is copy, not code.
 *  Fields marked TODO(suyash) are placeholders — they render as an honest
 *  "not configured" state in the UI rather than a dead link.
 * ─────────────────────────────────────────────────────────────────────────
 */

// Env-provided contact address, falling back to a clearly fake placeholder.
const envEmail = import.meta.env.VITE_CONTACT_EMAIL?.trim();
const hasRealEmail = Boolean(envEmail) && !envEmail!.includes('example.com');

export const profile: Profile = {
  firstName: 'Suyash',
  lastName: 'Pandey',
  monogram: 'SP',

  role: 'Developer · AI · Digital Experiences',

  // Hero tagline. Reword freely — this is a voice, not a contract.
  tagline:
    'Building things at the intersection of code, creativity, and intelligent systems.',

  location: 'Navi Mumbai, Maharashtra, India',
  education: 'B.Tech in Artificial Intelligence & Data Science Engineering',
  university: 'NIAT Pune', // TODO(suyash): confirm the official institution name

  aboutHeadline: ['NOT JUST CODE.', 'A LITTLE BIT OF CHAOS.'],

  aboutBody: [
    'I am Suyash Pandey — a developer and technology enthusiast working across artificial intelligence, data, web development and software solutions.',
    'My approach is deliberately cross-disciplinary. I like the moment where a messy, unstructured problem meets a system that can actually hold it: a model that learns, an interface that responds, a pipeline that keeps its promises.',
    'I treat experimentation as a working method rather than a phase. I prototype quickly, break things on purpose, and keep what survives. Curiosity first, but always with an eye on whether the result is useful to somebody.',
    'This site is a small demonstration of that: a portfolio that behaves like an interactive object rather than a document.',
  ],

  interests: [
    'Artificial Intelligence',
    'Machine Learning',
    'Web Development',
    'Software Solutions',
    'Data Engineering',
    'Creative Digital Experiences',
  ],

  availability: 'OPEN TO OPPORTUNITIES',

  socials: [
    {
      id: 'github',
      label: 'GitHub',
      handle: '@suyashpandey8088-cell',
      url: 'https://github.com/suyashpandey8088-cell',
      icon: 'github',
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      handle: 'TODO — add profile URL',
      // TODO(suyash): replace with your real LinkedIn URL, then set the
      // handle above to your vanity name (e.g. "in/suyash-pandey").
      url: '',
      icon: 'linkedin',
    },
    {
      id: 'email',
      label: 'Email',
      handle: hasRealEmail ? envEmail! : 'TODO — add email address',
      url: hasRealEmail ? `mailto:${envEmail}` : '',
      icon: 'mail',
    },
  ],

  contactEmail: hasRealEmail ? envEmail! : '',
};

/** Canonical URL for SEO tags. Empty in local development is fine. */
export const siteUrl = import.meta.env.VITE_SITE_URL?.trim() ?? '';

/** Formspree form id. Empty => the contact form uses a mailto: fallback. */
export const formspreeId = import.meta.env.VITE_FORMSPREE_ID?.trim() ?? '';
