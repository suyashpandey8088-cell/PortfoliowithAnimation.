import { useEffect } from 'react';
import { initGsap } from '@/lib/gsap';
import { completeTask } from '@/lib/readiness';
import Nav from '@/components/Nav';
import ScrollProgress from '@/components/ScrollProgress';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Experience from '@/components/Experience';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Achievements from '@/components/Achievements';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

/**
 * HOME — the full scroll narrative.
 *
 * Section order and dominant colour:
 *   hero        cream        (fly-through ends on a cobalt disc)
 *   about       cobalt
 *   experience  ink
 *   skills      cream
 *   projects    grape
 *   highlights  volt
 *   contact     ember
 *   footer      ink
 */
export default function Home({ ready }: { ready: boolean }) {
  useEffect(() => {
    // The hero stage is measured and its ScrollTriggers are built; report
    // readiness and let ScrollTrigger re-measure now that layout is final.
    const id = requestAnimationFrame(() => {
      initGsap();
      completeTask('hero');
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <>
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[140] focus:border-2 focus:border-ink focus:bg-volt focus:px-4 focus:py-2 focus:font-mono focus:text-[0.7rem] focus:tracking-[0.2em] focus:text-ink focus:uppercase"
      >
        Skip to content
      </a>

      <ScrollProgress />
      <Nav />

      <main id="main">
        <Hero ready={ready} />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Achievements />
        <Contact />
      </main>

      <Footer />
      <BackToTop />
    </>
  );
}
