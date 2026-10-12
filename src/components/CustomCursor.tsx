import { useEffect, useRef, useState } from 'react';
import { useFinePointer } from '@/lib/useMediaQuery';
import { useReducedMotion } from '@/lib/useReducedMotion';

/**
 * CUSTOM CURSOR
 * ─────────────────────────────────────────────────────────────────────────
 * A dot that tracks precisely, plus a ring that lags behind it — the lag is
 * what makes it feel physical.
 *
 * Guardrails:
 *   • Mounted only on fine-pointer devices. Touch users keep native behaviour.
 *   • Skipped entirely under reduced motion.
 *   • Handed back to the OS while the visitor is selecting text.
 *   • Purely additive: if this component fails to mount, the native cursor is
 *     untouched and every focus ring still works.
 */
export default function CustomCursor() {
  const finePointer = useFinePointer();
  const reducedMotion = useReducedMotion();
  const enabled = finePointer && !reducedMotion;

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.body.dataset.cursorActive = 'true';

    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let ringX = pointerX;
    let ringY = pointerY;
    let frame = 0;
    let running = true;

    const render = () => {
      // Exponential smoothing on the ring only — the dot stays exact.
      ringX += (pointerX - ringX) * 0.16;
      ringY += (pointerY - ringY) * 0.16;
      dot.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      if (running) frame = requestAnimationFrame(render);
    };

    const onMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!visible) setVisible(true);

      // Expand and label over anything interactive or explicitly marked.
      const target = event.target as HTMLElement | null;
      const interactive = target?.closest<HTMLElement>(
        'a, button, input, textarea, select, summary, [data-cursor]',
      );
      const nextLabel = interactive?.dataset.cursorLabel ?? null;
      setLabel(nextLabel);
      setExpanded(Boolean(interactive));
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    // Never trap the visitor inside the custom cursor while selecting.
    const onSelectStart = () => {
      document.body.dataset.selecting = 'true';
    };
    const onSelectEnd = () => {
      delete document.body.dataset.selecting;
    };

    // Pause the loop when the tab is hidden — no background work.
    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(frame);
      } else if (!running) {
        running = true;
        frame = requestAnimationFrame(render);
      }
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('pointerenter', onEnter);
    document.addEventListener('selectstart', onSelectStart);
    document.addEventListener('mouseup', onSelectEnd);
    document.addEventListener('visibilitychange', onVisibility);

    frame = requestAnimationFrame(render);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('pointerenter', onEnter);
      document.removeEventListener('selectstart', onSelectStart);
      document.removeEventListener('mouseup', onSelectEnd);
      document.removeEventListener('visibilitychange', onVisibility);
      delete document.body.dataset.cursorActive;
      delete document.body.dataset.selecting;
    };
  }, [enabled, visible]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 z-[130] grid place-items-center rounded-full border-2 border-ink mix-blend-difference transition-[width,height,background-color] duration-200 ${
          expanded ? 'h-16 w-16 bg-ink/10' : 'h-9 w-9 bg-transparent'
        } ${visible ? 'opacity-100' : 'opacity-0'}`}
        style={{ borderColor: '#FFF4DF' }}
      >
        {label ? (
          <span className="font-mono text-[0.5rem] tracking-[0.16em] text-cream uppercase">
            {label}
          </span>
        ) : null}
      </div>
      <div
        ref={dotRef}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 z-[131] h-2 w-2 rounded-full bg-ink transition-opacity duration-150 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </>
  );
}
