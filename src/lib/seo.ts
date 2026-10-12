import { useEffect } from 'react';
import { siteUrl } from '@/content/profile';

/**
 * Runtime SEO patching.
 *
 * `index.html` ships generic tags. On boot we inject the canonical URL and
 * rewrite the Open Graph `url` from `VITE_SITE_URL`, so Vercel preview
 * deployments do not all claim the production canonical — and a missing
 * variable simply leaves no canonical behind rather than emitting a wrong one.
 */
export function applySeo(): void {
  if (typeof document === 'undefined') return;

  if (siteUrl) {
    const base = siteUrl.replace(/\/$/, '');

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `${base}${window.location.pathname}`;

    let ogUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.content = `${base}${window.location.pathname}`;
  }
}

export function useSeo(): void {
  useEffect(() => {
    applySeo();
  }, []);
}
