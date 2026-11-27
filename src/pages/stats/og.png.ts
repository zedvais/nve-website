/**
 * /stats/og.png: the link-preview image for /stats (Discord, X, etc.).
 * Rendered at build time from src/data/stats.ts, so it always matches the page.
 * Styled like the site (lacquer black, hairlines, antique gold, the crest).
 * Satori lays out the card as SVG (text becomes paths) and sharp turns it into a PNG.
 */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { APIRoute } from 'astro';
import satori from 'satori';
import sharp from 'sharp';
import { game, site } from '@/data/site';
import { crestSvg } from '@/lib/crest';
import { formatNumber, openSeats, perks, perkTiers, stats, xpPercent, type PerkTier } from '@/data/stats';

const W = 1200;
/** Tall card so the perks fit; Discord shows the whole image. */
const H = 1080;
const PAD = 56;

const root = process.cwd();
const fromRoot = (...p: string[]) => readFile(join(root, ...p));
const font = (pkg: string, file: string) => fromRoot('node_modules', '@fontsource', pkg, 'files', file);

/** Site tokens (src/styles/global.css). */
const c = {
  bg: '#0b0a08',
  surface: '#13110d',
  fg: '#f3ead6',
  muted: '#a69c87',
  line: '#2b261d',
  accent: '#c9a45c',
  accentSoft: '#e6cd8c',
  accentMuted: '#6b5530',
};

type Node = { type: string; props: Record<string, unknown> };
const el = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}): Node => ({
  type,
  props: { style: { display: 'flex', ...style }, children, ...extra },
});
const text = (value: string, style: Record<string, unknown>) => el('div', style, value);
/** Cinzel: engraved capitals for labels. */
const display = (size: number, weight = 500) => ({ fontFamily: 'Cinzel', fontSize: size, fontWeight: weight });
/** Cormorant Garamond: the house serif for the name and figures. */
const serif = (size: number, weight = 500, fontStyle = 'normal') => ({ fontFamily: 'Cormorant Garamond', fontSize: size, fontWeight: weight, fontStyle });
const eyebrow = (value: string, color = c.muted) => text(value.toUpperCase(), { ...display(15, 500), letterSpacing: 3.5, color });
const img = (src: string, width: number, height: number, style: Record<string, unknown> = {}) =>
  el('img', { width, height, ...style }, undefined, { src, width, height });
const svgData = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

/** Deco sunburst fanning from the top-right corner, faded out (as in the site's hero). */
const gridSvg = (() => {
  const rays: string[] = [];
  for (let i = 0; i <= 24; i++) {
    const a = Math.PI / 2 + (Math.PI / 2) * (i / 24);
    rays.push(`<path d="M${W} 0L${(W + Math.cos(a) * 1500).toFixed(1)} ${(Math.sin(a) * 1500).toFixed(1)}" stroke-width="${i % 4 === 0 ? 1.4 : 0.7}"/>`);
  }
  const arcs = [220, 260, 520].map((r) => `<circle cx="${W}" cy="0" r="${r}"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><radialGradient id="f" cx="${W}" cy="0" r="1100" gradientUnits="userSpaceOnUse"><stop offset="0.15" stop-color="#c9a45c" stop-opacity="0.35"/><stop offset="1" stop-color="#c9a45c" stop-opacity="0"/></radialGradient></defs><g stroke="url(#f)" fill="none">${rays.join('')}${arcs}</g></svg>`;
})();

const tierOrder: PerkTier[] = ['economy', 'core', 'elite'];
const sortedPerks = [...perks].sort((a, b) => tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier));
const half = Math.ceil(sortedPerks.length / 2);
const perkColumns = [sortedPerks.slice(0, half), sortedPerks.slice(half)];
const diamond = (color: string, size = 9) => el('div', { width: size, height: size, background: color, transform: 'rotate(45deg)', flexShrink: 0 });

const tile = (label: string, value: string, max?: string, last = false) =>
  el('div', { flex: 1, flexDirection: 'column', boxSizing: 'border-box', padding: '24px 26px', background: c.bg, borderRight: last ? 'none' : `1px solid ${c.line}` }, [
    eyebrow(label),
    el('div', { alignItems: 'baseline', marginTop: 14 }, [
      text(value, { ...serif(66, 600), color: c.fg, lineHeight: 1 }),
      ...(max ? [text(`/ ${max}`, { ...serif(30, 500), color: c.muted, marginLeft: 8 })] : []),
    ]),
  ]);

export const GET: APIRoute = async () => {
  const [bold, medium, regular, serifMedium, serifBold, serifItalic, mark] = await Promise.all([
    font('cinzel', 'cinzel-latin-700-normal.woff'),
    font('cinzel', 'cinzel-latin-500-normal.woff'),
    font('inter', 'inter-latin-400-normal.woff'),
    font('cormorant-garamond', 'cormorant-garamond-latin-500-normal.woff'),
    font('cormorant-garamond', 'cormorant-garamond-latin-600-normal.woff'),
    font('cormorant-garamond', 'cormorant-garamond-latin-500-italic.woff'),
    sharp(Buffer.from(crestSvg())).resize({ height: 104 }).png().toBuffer({ resolveWithObject: true }),
  ]);

  const asOf = new Date(`${stats.asOf}T12:00:00Z`).toLocaleDateString('en-US', { timeZone: 'UTC', month: 'long', day: 'numeric', year: 'numeric' });
  const recruiting = !game.recruiting
    ? 'Recruitment closed'
    : openSeats > 0
      ? `Recruiting · ${openSeats} ${openSeats === 1 ? 'slot' : 'slots'} open`
      : 'Roster full';
  const badges = [...stats.rankings.map((r) => `#${r.rank} in ${r.label}`), `${stats.territories} territories held`, `${stats.wars.won}–${stats.wars.lost} war record`];
  const markH = 52;
  const markW = Math.round((mark.info.width / mark.info.height) * markH);

  const card = el('div', { width: W, height: H, position: 'relative', background: c.bg, fontFamily: 'Inter', color: c.fg }, [
    // Atmosphere: warm gold glow, deco sunburst, top hairline (as on the site).
    el('div', { position: 'absolute', top: 0, left: 0, width: W, height: H, backgroundImage: 'radial-gradient(70% 55% at 100% 0%, rgba(201,164,92,0.20), rgba(201,164,92,0) 70%)' }),
    el('div', { position: 'absolute', top: 0, left: 0, width: W, height: H, backgroundImage: 'radial-gradient(50% 40% at 0% 100%, rgba(107,85,48,0.22), rgba(107,85,48,0) 70%)' }),
    img(svgData(gridSvg), W, H, { position: 'absolute', top: 0, left: 0 }),
    el('div', { position: 'absolute', top: 0, left: 0, width: W, height: 2, backgroundImage: `linear-gradient(90deg, rgba(201,164,92,0), ${c.accent}, rgba(201,164,92,0))` }),

    // Double hairline frame
    el('div', { position: 'absolute', top: 18, left: 18, width: W - 36, height: H - 36, border: `1px solid ${c.line}` }),
    el('div', { position: 'absolute', top: 24, left: 24, width: W - 48, height: H - 48, border: '1px solid rgba(201,164,92,0.22)' }),
    el('div', { position: 'absolute', top: 0, left: 0, width: W, height: H, boxSizing: 'border-box', flexDirection: 'column', padding: `48px ${PAD}px 44px` }, [
      // Brand row
      el('div', { justifyContent: 'space-between', alignItems: 'center' }, [
        el('div', { alignItems: 'center', gap: 16 }, [
          img(`data:image/png;base64,${mark.data.toString('base64')}`, markW, markH),
          text(site.name.toUpperCase(), { ...display(19, 700), letterSpacing: 6 }),
        ]),
        el('div', { alignItems: 'center', gap: 12 }, [el('div', { width: 32, height: 1, background: c.accent }), eyebrow(`Family stats · ${asOf}`, c.accentSoft)]),
      ]),

      // Title + badges
      el('div', { alignItems: 'baseline', marginTop: 52 }, [
        text(site.house, { ...serif(34, 500, 'italic'), color: c.muted, marginRight: 18 }),
        text(site.name, { ...serif(92, 600), lineHeight: 1 }),
        text(site.shortName, { ...display(26, 700), letterSpacing: 8, color: c.accent, marginLeft: 22 }),
      ]),
      el('div', { gap: 10, marginTop: 26 }, badges.map((b) =>
        text(b.toUpperCase(), { ...display(12, 700), letterSpacing: 2, color: c.accentSoft, padding: '8px 12px', whiteSpace: 'nowrap', border: `1px solid ${c.accentMuted}`, background: 'rgba(201,164,92,0.10)' }),
      )),

      // Stat tiles, joined by hairlines like the site's stats panel
      el('div', { marginTop: 36, border: `1px solid ${c.line}` }, [
        tile('Family level', String(stats.level)),
        tile('Members', String(stats.members.current), String(stats.members.max)),
        tile('Respect', formatNumber(stats.respect)),
        tile('Perk levels', String(stats.perkLevels.current), String(stats.perkLevels.max), true),
      ]),

      // XP
      el('div', { justifyContent: 'space-between', alignItems: 'center', marginTop: 28 }, [
        eyebrow(`Family XP · to level ${stats.level + 1}`),
        el('div', { ...serif(22, 600) }, [
          text(formatNumber(stats.xp.current), { color: c.fg }),
          text(`/ ${formatNumber(stats.xp.next)}`, { color: c.muted, marginLeft: 8 }),
        ]),
      ]),
      el('div', { height: 12, flexShrink: 0, marginTop: 12, background: c.bg, border: `1px solid ${c.line}` }, [
        el('div', { width: `${xpPercent}%`, height: 10, backgroundImage: `linear-gradient(90deg, ${c.accentMuted}, ${c.accent}, ${c.accentSoft})` }),
      ]),

      // Perks
      el('div', { justifyContent: 'space-between', alignItems: 'center', marginTop: 44 }, [
        text('Family perks', { ...serif(38, 600) }),
        el('div', { gap: 22 }, tierOrder.map((t) =>
          el('div', { alignItems: 'center', gap: 8, ...display(14, 700), letterSpacing: 3, color: perkTiers[t].color }, [diamond(perkTiers[t].color, 8), text(perkTiers[t].label.toUpperCase(), {})]),
        )),
      ]),
      el('div', { gap: 40, marginTop: 8 }, perkColumns.map((col) =>
        el('div', { flex: 1, flexDirection: 'column' }, col.map((p) =>
          el('div', { alignItems: 'center', height: 40, borderBottom: `1px solid ${c.line}`, fontSize: 18 }, [
            diamond(perkTiers[p.tier].color),
            text(p.name, { marginLeft: 14, color: c.fg }),
            el('div', { flex: 1 }),
            text(p.effect, { ...serif(21, 600), color: perkTiers[p.tier].color }),
          ]),
        )),
      )),

      // Footer
      el('div', { flex: 1 }),
      el('div', { justifyContent: 'space-between', alignItems: 'center' }, [
        text(site.tagline, { ...serif(24, 500, 'italic'), color: c.muted }),
        eyebrow(recruiting, c.accentSoft),
      ]),
    ]),
  ]);

  const svg = await satori(card as unknown as Parameters<typeof satori>[0], {
    width: W,
    height: H,
    fonts: [
      { name: 'Cinzel', data: bold, weight: 700, style: 'normal' },
      { name: 'Cinzel', data: medium, weight: 500, style: 'normal' },
      { name: 'Cormorant Garamond', data: serifMedium, weight: 500, style: 'normal' },
      { name: 'Cormorant Garamond', data: serifBold, weight: 600, style: 'normal' },
      { name: 'Cormorant Garamond', data: serifItalic, weight: 500, style: 'italic' },
      { name: 'Inter', data: regular, weight: 400, style: 'normal' },
    ],
  });
  const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();

  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
