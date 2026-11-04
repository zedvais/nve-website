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
```

## Editing content

All frequently changed content lives in `src/data/`. Components read from these files, so you
never need to touch markup to update the site.

| File | What it controls |
| --- | --- |
| `src/data/site.ts` | Name, tagline, SEO description, navigation, hero, About, Values, Family and Journey intros, recruitment copy, optional application form URL, logo path |
| `src/data/members.ts` | Family roster by rank, with Roblox usernames for avatars and profile links |
| `src/data/highlights.ts` | "Our Journey" milestones and achievements |
| `src/data/socials.ts` | Discord invite and other social links |

### Discord invite

Set `discord.url` in `src/data/socials.ts`, e.g. `'https://discord.gg/your-invite'`.
Until it is set, Discord buttons are shown as "coming soon" (or link to the Join section);
no invite link is invented.

### Members and Roblox avatars

The roster lives in `src/data/members.ts`, grouped by Idle Mafia rank. Add a member with the
`player()` helper:

```ts
player('RobloxUsername', 'Soldier', 'ranks'),
```

When the site builds (and while `npm run dev` runs), `src/lib/roblox.ts` looks up each username
through Roblox's public API. Each card then shows the player's avatar headshot and links to their
Roblox profile. There is no backend: the lookup happens at build time, so avatars refresh on every
deploy. If a username isn't found or Roblox is unreachable, the build still succeeds: it logs a
`[roblox]` warning and that card shows the NV mark.

To use a custom picture instead, put it in `src/assets/avatars/`, import it in `members.ts` and set
`avatar` on that member. Add an optional `bio` for a short line under the name.

### Highlights

Each highlight can have an optional `date` and `metric`. Leave them out until there is a real
record. Set `placeholder: false` (or remove it) once an entry describes something that happened.

### Logo and brand images

Official brand assets live in `src/assets/brand/` and are wired up in `site.logo` in `src/data/site.ts`.
Astro converts them to optimised WebP at build time.

| File | Used for |
| --- | --- |
| `nv-logo.png` | The silver-and-purple NV fox monogram (About panel, family cards) |
| `nv-mark.png` | The simple white NV mark (header, mobile menu, avatar placeholders) |
| `nv-lockup.png` | The simple mark with the NOCTUS VOLPE wordmark (footer) |
| `rooftop.jpg` | Hero background photo (`site.heroBackground`) |

The logo PNGs have transparent backgrounds, cut out from the original black-background artwork.
To update one, replace the file and keep its name. `public/favicon.png`, `public/favicon-48.png`,
`public/apple-touch-icon.png` and `public/og-image.jpg` (the 1200×630 social preview) are made
from the same artwork.

### Social links

Fill in the `url` for any platform in `src/data/socials.ts`. Links with an empty URL are hidden.

## Project structure

```
src/
├── components/
│   ├── layout/      Header, MobileNavigation, Footer, SEO
│   ├── sections/    HeroSection, AboutSection, ValuesGrid, FamilySection,
│   │                HighlightsSection, RecruitmentSection
│   ├── ui/          Button, Container, SectionHeading, MemberCard, HighlightCard,
│   │                Logo, FoxMotif, SocialIcon
│   └── art/         Vector artwork: NightSkyline, CityMap, FoxCards, ValueArt,
│                    Marquee, DecoDivider
├── data/            Centralised content (see above)
├── layouts/         BaseLayout (shared <head>, header, footer)
├── pages/           index.astro, 404.astro, robots.txt.ts
├── scripts/         site.ts — the only client JS (header, active nav, menu, reveals)
└── styles/          global.css — Tailwind import, design tokens (@theme), motion
src/assets/brand/    Official logo files and hero photo
public/              favicon, apple-touch-icon, og-image
```

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
