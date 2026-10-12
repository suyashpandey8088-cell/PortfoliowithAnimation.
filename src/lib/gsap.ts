import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { completeTask } from './readiness';

let registered = false;

/**
 * Registers GSAP plugins exactly once.
 *
 * Components import this instead of calling `gsap.registerPlugin` themselves,
 * which prevents duplicate ScrollTrigger instances when a component
 * re-mounts.
 */
export function initGsap(): typeof gsap {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
    // Report to the preloader that the motion engine is live.
    completeTask('motion');
  }
  return gsap;
}

/** Shared motion constants — one timing language across the whole site. */
export const motion = {
  /** Small UI feedback. */
  micro: 0.16,
  /** Buttons, hovers, nav. */
  hover: 0.24,
  /** Section entry reveals. */
  enter: 0.7,
  /** Larger choreographed transitions. */
  grand: 1.1,
  /** Default scrub smoothing for scroll-linked timelines. */
  scrub: 1,
} as const;

export const ease = {
  snap: 'power4.out',
  expo: 'expo.out',
  inOut: 'power2.inOut',
  soft: 'power1.out',
} as const;

/**
 * Kills every ScrollTrigger created inside `scope` and reverts inline styles.
 * Call from a cleanup function so route changes and HMR never leak triggers.
 */
export function killContext(ctx: gsap.Context | null | undefined): void {
  ctx?.revert();
}
