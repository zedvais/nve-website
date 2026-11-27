/**
 * /og.png: the site-wide link-preview image (Discord, X, etc.), 1200×630.
 * Rendered at build time from src/data/site.ts, so a rename never leaves a stale
 * name baked into an image. Same look as /stats/og.png: lacquer black, antique gold,
 * the crest; the letters of the tag (N, V, E) are picked out in gold.
 */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { APIRoute } from 'astro';
import satori from 'satori';
import sharp from 'sharp';
import { game, site } from '@/data/site';
import { tagLetters } from '@/lib/tag';
import { crestSvg } from '@/lib/crest';

const W = 1200;
const H = 630;
const PAD = 64;

const root = process.cwd();
const fromRoot = (...p: string[]) => readFile(join(root, ...p));
const font = (pkg: string, file: string) => fromRoot('node_modules', '@fontsource', pkg, 'files', file);

/** Site tokens (src/styles/global.css). */
const c = {
  bg: '#0b0a08',
  fg: '#f3ead6',
  muted: '#a69c87',
  line: '#2b261d',
  accent: '#c9a45c',
  accentSoft: '#e6cd8c',
};

type Node = { type: string; props: Record<string, unknown> };
const el = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}): Node => ({
  type,
  props: { style: { display: 'flex', ...style }, children, ...extra },
});
const text = (value: string, style: Record<string, unknown>) => el('div', style, value);
const display = (size: number, weight = 500) => ({ fontFamily: 'Cinzel', fontSize: size, fontWeight: weight });
const serif = (size: number, fontStyle = 'normal') => ({ fontFamily: 'Cormorant Garamond', fontSize: size, fontWeight: 500, fontStyle });
const eyebrow = (value: string, color = c.muted) => text(value.toUpperCase(), { ...display(17, 500), letterSpacing: 4, color });
const png = (buf: Buffer) => `data:image/png;base64,${buf.toString('base64')}`;
const img = (src: string, width: number, height: number, style: Record<string, unknown> = {}) =>
  el('img', { width, height, ...style }, undefined, { src, width, height });

/** Deco sunburst fanning up from below the crest. */
const sunburst = (() => {
  const cx = 930;
  const cy = H + 40;
  const rays: string[] = [];
  for (let i = 0; i <= 30; i++) {
    const a = Math.PI + (Math.PI * i) / 30;
    rays.push(`<path d="M${cx} ${cy}L${(cx + Math.cos(a) * 1200).toFixed(1)} ${(cy + Math.sin(a) * 1200).toFixed(1)}" stroke-width="${i % 4 === 0 ? 1.4 : 0.7}"/>`);
  }
  const arcs = [260, 300, 560].map((r) => `<circle cx="${cx}" cy="${cy}" r="${r}"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><radialGradient id="f" cx="${cx}" cy="${cy}" r="900" gradientUnits="userSpaceOnUse"><stop offset="0.2" stop-color="#c9a45c" stop-opacity="0.4"/><stop offset="1" stop-color="#c9a45c" stop-opacity="0"/></radialGradient></defs><g stroke="url(#f)" fill="none">${rays.join('')}${arcs}</g></svg>`;
})();

export const GET: APIRoute = async () => {
  const [cinzel, cinzelBold, serifMedium, serifItalic, crest] = await Promise.all([
    font('cinzel', 'cinzel-latin-500-normal.woff'),
    font('cinzel', 'cinzel-latin-700-normal.woff'),
    font('cormorant-garamond', 'cormorant-garamond-latin-500-normal.woff'),
    font('cormorant-garamond', 'cormorant-garamond-latin-500-italic.woff'),
    sharp(Buffer.from(crestSvg())).resize({ height: 880 }).png().toBuffer({ resolveWithObject: true }),
  ]);
  const crestH = 440;
  const crestW = Math.round((crest.info.width / crest.info.height) * crestH);

  const card = el('div', { width: W, height: H, position: 'relative', background: c.bg, color: c.fg }, [
    el('div', { position: 'absolute', top: 0, left: 0, width: W, height: H, backgroundImage: 'radial-gradient(45% 65% at 78% 55%, rgba(201,164,92,0.16), rgba(201,164,92,0) 70%)' }),
    img(`data:image/svg+xml;base64,${Buffer.from(sunburst).toString('base64')}`, W, H, { position: 'absolute', top: 0, left: 0 }),
    el('div', { position: 'absolute', top: 18, left: 18, width: W - 36, height: H - 36, border: `1px solid ${c.line}` }),
    el('div', { position: 'absolute', top: 24, left: 24, width: W - 48, height: H - 48, border: '1px solid rgba(201,164,92,0.22)' }),
    img(png(crest.data), crestW, crestH, { position: 'absolute', right: 120, top: (H - crestH) / 2 }),

    el('div', { position: 'absolute', top: 0, left: 0, width: 720, height: H, boxSizing: 'border-box', flexDirection: 'column', padding: `64px ${PAD + 8}px 60px` }, [
      el('div', { alignItems: 'center', gap: 14 }, [
        el('div', { width: 9, height: 9, background: c.accent, transform: 'rotate(45deg)' }),
        eyebrow(`${game.name} family · ${game.platform}`),
      ]),
      el('div', { flex: 1 }),
      text(site.house, { ...serif(40, 'italic'), color: c.muted }),
      el('div', { alignItems: 'baseline', marginTop: 6 }, tagLetters(site.name, site.shortName).map((l) =>
        text(l.char.toUpperCase(), { ...display(92, 500), letterSpacing: 10, lineHeight: 1.1, color: l.tag ? c.accent : c.fg }),
      )),
      el('div', { alignItems: 'center', gap: 16, marginTop: 20 }, [
        text(site.shortName, { ...display(22, 700), letterSpacing: 8, color: c.accentSoft }),
        el('div', { width: 7, height: 7, background: c.accent, transform: 'rotate(45deg)' }),
        eyebrow(`${site.pronunciation} · Est. ${site.established}`),
      ]),
      el('div', { width: 520, height: 1, background: c.line, marginTop: 34 }),
      text(site.tagline, { ...serif(34, 'italic'), marginTop: 24, color: c.fg }),
    ]),
  ]);

  const svg = await satori(card as unknown as Parameters<typeof satori>[0], {
    width: W,
    height: H,
    fonts: [
      { name: 'Cinzel', data: cinzel, weight: 500, style: 'normal' },
      { name: 'Cinzel', data: cinzelBold, weight: 700, style: 'normal' },
      { name: 'Cormorant Garamond', data: serifMedium, weight: 500, style: 'normal' },
      { name: 'Cormorant Garamond', data: serifItalic, weight: 500, style: 'italic' },
    ],
  });
  const out = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
  return new Response(new Uint8Array(out), { headers: { 'Content-Type': 'image/png' } });
};
