import { useEffect, useRef, useState } from 'react';
import { onProgress } from './readiness';

interface ReadinessState {
  /** 0..1 — real completion of tracked initialisation tasks. */
  progress: number;
  complete: boolean;
}

/**
 * Subscribes a component to the readiness tracker.
 *
 * `minDurationMs` paces the *displayed* number so a fast machine does not
 * flash 0%→100% in a single frame. The underlying value stays honest; only
 * the counter's rate of travel is eased.
 */
export function useReadiness(minDurationMs = 700): ReadinessState {
  const [state, setState] = useState<ReadinessState>({ progress: 0, complete: false });
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const displayedRef = useRef(0);

  useEffect(() => {
    startRef.current = performance.now();

    const unsubscribe = onProgress((progress) => {
      const elapsed = performance.now() - startRef.current;
      // Minimum elapsed time before we allow the counter to reach 100%.
      const timeGate = Math.min(1, elapsed / minDurationMs);
      const target = progress * timeGate;

      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

      const step = () => {
        const delta = target - displayedRef.current;
        // Exponential approach — fast at first, eases into the final digits.
        displayedRef.current += delta * 0.18;
        if (Math.abs(delta) < 0.004) {
          displayedRef.current = target;
          setState({ progress: target, complete: progress >= 1 && timeGate >= 1 });
          rafRef.current = null;
          return;
        }
        setState({ progress: displayedRef.current, complete: false });
        rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    });

    return () => {
      unsubscribe();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [minDurationMs]);

  return state;
}
