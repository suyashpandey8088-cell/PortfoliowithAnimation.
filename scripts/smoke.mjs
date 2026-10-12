/**
 * RUNTIME SMOKE TEST
 * ─────────────────────────────────────────────────────────────────────────
 * Boots the *real* application bundle (through Vite's SSR transforms) inside a
 * jsdom window, then mounts React and lets every effect run — preloader,
 * nav, hero timeline construction, all sections. Any throw during import,
 * render or effect time is surfaced as a failure.
 *
 * This is not a visual test. It proves the code executes end to end without
 * crashing in a DOM that has no layout engine, which is where the highest-risk
 * code (GSAP + ScrollTrigger wiring, readiness tracker, router) lives.
 *
 *     node scripts/smoke.mjs
 */
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost:4173/',
  pretendToBeVisual: true,
});

const { window } = dom;

// Wire the jsdom window into Node globals *before* the app imports.
const define = (key, value) => {
  Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
};

define('window', window);
define('document', window.document);
define('HTMLElement', window.HTMLElement);
define('Element', window.Element);
define('Node', window.Node);
define('SVGElement', window.SVGElement);
define('getComputedStyle', window.getComputedStyle.bind(window));
define('requestAnimationFrame', window.requestAnimationFrame.bind(window));
define('cancelAnimationFrame', window.cancelAnimationFrame.bind(window));
define('localStorage', window.localStorage);
define('sessionStorage', window.sessionStorage);
define('location', window.location);
define('history', window.history);
define('CustomEvent', window.CustomEvent);
define('Event', window.Event);
define('devicePixelRatio', 1);

try {
  define('navigator', window.navigator);
} catch {
  /* Node may expose a read-only global navigator; the jsdom one is preferred
     but its absence is tolerable for the smoke run. */
}

// matchMedia polyfill — jsdom may not ship it.
const matchMedia = (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener() {},
  removeListener() {},
  addEventListener() {},
  removeEventListener() {},
  dispatchEvent() {
    return false;
  },
});
if (typeof window.matchMedia === 'function') {
  define('matchMedia', window.matchMedia.bind(window));
  window.matchMedia = window.matchMedia.bind(window);
} else {
  define('matchMedia', matchMedia);
  window.matchMedia = matchMedia;
}

// Layout-less stand-ins. ScrollTrigger degrades rather than crashes.
class RO {
  observe() {}
  unobserve() {}
  disconnect() {}
}
define('ResizeObserver', RO);
window.ResizeObserver = RO;

// Record fatal errors from any source.
const failures = [];
window.addEventListener('error', (event) => failures.push(`window.onerror: ${event.message}`));
process.on('uncaughtException', (err) => failures.push(`uncaught: ${err.message}`));
process.on('unhandledRejection', (err) => failures.push(`unhandledRejection: ${err && err.message}`));

const { createServer } = await import('vite');

const server = await createServer({
  logLevel: 'error',
  server: { middlewareMode: true, hmr: false },
  appType: 'custom',
});

try {
  // Import the real entry point — bootstrapReadiness() and createRoot().
  await server.ssrLoadModule('/src/main.tsx');

  // Give effects (preloader timeline, ScrollTrigger construction, rAF loops)
  // a beat to run and to throw, if they are going to.
  await new Promise((resolve) => setTimeout(resolve, 600));

  const rootHtml = window.document.getElementById('root')?.innerHTML ?? '';
  const hasNav = rootHtml.includes('data-nav-logo');
  const hasHero = rootHtml.includes('SUYASH') || rootHtml.includes('data-hl');
  const hasPreloader = rootHtml.includes('LOADING') || rootHtml.includes('pl-panel');

  console.log('--- SMOKE RESULTS ---');
  console.log('root rendered length   :', rootHtml.length);
  console.log('contains nav logo      :', hasNav);
  console.log('contains hero/preloader:', hasHero || hasPreloader);
  console.log('runtime failures       :', failures.length);

  if (failures.length > 0) {
    console.log('\nFailures:');
    for (const failure of failures) console.log('  •', failure);
    process.exitCode = 1;
  } else if (rootHtml.length === 0) {
    console.log('ERROR: React rendered nothing into #root.');
    process.exitCode = 1;
  } else {
    console.log('SMOKE OK — app booted, mounted, and ran effects without throwing.');
  }
} catch (error) {
  console.error('SMOKE FAILED during boot:');
  console.error(error);
  process.exitCode = 1;
} finally {
  await server.close();
}

process.exit(process.exitCode ?? 0);
