/**
 * ACCENT LOOKUPS
 *
 * Tailwind scans source for complete class strings, so accent variants must
 * be written out in full rather than composed at runtime. These maps are the
 * single place that does that.
 */

export type Accent = 'volt' | 'ember' | 'flare' | 'cobalt' | 'grape' | 'ink';

export const accentText: Record<Accent, string> = {
  volt: 'text-volt',
  ember: 'text-ember',
  flare: 'text-flare',
  cobalt: 'text-cobalt',
  grape: 'text-grape',
  ink: 'text-ink',
};

export const accentBg: Record<Accent, string> = {
  volt: 'bg-volt',
  ember: 'bg-ember',
  flare: 'bg-flare',
  cobalt: 'bg-cobalt',
  grape: 'bg-grape',
  ink: 'bg-ink',
};

export const accentBorder: Record<Accent, string> = {
  volt: 'border-volt',
  ember: 'border-ember',
  flare: 'border-flare',
  cobalt: 'border-cobalt',
  grape: 'border-grape',
  ink: 'border-ink',
};

export const accentHex: Record<Accent, string> = {
  volt: '#C6FF00',
  ember: '#FF6B00',
  flare: '#FF3CAC',
  cobalt: '#2457FF',
  grape: '#7028E4',
  ink: '#151515',
};
