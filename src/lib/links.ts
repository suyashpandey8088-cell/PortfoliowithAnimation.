import type { OptionalLink } from '@/content/types';

/**
 * A link counts as "configured" only when it is a real, non-placeholder URL.
 *
 * Anything else renders as a visibly disabled chip in the UI, so the site
 * never presents a button that looks functional and does nothing.
 */
export function isConfigured(url: OptionalLink | undefined): url is string {
  if (!url) return false;
  const trimmed = url.trim();
  if (trimmed.length === 0) return false;
  if (/^todo/i.test(trimmed)) return false;
  if (trimmed.includes('example.com')) return false;
  if (trimmed.includes('your-')) return false;
  return /^(https?:\/\/|mailto:)/i.test(trimmed);
}

/** Smooth-scroll to a section id, honouring reduced motion. */
export function scrollToSection(id: string, reducedMotion = false): void {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({
    behavior: reducedMotion ? 'auto' : 'smooth',
    block: 'start',
  });
}
