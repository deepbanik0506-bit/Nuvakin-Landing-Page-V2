# Nuvakin — Landing Page V2

The public landing page for Nuvakin: _Better decisions start with better intelligence._

Built with Next.js (App Router), TypeScript and Tailwind CSS v4. It is a single static
page plus one server route (`/api/waitlist`) that stores waitlist sign-ups in a Google Sheet.

## Getting started

```bash
npm install
cp .env.example .env.local      # then fill in values (see below)
npm run dev                     # http://localhost:3000
```

| Script          | Purpose                          |
| --------------- | -------------------------------- |
| `npm run dev`   | Development server               |
| `npm run build` | Production build                 |
| `npm start`     | Serve the production build       |
| `npm run lint`  | ESLint                           |
| `npm run mock:waitlist` | Local stand-in for the Apps Script endpoint |

To exercise the waitlist locally without Google, run the mock endpoint in a second
terminal with `npm run mock:waitlist`, then set
`WAITLIST_ENDPOINT_URL=http://localhost:8787` and `WAITLIST_SHARED_SECRET=dev-secret`.

## Environment variables

| Variable                    | Scope  | Required | Notes                                                   |
| --------------------------- | ------ | -------- | ------------------------------------------------------- |
| `WAITLIST_ENDPOINT_URL`     | server | yes      | Apps Script web app `/exec` URL                         |
| `WAITLIST_SHARED_SECRET`    | server | yes      | Must equal the script's `WAITLIST_SECRET` property      |
| `NEXT_PUBLIC_SITE_URL`      | public | no       | Canonical URL; defaults to `https://nuvakin.com`        |
| `NEXT_PUBLIC_CONTACT_EMAIL` | public | no       | Footer contact; defaults to `office@nuvakin.com`        |
| `NEXT_PUBLIC_LINKEDIN_URL`  | public | no       | Footer LinkedIn link; hidden when unset                 |

`.env*` files are git-ignored (except `.env.example`). Never commit real values.

Google Sheets setup, step by step: **[docs/GOOGLE_SHEETS_SETUP.md](docs/GOOGLE_SHEETS_SETUP.md)**.

## Deployment

The site targets **Vercel** (zero config for Next.js): import the repository, set the
environment variables above for Production (and Preview if wanted), and deploy. Any Node
host that runs `next build && next start` also works.

## Project structure

```
src/
  app/                 layout (fonts, metadata, JSON-LD), page, robots, sitemap, icon, OG image
    api/waitlist/      POST handler: validation, honeypot, timing + rate limits, forwarding
  components/
    brand/             Logo mark + wordmark (paths from the official logo, reversed for dark)
    layout/            Header (incl. mobile menu), footer, client enhancements
    sections/          One file per page section, in page order
    evidence/          Citation explorer + research findings block
    waitlist/          Waitlist form (client)
    ui/                ButtonLink, SectionHeading
  content/research.ts  Cited research findings (empty until sourced — see below)
  lib/
    site.ts            Site config + navigation
    analytics.ts       Vendor-neutral conversion events
    waitlist/          Shared validation schema, rate limiter, Apps Script client
apps-script/           Google Apps Script source for the sheet
scripts/               Local mock of the Apps Script endpoint
docs/                  Setup guides
```

## Design system

- **Palette** (tokens in `src/app/globals.css`): Midnight Navy `#0B1020` (ground), Tangerine
  Petal `#FF7A2A` (accent), Cobalt Bloom `#4A6ED1` (structure, diagrams; `#7E98E0` for cobalt
  text), Dusty Taupe `#B59A90` (evidence, sources). Body text is warm off-white `#F3EDE5` /
  `#B8B1AA`.
- **Type**: Newsreader (editorial serif, headlines), Geist (body), Geist Mono (labels, data).
- **Grain**: a single tiled SVG-noise layer (`.grain`), fixed, about 6% opacity.
- **Motion**: plays once and has a purpose (fragments → record, the stage sequence,
  section reveals). Everything respects `prefers-reduced-motion`.

## Adding research findings later

Add entries to `src/content/research.ts`. Each needs a statement and a source; an optional
figure is shown large. The Evidence section shows a "Research" block automatically once the
list is non-empty. Only add claims a citable source supports, and state them as narrowly as
the source does.

## Analytics

`src/lib/analytics.ts` emits `waitlist_cta_click`, `waitlist_form_start`,
`waitlist_submit_success`, `waitlist_submit_duplicate` and `waitlist_submit_error`. Each event
is pushed to `window.dataLayer` (if present) and dispatched as a `nuvakin:analytics` DOM event.
No analytics vendor is installed; connect one by listening for those events.

## Brand assets

The mark and wordmark in `src/components/brand/Logo.tsx` are the official primary logo
paths, split and recoloured (navy → warm white, amber → Tangerine) for the dark V2 palette.
If an official dark-background variant is produced, replace the path data there and in
`src/app/icon.svg`.

## Launch checklist

1. Deploy the Apps Script and connect the sheet (see [docs/GOOGLE_SHEETS_SETUP.md](docs/GOOGLE_SHEETS_SETUP.md)).
2. Set `WAITLIST_ENDPOINT_URL` and `WAITLIST_SHARED_SECRET` in the hosting environment, then
   redeploy. Submit a real test entry and confirm it appears in the sheet.
3. Optional: set `NEXT_PUBLIC_LINKEDIN_URL` to show LinkedIn in the footer.
4. Recommended before collecting sign-ups publicly: publish a privacy notice that explains
   how waitlist details (name, email, phone) are stored and used, and link it from the form.
