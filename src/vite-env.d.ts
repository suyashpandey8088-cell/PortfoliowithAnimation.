/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Canonical site URL, e.g. https://suyashpandey.dev */
  readonly VITE_SITE_URL?: string;
  /** Formspree form id. Empty => mailto fallback. */
  readonly VITE_FORMSPREE_ID?: string;
  /** Fallback email address for the mailto path. */
  readonly VITE_CONTACT_EMAIL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
