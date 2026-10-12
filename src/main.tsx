import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { bootstrapReadiness } from './lib/readiness';
import './index.css';

/**
 * ENTRY POINT
 *
 * `bootstrapReadiness` runs before React renders so the preloader's progress
 * is already tracking real work by the time it paints.
 *
 * NOTE ON StrictMode: React 19 intentionally double-invokes effects in
 * development. Every animation in this project is created inside a
 * `gsap.context()` and reverted in its cleanup, so the second pass produces
 * exactly one live instance — never duplicated ScrollTriggers.
 */
bootstrapReadiness();

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container #root was not found in index.html');
}

createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
