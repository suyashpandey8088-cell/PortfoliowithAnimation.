import { useEffect, useRef } from 'react';

/**
 * POINTER TILT
 * ─────────────────────────────────────────────────────────────────────────
 * A restrained 3D tilt driven by pointer position. Desktop only — it is
 * skipped entirely on touch devices and under reduced motion, and it degrades
 * to nothing at all if pointer events are unavailable.
 *
 * Uses `transform` only, and the rAF write is debounced to one per frame.
 */
export function useTilt(maxDegrees = 7) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia('(pointer: fine) and (hover: hover)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    let targetX = 0;
    let targetY = 0;

    const apply = () => {
      frame = 0;
      el.style.transform = `perspective(900px) rotateX(${targetY}deg) rotateY(${targetX}deg) scale(1.01)`;
    };

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      targetX = px * maxDegrees * 2;
      targetY = -py * maxDegrees * 2;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [maxDegrees]);

  return ref;
}
