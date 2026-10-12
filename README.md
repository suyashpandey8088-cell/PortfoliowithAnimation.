# Suyash Pandey — Interactive Portfolio

An animation-first, maximalist personal portfolio. Scrolling is the narrative: the
homepage is a pinned 3-D typography fly-through that collapses the name into the `SP`
monogram, every section has its own colour identity and motion concept, and the whole
thing opens with a branded, honestly-progressed loading sequence.

Built with **React 19 · TypeScript · Vite · Tailwind CSS v4 · GSAP + ScrollTrigger**.

---

## Quick start

```bash
npm install        # install dependencies
npm run dev        # start the dev server (http://localhost:5173)
npm run build      # type-check + production build → dist/
npm run preview    # serve the production build locally
```

Helper scripts:

```bash
npm run typecheck       # tsc project build, no emit
npm run generate:brand  # regenerate og-image.png + apple-touch-icon.png
npm run smoke           # boot the real app in jsdom and fail on any runtime throw
```

Environment variables (optional — see `.env.example`):

| Variable              | Purpose                                                            |
| --------------------- | ------------------------------------------------------------------ |
| `VITE_SITE_URL`       | Canonical URL for SEO / Open Graph tags.                            |
| `VITE_FORMSPREE_ID`   | Formspree form id. When set, the contact form POSTs for real.       |
| `VITE_CONTACT_EMAIL`  | Fallback email for the `mailto:` contact path.                      |

---

## Project structure

```
├── index.html                  # SEO/OG metadata + critical preloader CSS
├── vercel.json                 # Vercel build + SPA rewrite config
├── public/                     # favicon, og-image, robots, sitemap, manifest
├── scripts/
│   ├── generate-brand-images.mjs  # dependency-free PNG brand generator
│   └── smoke.mjs                  # jsdom runtime smoke test
└── src/
    ├── content/                # ✏️ ALL copy lives here (edit me first)
    │   ├── profile.ts          #   identity, about copy, socials, contact
    │   ├── experience.ts       #   the five internship chapters
    │   ├── skills.ts           #   skill constellation data
    │   ├── projects.ts         #   gallery + case-study content
    │   ├── achievements.ts     #   verified highlights (empty on purpose)
    │   └── nav.ts              #   nav items + per-section colour themes
    ├── lib/                    # readiness tracker, gsap config, links, seo
    ├── hooks/                  # useHeroFlythrough, useTilt, media/reduced-motion
    ├── components/             # Preloader, Nav, sections, graphics library
    └── pages/                  # Home, CaseStudy, NotFound
```

---

## Editing your content

Everything the site says is data, not code. Open a file under `src/content/`:

- **Identity / about / socials** → `profile.ts`. Fields marked `TODO(suyash)` are
  placeholders and render as an honest "not configured" state until filled.
- **Internships** → `experience.ts`. Add company, dates, responsibilities,
  technologies and verified achievements. Each entry drives one chapter of the
  pinned timeline; `accent` controls its colour and `ChapterMotif` its shape.
- **Skills** → `skills.ts`. It ships as a conservative starter set. **Delete anything
  you could not defend in an interview.** No percentages are used — levels are a
  coarse self-assessment on purpose.
- **Projects** → `projects.ts`. Add a `cover` path, `demoUrl`/`repoUrl` and,
  optionally, a `caseStudy` object to get a `/work/<slug>` page. Empty links render
  as disabled "coming soon" chips — never as fake buttons.
- **Achievements** → `achievements.ts`. Nothing is fabricated; set `verified: true`
  on real entries.

### Adding images

Put cover art in `public/projects/` (WebP/AVIF preferred) and set
`cover: '/projects/your-file.webp'` in `projects.ts`. If `cover` is empty or the
image fails, a generated SVG artwork in the project's accent is used instead, so a
missing asset never breaks the layout.

### Adding social links

Edit `profile.socials` in `profile.ts`. Real URLs become clickable; empty ones show
as "not configured" without pretending to work.

---

## Contact form

Three honest modes, chosen automatically:

1. **Formspree** — set `VITE_FORMSPREE_ID` in Vercel env vars and the form POSTs and
   reports the real HTTP result.
2. **mailto:** — with only `VITE_CONTACT_EMAIL` set, submitting hands a prefilled
   message to the visitor's mail client and says exactly that.
3. **Unconfigured** — with neither set, the form is visibly disabled with setup
   instructions and direct channels are offered instead.

There is no path that reports success without a confirmed send.

---

## Deploying to Vercel

1. Push this repo to GitHub and import it in Vercel.
2. Vercel auto-detects the `Vite` framework (`vercel.json` pins the build and output).
3. Add any of the env vars above in **Project → Settings → Environment Variables**.
4. Deploy. The SPA rewrite in `vercel.json` keeps `/work/<slug>` and deep links working.

Set `VITE_SITE_URL` to your live domain after the first deploy so canonical / OG tags
are correct.

---

## How the signature pieces work

### Hero fly-through

The runway (`track`) is `~430vh` tall and the stage inside it is `position: sticky`,
so pinning is pure CSS — ScrollTrigger only *reads* progress and never pins, which
means no pin-spacer and no layout jump. One scrubbed timeline drives six phases:
settle → depth separation → camera fly-through → scatter (all letters except `S` and
`P`) → convergence into the `SP` monogram → a cobalt disc that expands into About.
Convergence targets are computed from transform-independent `offsetLeft/Top`, so they
survive resizes via `invalidateOnRefresh`. Reduced motion renders the final state with
no runway at all.

### Preloader

The percentage is real: a `readiness` tracker counts named tasks (`dom`, `fonts`,
`motion`, `hero`) that each complete or time out, so it can never sit stuck. On
completion the monogram physically flies into the nav logo slot and panels wipe away.
It runs once per session (`sessionStorage`) and is skipped entirely under reduced
motion.

---

## Accessibility

Semantic landmarks, a real accessible `<h1>`, keyboard-navigable nav and skill nodes,
visible focus rings, screen-reader-only full experience list, `aria-live` form status,
and a global `prefers-reduced-motion` kill-switch. Decoration is `aria-hidden`.
