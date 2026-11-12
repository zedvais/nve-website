/**
 * /stats/og.png: the link-preview image for /stats (Discord, X, etc.).
 * Rendered at build time from src/data/stats.ts, so it always matches the page.
 * Satori lays out the card as SVG (text becomes paths) and sharp turns it into a PNG.
 */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { APIRoute } from 'astro';
import satori from 'satori';
import sharp from 'sharp';
import { game, site } from '@/data/site';
import { formatNumber, openSeats, stats, xpPercent } from '@/data/stats';

const W = 1200;
const H = 630;

const root = process.cwd();
const fromRoot = (...p: string[]) => readFile(join(root, ...p));
const font = (pkg: string, file: string) => fromRoot('node_modules', '@fontsource', pkg, 'files', file);

const c = {
  bg: '#09090b',
  fg: '#f3f1ff',
  muted: '#a5a3b8',
  line: '#292735',
  accent: '#8b5cf6',
  accentSoft: '#b9a4fb',
  gold: '#d9c08a',
};

type Node = { type: string; props: Record<string, unknown> & { style?: Record<string, unknown> } };
const el = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}): Node => ({
  type,
  props: { style: { display: 'flex', ...style }, children, ...extra },
});
const text = (value: string, style: Record<string, unknown>) => el('div', style, value);

const tile = (label: string, value: string, max?: string, color = c.fg) =>
  el('div', { flex: 1, flexDirection: 'column', padding: '22px 24px', border: `1px solid ${c.line}`, background: 'rgba(18,18,24,0.85)' }, [
    text(label.toUpperCase(), { fontSize: 15, letterSpacing: 3, color: c.muted, fontFamily: 'Space Grotesk', fontWeight: 500 }),
    el('div', { alignItems: 'baseline', marginTop: 12 }, [
      text(value, { fontSize: 56, fontWeight: 700, color, fontFamily: 'Space Grotesk', letterSpacing: -1.5, lineHeight: 1 }),
      ...(max ? [text(`/ ${max}`, { fontSize: 26, color: c.muted, marginLeft: 8, fontFamily: 'Space Grotesk', fontWeight: 500 })] : []),
    ]),
  ]);

export const GET: APIRoute = async () => {
  const [bold, medium, regular, photo] = await Promise.all([
    font('space-grotesk', 'space-grotesk-latin-700-normal.woff'),
    font('space-grotesk', 'space-grotesk-latin-500-normal.woff'),
    font('inter', 'inter-latin-400-normal.woff'),
    // Mirrored like the site hero, so the fox looks into the card.
    fromRoot('src', 'assets', 'brand', 'rooftop.jpg').then((buf) => sharp(buf).flop().resize(W, H, { fit: 'cover' }).jpeg({ quality: 80 }).toBuffer()),
  ]);

  const rankings = stats.rankings.map((r) => `#${r.rank} in ${r.label}`).join('  ·  ').toUpperCase();
  const asOf = new Date(`${stats.asOf}T12:00:00Z`)
    .toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric' })
    .toUpperCase();
  const recruiting = !game.recruiting ? 'Recruitment closed' : openSeats > 0 ? `Recruiting · ${openSeats} open` : 'Roster full';

  const card = el('div', { width: W, height: H, position: 'relative', background: c.bg, fontFamily: 'Inter', color: c.fg }, [
    el('img', { position: 'absolute', top: 0, left: 0, width: W, height: H, objectFit: 'cover', opacity: 0.8 }, undefined, {
      src: `data:image/jpeg;base64,${photo.toString('base64')}`,
      width: W,
      height: H,
    }),
    el('div', {
      position: 'absolute',
      inset: 0,
      backgroundImage: 'linear-gradient(180deg, rgba(9,9,11,0.2) 0%, rgba(9,9,11,0.55) 38%, rgba(9,9,11,0.97) 62%, #09090b 100%)',
    }),
    el('div', { position: 'absolute', inset: 0, flexDirection: 'column', padding: '44px 56px 40px' }, [
      el('div', { justifyContent: 'space-between', alignItems: 'center' }, [
        text(rankings, { fontSize: 16, letterSpacing: 3.5, color: c.gold, fontFamily: 'Space Grotesk', fontWeight: 700, padding: '10px 16px', border: '1px solid rgba(217,192,138,0.55)' }),
        text(asOf, { fontSize: 16, letterSpacing: 3.5, color: c.fg, fontFamily: 'Space Grotesk', fontWeight: 500, padding: '10px 16px', border: '1px solid rgba(185,164,251,0.5)' }),
      ]),
      el('div', { flex: 1 }),
      el('div', { alignItems: 'baseline' }, [
        text(site.name, { fontSize: 76, fontWeight: 700, fontFamily: 'Space Grotesk', letterSpacing: -2.5, lineHeight: 1 }),
        text(`[${site.shortName}]`, { fontSize: 34, fontWeight: 700, color: c.accent, marginLeft: 18, fontFamily: 'Space Grotesk' }),
      ]),
      el('div', { gap: 12, marginTop: 28 }, [
        tile('Family level', String(stats.level), undefined, c.gold),
        tile('Members', String(stats.members.current), String(stats.members.max)),
        tile('Respect', formatNumber(stats.respect), undefined, c.accentSoft),
        tile('Perk levels', String(stats.perkLevels.current), String(stats.perkLevels.max), c.gold),
      ]),
      el('div', { justifyContent: 'space-between', marginTop: 24, fontSize: 15, letterSpacing: 3, fontFamily: 'Space Grotesk', fontWeight: 500 }, [
        text(`FAMILY XP · TO LEVEL ${stats.level + 1}`, { color: c.muted }),
        el('div', {}, [
          text(formatNumber(stats.xp.current), { color: c.fg }),
          text(` / ${formatNumber(stats.xp.next)}`, { color: c.muted, marginLeft: 6 }),
        ]),
      ]),
      el('div', { height: 10, marginTop: 10, background: '#16151d', border: `1px solid ${c.line}` }, [
        el('div', { width: `${xpPercent}%`, height: '100%', backgroundImage: `linear-gradient(90deg, #4a3e8c, ${c.accent}, ${c.accentSoft})` }),
      ]),
      el('div', { justifyContent: 'space-between', marginTop: 22, fontSize: 15, letterSpacing: 3.5, fontFamily: 'Space Grotesk', fontWeight: 500 }, [
        text(`${site.name} · ${stats.territories} territories held`.toUpperCase(), { color: c.muted }),
        text(recruiting.toUpperCase(), { color: c.accentSoft }),
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
  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
