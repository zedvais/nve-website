/**
 * /stats/og.png: the link-preview image for /stats (Discord, X, etc.).
 * Rendered at build time from src/data/stats.ts, so it always matches the page.
 * Styled like the site (dark surface, hairlines, purple accents, the NV mark).
 * Satori lays out the card as SVG (text becomes paths) and sharp turns it into a PNG.
 */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { APIRoute } from 'astro';
import satori from 'satori';
import sharp from 'sharp';
import { game, site } from '@/data/site';
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
  bg: '#09090b',
  surface: '#121218',
  fg: '#f3f1ff',
  muted: '#a5a3b8',
  line: '#292735',
  accent: '#8b5cf6',
  accentSoft: '#b9a4fb',
  accentMuted: '#4a3e8c',
};

type Node = { type: string; props: Record<string, unknown> };
const el = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}): Node => ({
  type,
  props: { style: { display: 'flex', ...style }, children, ...extra },
});
const text = (value: string, style: Record<string, unknown>) => el('div', style, value);
const display = (size: number, weight = 500) => ({ fontFamily: 'Space Grotesk', fontSize: size, fontWeight: weight });
const eyebrow = (value: string, color = c.muted) => text(value.toUpperCase(), { ...display(15, 500), letterSpacing: 3.5, color });
const img = (src: string, width: number, height: number, style: Record<string, unknown> = {}) =>
  el('img', { width, height, ...style }, undefined, { src, width, height });
const svgData = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

/** The site's faint 96px grid, faded out towards the bottom. */
const gridSvg = (() => {
  const lines: string[] = [];
  for (let x = 96; x < W; x += 96) lines.push(`<path d="M${x} 0V${H}"/>`);
  for (let y = 96; y < H; y += 96) lines.push(`<path d="M0 ${y}H${W}"/>`);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset="0.55" stop-color="#fff" stop-opacity="0"/></linearGradient><mask id="m"><rect width="${W}" height="${H}" fill="url(#f)"/></mask></defs><g mask="url(#m)" stroke="#f3f1ff" stroke-opacity="0.05">${lines.join('')}</g></svg>`;
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
      text(value, { ...display(58, 700), color: c.fg, letterSpacing: -1.8, lineHeight: 1 }),
      ...(max ? [text(`/ ${max}`, { ...display(26, 500), color: c.muted, marginLeft: 8 })] : []),
    ]),
  ]);

export const GET: APIRoute = async () => {
  const [bold, medium, regular, mark] = await Promise.all([
    font('space-grotesk', 'space-grotesk-latin-700-normal.woff'),
    font('space-grotesk', 'space-grotesk-latin-500-normal.woff'),
    font('inter', 'inter-latin-400-normal.woff'),
    fromRoot('src', 'assets', 'brand', 'nv-mark.png').then((buf) => sharp(buf).resize({ height: 72 }).png().toBuffer({ resolveWithObject: true })),
  ]);

  const asOf = new Date(`${stats.asOf}T12:00:00Z`).toLocaleDateString('en-US', { timeZone: 'UTC', month: 'long', day: 'numeric', year: 'numeric' });
  const recruiting = !game.recruiting
    ? 'Recruitment closed'
    : openSeats > 0
      ? `Recruiting · ${openSeats} ${openSeats === 1 ? 'slot' : 'slots'} open`
      : 'Roster full';
  const badges = [...stats.rankings.map((r) => `#${r.rank} in ${r.label}`), `${stats.territories} territories held`];
  const markH = 36;
  const markW = Math.round((mark.info.width / mark.info.height) * markH);

  const card = el('div', { width: W, height: H, position: 'relative', background: c.bg, fontFamily: 'Inter', color: c.fg }, [
    // Atmosphere: soft purple glow, faint grid, top hairline (as on the site).
    el('div', { position: 'absolute', top: 0, left: 0, width: W, height: H, backgroundImage: 'radial-gradient(70% 55% at 100% 0%, rgba(139,92,246,0.20), rgba(139,92,246,0) 70%)' }),
    el('div', { position: 'absolute', top: 0, left: 0, width: W, height: H, backgroundImage: 'radial-gradient(50% 40% at 0% 100%, rgba(74,62,140,0.22), rgba(74,62,140,0) 70%)' }),
    img(svgData(gridSvg), W, H, { position: 'absolute', top: 0, left: 0 }),
    el('div', { position: 'absolute', top: 0, left: 0, width: W, height: 2, backgroundImage: `linear-gradient(90deg, rgba(139,92,246,0), ${c.accent}, rgba(139,92,246,0))` }),

    el('div', { position: 'absolute', top: 0, left: 0, width: W, height: H, boxSizing: 'border-box', flexDirection: 'column', padding: `48px ${PAD}px 44px` }, [
      // Brand row
      el('div', { justifyContent: 'space-between', alignItems: 'center' }, [
        el('div', { alignItems: 'center', gap: 16 }, [
          img(`data:image/png;base64,${mark.data.toString('base64')}`, markW, markH),
          text(site.name.toUpperCase(), { ...display(17, 700), letterSpacing: 5 }),
        ]),
        el('div', { alignItems: 'center', gap: 12 }, [el('div', { width: 32, height: 1, background: c.accent }), eyebrow(`Family stats · ${asOf}`, c.accentSoft)]),
      ]),

      // Title + badges
      el('div', { alignItems: 'baseline', marginTop: 64 }, [
        text(site.name, { ...display(84, 700), letterSpacing: -2.8, lineHeight: 1 }),
        text(`[${site.shortName}]`, { ...display(36, 700), color: c.accent, marginLeft: 18 }),
      ]),
      el('div', { gap: 10, marginTop: 26 }, badges.map((b) =>
        text(b.toUpperCase(), { ...display(14, 700), letterSpacing: 2.6, color: c.accentSoft, padding: '9px 14px', border: `1px solid ${c.accentMuted}`, background: 'rgba(139,92,246,0.10)' }),
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
        el('div', { ...display(17, 500) }, [
          text(formatNumber(stats.xp.current), { color: c.fg }),
          text(`/ ${formatNumber(stats.xp.next)}`, { color: c.muted, marginLeft: 8 }),
        ]),
      ]),
      el('div', { height: 10, marginTop: 12, background: c.bg, border: `1px solid ${c.line}` }, [
        el('div', { width: `${xpPercent}%`, height: '100%', backgroundImage: `linear-gradient(90deg, ${c.accentMuted}, ${c.accent}, ${c.accentSoft})` }),
      ]),

      // Perks
      el('div', { justifyContent: 'space-between', alignItems: 'center', marginTop: 44 }, [
        text('Family perks', { ...display(30, 700), letterSpacing: -0.5 }),
        el('div', { gap: 22 }, tierOrder.map((t) =>
          el('div', { alignItems: 'center', gap: 8, ...display(14, 700), letterSpacing: 3, color: perkTiers[t].color }, [diamond(perkTiers[t].color, 8), text(perkTiers[t].label.toUpperCase(), {})]),
        )),
      ]),
      el('div', { gap: 40, marginTop: 8 }, perkColumns.map((col) =>
        el('div', { flex: 1, flexDirection: 'column' }, col.map((p) =>
          el('div', { alignItems: 'center', height: 42, borderBottom: `1px solid ${c.line}`, fontSize: 18 }, [
            diamond(perkTiers[p.tier].color),
            text(p.name, { marginLeft: 14, color: c.fg }),
            el('div', { flex: 1 }),
            text(p.effect, { ...display(17, 700), color: perkTiers[p.tier].color }),
          ]),
        )),
      )),

      // Footer
      el('div', { flex: 1 }),
      el('div', { justifyContent: 'space-between', alignItems: 'center' }, [
        eyebrow(`${site.tagline}`),
        eyebrow(recruiting, c.accentSoft),
      ]),
    ]),
  ]);

  const svg = await satori(card as unknown as Parameters<typeof satori>[0], {
    width: W,
    height: H,
    fonts: [
      { name: 'Space Grotesk', data: bold, weight: 700, style: 'normal' },
      { name: 'Space Grotesk', data: medium, weight: 500, style: 'normal' },
      { name: 'Inter', data: regular, weight: 400, style: 'normal' },
    ],
  });
  const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();

  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
