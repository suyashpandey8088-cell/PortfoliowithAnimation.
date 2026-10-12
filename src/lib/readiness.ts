/**
 * READINESS TRACKER
 * ─────────────────────────────────────────────────────────────────────────
 * The preloader percentage is *real*. It counts named initialisation tasks
 * that have actually completed, so the number can never sit stuck at 63%
 * for four seconds while nothing happens.
 *
 * Each task has its own timeout. A stalled third-party font or a slow image
 * marks itself done on the clock rather than holding the whole site hostage,
 * and `settle()` resolves the lot if anything goes wrong.
 *
 * The exit choreography has a deliberate minimum dwell (~700ms) so the
 * hand-off into the hero reads as intentional — that is animation time,
 * not fake loading, and it starts only once progress has genuinely hit 100.
 */

export type TaskName = 'dom' | 'fonts' | 'motion' | 'hero';

interface TaskState {
  done: boolean;
  timedOut: boolean;
}

const TASK_TIMEOUT_MS = 3500;

const tasks = new Map<TaskName, TaskState>();
const listeners = new Set<(progress: number, complete: boolean) => void>();

let settled = false;
let resolveReady: (() => void) | null = null;

export const readyPromise: Promise<void> = new Promise<void>((resolve) => {
  resolveReady = resolve;
});

function computeProgress(): number {
  if (tasks.size === 0) return 0;
  let done = 0;
  tasks.forEach((t) => {
    if (t.done || t.timedOut) done += 1;
  });
  return done / tasks.size;
}

function notify(): void {
  const progress = computeProgress();
  const complete = progress >= 1;
  listeners.forEach((fn) => fn(progress, complete));
  if (complete && !settled) {
    settled = true;
    resolveReady?.();
  }
}

/** Declare a task. Call once, at module level or on mount. */
export function trackTask(name: TaskName, timeoutMs = TASK_TIMEOUT_MS): void {
  if (tasks.has(name)) return;
  tasks.set(name, { done: false, timedOut: false });

  // Never let one stalled task block the site forever.
  window.setTimeout(() => {
    const task = tasks.get(name);
    if (task && !task.done) {
      task.timedOut = true;
      notify();
    }
  }, timeoutMs);

  notify();
}

/** Mark a task complete. Safe to call more than once. */
export function completeTask(name: TaskName): void {
  const task = tasks.get(name);
  if (!task || task.done) return;
  task.done = true;
  notify();
}

export function onProgress(fn: (progress: number, complete: boolean) => void): () => void {
  listeners.add(fn);
  // Fire immediately with the current state so late subscribers are correct.
  fn(computeProgress(), computeProgress() >= 1);
  return () => listeners.delete(fn);
}

/** Force-resolve. Used as a last-resort escape hatch. */
export function settle(): void {
  if (settled) return;
  settled = true;
  listeners.forEach((fn) => fn(1, true));
  resolveReady?.();
}

export function isSettled(): boolean {
  return settled;
}

/**
 * Bootstraps the two environment-level tasks. Called once from main.tsx.
 * The other tasks are declared by the modules that own them.
 */
export function bootstrapReadiness(): void {
  trackTask('dom');
  trackTask('fonts');

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    completeTask('dom');
  } else {
    window.addEventListener(
      'DOMContentLoaded',
      () => completeTask('dom'),
      { once: true },
    );
  }

  // `document.fonts.ready` resolves even if a font fails to download, which
  // is exactly the graceful behaviour we want. Capped by the task timeout.
  if (typeof document !== 'undefined' && 'fonts' in document) {
    document.fonts.ready
      .then(() => completeTask('fonts'))
      .catch(() => completeTask('fonts'));
  } else {
    completeTask('fonts');
  }

  // Absolute backstop: the site is usable no matter what.
  window.setTimeout(() => settle(), TASK_TIMEOUT_MS + 1500);
}
