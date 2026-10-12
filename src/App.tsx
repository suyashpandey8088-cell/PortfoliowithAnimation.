import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Preloader from '@/components/Preloader';
import CustomCursor from '@/components/CustomCursor';
import { applySeo } from '@/lib/seo';
import { isSettled } from '@/lib/readiness';
import Home from '@/pages/Home';
import CaseStudy from '@/pages/CaseStudy';
import NotFound from '@/pages/NotFound';

/**
 * Root shell.
 *
 * The preloader runs once per browser session. Client-side navigation
 * between sections or case studies never replays it, and a visitor who
 * refreshes mid-session goes straight to the content.
 */
const INTRO_KEY = 'sp-portfolio-intro-seen';

function hasSeenIntro(): boolean {
  try {
    return sessionStorage.getItem(INTRO_KEY) === '1';
  } catch {
    // Private-mode browsers can throw on sessionStorage access.
    return false;
  }
}

function markIntroSeen(): void {
  try {
    sessionStorage.setItem(INTRO_KEY, '1');
  } catch {
    /* non-fatal */
  }
}

/** Keeps route changes starting at the top, like a normal page load. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

export default function App() {
  const [skipIntro] = useState(() => hasSeenIntro() || isSettled());
  const [ready, setReady] = useState(skipIntro);

  useEffect(() => {
    applySeo();
  }, []);

  useEffect(() => {
    if (skipIntro) return;
    markIntroSeen();
  }, [skipIntro]);

  return (
    <>
      {!ready ? <Preloader onFinish={() => setReady(true)} /> : null}
      <CustomCursor />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home ready={ready} />} />
        <Route path="/work/:slug" element={<CaseStudy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
