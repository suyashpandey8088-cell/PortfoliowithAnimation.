import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initGsap, motion } from '@/lib/gsap';

/**
 * HERO FLY-THROUGH — the scroll timeline
 * ─────────────────────────────────────────────────────────────────────────
 * One pinned composition, six phases, all driven by real scroll progress.
 *
 *   0.00 – 0.10   Composed headline. Indicator retires on first scroll.
 *   0.10 – 0.32   Depth separation — letters spread across Z, camera pushes in.
 *   0.32 – 0.58   Main fly-through — type rushes toward and past the viewer.
 *   0.58 – 0.72   Scatter — every letter except S and P leaves the frame.
 *   0.72 – 0.90   Convergence — S and P swing to centre and lock as "SP".
 *   0.90 – 1.00   Exit — a cobalt disc expands from the monogram, handing the
 *                 viewport straight into the About section.
 *
 * Geometry note: convergence targets are computed from `offsetLeft` /
 * `offsetWidth` / `offsetTop`, which are *layout* values and therefore
 * unaffected by any transform currently applied. Combined with
 * `invalidateOnRefresh`, the targets stay correct across resizes without a
 * second measurement pass.
 */

interface HeroFlythroughOptions {
  /** The tall runway element that provides the scroll distance. */
  track: React.RefObject<HTMLElement | null>;
  /** The sticky, viewport-height pinned stage. */
  stage: React.RefObject<HTMLElement | null>;
  enabled: boolean;
  /** 0..1 — lowered on small screens so the motion stays readable. */
  intensity: number;
}

/** Horizontal offset of an element's centre from its line's centre. */
function offsetFromLineCentre(el: HTMLElement): number {
  const line = el.parentElement;
  if (!line) return 0;
  return el.offsetLeft + el.offsetWidth / 2 - line.clientWidth / 2;
}

/** Vertical offset of an element's line centre from the type block's centre. */
function offsetFromBlockCentre(el: HTMLElement): number {
  const line = el.parentElement as HTMLElement | null;
  const block = line?.parentElement as HTMLElement | null;
  if (!line || !block) return 0;
  return line.offsetTop + line.clientHeight / 2 - block.clientHeight / 2;
}

export function useHeroFlythrough({
  track,
  stage,
  enabled,
  intensity,
}: HeroFlythroughOptions): void {
  useEffect(() => {
    if (!enabled) return;
    const trackEl = track.current;
    const stageEl = stage.current;
    if (!trackEl || !stageEl) return;

    const g = initGsap();

    const ctx = g.context(() => {
      const letters = g.utils.toArray<HTMLElement>('[data-hl]', stageEl);
      const keepers = g.utils.toArray<HTMLElement>('[data-hl-keep]', stageEl);
      const droppers = g.utils.toArray<HTMLElement>('[data-hl-drop]', stageEl);
      const deco = g.utils.toArray<HTMLElement>('[data-deco]', stageEl);
      const typeBlock = stageEl.querySelector<HTMLElement>('[data-type-block]');
      const monogram = stageEl.querySelector<HTMLElement>('[data-monogram]');
      const wipe = stageEl.querySelector<HTMLElement>('[data-wipe]');
      const indicator = stageEl.querySelector<HTMLElement>('[data-indicator]');
      const chrome = stageEl.querySelector<HTMLElement>('[data-monogram-chrome]');

      if (!typeBlock || letters.length === 0) return;

      // ── Static end states ──────────────────────────────────────────
      g.set(monogram, { autoAlpha: 0, scale: 2.4 });
      g.set(chrome, { autoAlpha: 0, scale: 0.7, rotate: -18 });
      g.set(wipe, { scale: 0 });

      const tl = g.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: trackEl,
          start: 'top top',
          end: 'bottom bottom',
          scrub: motion.scrub,
          // Re-evaluates the function-based convergence targets on resize.
          invalidateOnRefresh: true,
        },
      });

      /* ── PHASE 0 — indicator retires on first meaningful scroll ──── */
      if (indicator) {
        tl.to(indicator, { autoAlpha: 0, y: 24, duration: 6 }, 0);
      }

      /* ── PHASE 1 — depth separation ──────────────────────────────── */
      tl.to(
        typeBlock,
        { z: 260 * intensity, rotateY: -7 * intensity, duration: 22 },
        4,
      );
      tl.to(
        letters,
        {
          // Alternate letters push toward and away from the camera, which
          // is what sells the sense of physical depth.
          z: (i) => (i % 2 === 0 ? 1 : -1) * (90 + i * 14) * intensity,
          rotateY: (i) => (i % 2 === 0 ? 1 : -1) * 6 * intensity,
          duration: 22,
          ease: 'power1.inOut',
        },
        4,
      );
      tl.to(deco, { z: (i) => 220 + i * 60, duration: 22, ease: 'power1.inOut' }, 4);

      /* ── PHASE 2 — main fly-through ──────────────────────────────── */
      tl.to(typeBlock, { z: 1150 * intensity, rotateY: 12 * intensity, duration: 34 }, 26);
      tl.to(
        letters,
        {
          z: (i) => 480 + i * 130 * intensity,
          rotateX: (i) => (i % 3 === 0 ? -22 : 18) * intensity,
          rotateZ: (i) => ((i % 2 === 0 ? 1 : -1) * (4 + i)) * intensity,
          duration: 34,
          ease: 'power2.in',
        },
        26,
      );
      tl.to(deco, { z: 900, rotate: 90, autoAlpha: 0.25, duration: 34 }, 26);

      /* ── PHASE 3 — scatter everything except S and P ─────────────── */
      tl.to(
        droppers,
        {
          x: (i) => (i % 2 === 0 ? -1 : 1) * (700 + i * 90),
          y: (i) => (i % 3 === 0 ? -420 : 420) + i * 20,
          rotateZ: (i) => (i % 2 === 0 ? -70 : 70) + i * 6,
          autoAlpha: 0,
          duration: 16,
          ease: 'power2.in',
        },
        56,
      );

      /* ── PHASE 4 — S and P converge and lock ─────────────────────── */
      tl.to(
        keepers,
        {
          // Side-by-side targets: S left of centre, P right of centre.
          x: (i, el) => {
            const node = el as HTMLElement;
            const gap = node.offsetWidth * 0.58;
            const target = i === 0 ? -gap : gap;
            return target - offsetFromLineCentre(node);
          },
          y: (_index, el) => -offsetFromBlockCentre(el as HTMLElement),
          z: 1250 * intensity,
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0,
          scale: 0.34,
          duration: 22,
          ease: 'power3.inOut',
        },
        68,
      );

      // Cross-fade to a crisp monogram lockup so the final frame is sharp.
      tl.to(keepers, { autoAlpha: 0, duration: 6 }, 84);
      tl.to(monogram, { autoAlpha: 1, scale: 1, duration: 10, ease: 'power2.out' }, 82);
      tl.to(chrome, { autoAlpha: 1, scale: 1, rotate: 0, duration: 12, ease: 'power2.out' }, 84);

      /* ── PHASE 5 — exit: cobalt disc expands into About ──────────── */
      tl.to(wipe, { scale: 1, duration: 14, ease: 'power2.inOut' }, 88);
      tl.to(monogram, { scale: 0.82, duration: 12 }, 88);
      tl.to(chrome, { autoAlpha: 0, duration: 8 }, 92);

      // A webfont swap changes glyph metrics, which would shift the
      // convergence targets. Re-measure once fonts settle.
      if (typeof document !== 'undefined' && 'fonts' in document) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
      }
    }, stage);

    return () => ctx.revert();
  }, [track, stage, enabled, intensity]);
}
