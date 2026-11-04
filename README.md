# Noctus Volpe (NVE) — Official Website

The official home of the Noctus Volpe gaming family. A fast, fully static site built with
**Astro**, **Tailwind CSS v4**, **TypeScript** and **Lucide** icons, ready to deploy on **Vercel**.

## Quick start

Requirements: Node.js 22.12+ and npm.

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # type-checks, then builds to ./dist
npm run preview   # serves the production build locally
npm test          # unit tests (Vitest)
npm run check     # type-check only
```

`npm run dev` has hot reload: edits to components, styles and data files show up in the browser
as soon as you save.

## Editing content

All frequently changed content lives in `src/data/`. Components read from these files, so you
never need to touch markup to update the site.

| File | What it controls |
| --- | --- |
| `src/data/site.ts` | Name, tagline, SEO description, navigation, hero (and `heroStyle`), About, Values, the night-scene interlude, Family and Journey intros, recruitment copy, optional application form URL, logo |
| `src/data/members.ts` | Family roster (Roblox usernames and ranks) and the three roster groups |
| `src/data/stats.ts` | Family stats snapshot (level, members, respect, perk levels, XP, rankings, territories, war record) and the family perks list |
| `src/data/highlights.ts` | "Our Journey" milestones and achievements |
| `src/data/socials.ts` | Discord invite and other social links |

### Discord invite

The invite lives in `discord.url` in `src/data/socials.ts`. Every Discord button (header, mobile
menu, Join section, footer) reads from it. Clear it and the buttons fall back to the Join section.

### Members and Roblox avatars

The roster lives in `src/data/members.ts`. Each member needs only a Roblox username and a rank:

```ts
player('RobloxUsername', 'Soldier', 'ranks'),
```

| Group on the site | `tier` | Ranks |
| --- | --- | --- |
| Leadership | `leadership` | Boss, Underboss |
| Advisors | `council` | Advisor, Capo |
| Members | `ranks` | Soldier, Associate |

Within a group, members appear by rank (Boss → Associate) and then in the order they are written
in the file. In Leadership and Advisors the first rank (Boss, Advisor) gets the large full-width
card. Long groups show 8 cards and a "+N more members" card that expands the rest. Visitors can
also search by name and filter by group. If the in-game member count in `stats.ts` is higher than
the roster, a "+N more members in the family" card covers the difference.

Optional fields: `title` (shown beside the rank, e.g. `{ title: 'Founder' }`), `avatar` (a local
image from `src/assets/avatars/` instead of the Roblox headshot) and `bio`.

When the site builds (and while `npm run dev` runs), `src/lib/roblox.ts` looks up each username
through Roblox's public API. Each card then shows the player's avatar headshot and links to their
Roblox profile. There is no backend: the lookup happens at build time, so avatars refresh on every
deploy. If a username isn't found or Roblox is unreachable, the build still succeeds: it logs a
`[roblox]` warning and that card shows the NV mark. A card showing the NV mark usually means a
typo in the username (watch for `0`/`O` and `I`/`l`).

The tests in `tests/members.test.ts` catch common roster mistakes: unknown ranks, a rank in the
wrong group, duplicate usernames, more than one Boss, or more members than the family has.

### Family stats

Update `src/data/stats.ts` from the in-game Family overview and change `asOf` to the date of the
snapshot. The stats panel, XP bar, perks list, the hero's level and recruitment status, and the
open-seats count are all calculated from it.

The war record (`stats.wars`) feeds the hero strip, the stats tags and the Family wars milestone.

### Highlights

Each highlight in `src/data/highlights.ts` can have an optional `date` and `metric`. Leave them out
until there is a real record. Mark an entry `placeholder: true` while it describes something that
has not happened yet.

### Logo and brand images

Official brand assets live in `src/assets/brand/` and are wired up in `site.logo` in `src/data/site.ts`.
Astro converts them to optimised WebP at build time.

| File | Used for |
| --- | --- |
| `nv-logo.png` | The silver-and-purple NV fox monogram (About panel, family cards) |
| `nv-mark.png` | The simple white NV mark (header, mobile menu, avatar placeholders) |
| `nv-lockup.png` | The simple mark with the NOCTUS VOLPE wordmark (footer) |
| `rooftop.jpg` | Hero background photo, used when `site.heroStyle` is `'photo'` |

The logo PNGs have transparent backgrounds, cut out from the original black-background artwork.
To update one, replace the file and keep its name. `public/favicon.png`, `public/favicon-48.png`,
`public/apple-touch-icon.png` and `public/og-image.jpg` (the 1200×630 social preview) are made
from the same artwork.

### Social links

Fill in the `url` for any platform in `src/data/socials.ts`. Links with an empty URL are hidden.

## Animated artwork

All artwork is original vector art drawn in SVG and animated with CSS only. There are no images,
canvas or animation libraries.

| Component | Where |
| --- | --- |
| `art/RooftopScene` | Hero backdrop: the fox on the rooftop, fog, city lights, traffic. Set `site.heroStyle = 'photo'` to use `rooftop.jpg` instead |
| `art/ValueLine` | Hairline divider with the four values under the hero |
| `sections/NightScene` + `art/FoxConstellation`, `art/OrbitRings` | "United as one" interlude |
| `art/Embers`, `art/NightSkyline`, `art/CityMap`, `art/ValueArt`, `art/DecoDivider` | Accents across the page |

Procedural pieces (skylines, stars, embers, city lights) are generated at build time from a fixed
seed (`src/lib/random.ts`), so every build draws the same picture. Wrap any animated block in an
element with `data-scene`: its animations only run while it is on screen, and `.scene-draw` /
`.scene-fade` children draw in the first time it appears. Everything is static when the visitor
prefers reduced motion. Keep new art in the same spirit: hairlines, muted colours, slow motion.

## Project structure

```
src/
├── components/
│   ├── layout/      Header, MobileNavigation, Footer, SEO
│   ├── sections/    HeroSection, AboutSection, ValuesGrid, NightScene, FamilySection,
│   │                HighlightsSection, RecruitmentSection
│   ├── ui/          Button, Container, SectionHeading, MemberCard, HighlightCard,
│   │                StatsPanel, PerkList, Logo, FoxMotif, SocialIcon
│   └── art/         Vector artwork (see "Animated artwork")
├── data/            Centralised content (see above)
├── layouts/         BaseLayout (shared <head>, header, footer)
├── lib/             roblox.ts (build-time avatars), random.ts (seeded art), format.ts (helpers)
├── pages/           index.astro, 404.astro, robots.txt.ts
├── scripts/         Client JS: site.ts (header, nav, menu, reveals, scene playback),
│                    roster.ts (member search, filters, expand/collapse)
└── styles/          global.css — Tailwind import, design tokens (@theme), motion
tests/               Vitest unit tests
src/assets/brand/    Official logo files and hero photo
public/              favicon, apple-touch-icon, og-image
```

## Tests and CI

```bash
npm test             # run once
npm run test:watch   # re-run on save
```

| File | Covers |
| --- | --- |
| `tests/members.test.ts` | Rank sorting and roster data integrity |
| `tests/roster.test.ts` | Member search, rank filters, expand/collapse (in a simulated browser) |
| `tests/roblox.test.ts` | Roblox lookups with a mocked network: success, dedupe and caching, outages |
| `tests/format.test.ts` | Date, number, percentage and seat helpers |
| `tests/random.test.ts` | The seeded generator behind the artwork |

`.github/workflows/ci.yml` runs the tests, the type check and a production build on every pull
request and every push to `main`.

### Design tokens

Tailwind v4 is configured in CSS rather than a `tailwind.config.*` file. Colours and fonts are
defined in the `@theme` block of `src/styles/global.css` and are available as utilities
(`bg-surface`, `text-muted`, `border-line`, `text-accent`, `font-display`, …).

### Adding pages later

New pages go in `src/pages/` and wrap their content in `BaseLayout`. Navigation links use
`/#section` hrefs so they keep working from sub-pages. Suggested homes for future features:

- News, events, guides: Astro content collections in `src/content/` with routes such as
  `src/pages/news/[slug].astro`.
- Member profiles: `src/pages/family/[slug].astro` generated from `members.ts`.
- Wiki search: a static search index such as Pagefind, added at build time.

## SEO and accessibility

- Per-page title, description, canonical URL, Open Graph and Twitter card tags (`SEO.astro`)
- Organization JSON-LD
- `sitemap-index.xml` via `@astrojs/sitemap`, and `robots.txt` pointing to it
- Semantic landmarks, one `h1`, ordered headings, skip link, visible focus styles
- Keyboard-accessible mobile menu (focus trap, Escape to close)
- Animations respect `prefers-reduced-motion`, and content stays visible without JavaScript
- The member roster renders in full without JavaScript; search and expand/collapse are enhancements
- Self-hosted fonts (no third-party requests)

## Deploying to Vercel

1. Push this project to a GitHub, GitLab or Bitbucket repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Vercel detects Astro automatically. Defaults are correct:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`
4. Click **Deploy**.

The canonical URL (sitemap, Open Graph) comes from Vercel's production URL automatically.
When you add a custom domain, set the environment variable `PUBLIC_SITE_URL`
(e.g. `https://noctusvolpe.com`) under **Settings → Environment Variables** and redeploy.

CLI alternative:

```bash
npm i -g vercel
vercel          # preview deployment
vercel --prod   # production deployment
```
