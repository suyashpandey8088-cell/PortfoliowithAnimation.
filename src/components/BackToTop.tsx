import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { HandArrow } from './graphics/Primitives';

/** Appears only once the visitor has genuinely scrolled away from the hero. */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 1.2);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() =>
        window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
      }
      aria-label="Back to top"
      className={`group fixed right-4 bottom-4 z-[90] flex h-14 w-14 items-center justify-center rounded-full border-2 border-ink bg-volt text-ink shadow-block transition-all duration-300 sm:right-6 sm:bottom-6 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
      }`}
    >
      <span className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1">
        <HandArrow towards="up" className="h-5 w-5" />
      </span>
    </button>
  );
}
