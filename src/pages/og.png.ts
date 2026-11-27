/**
 * /og.png: the site-wide link-preview image (Discord, X, etc.), 1200×630.
 * Rendered at build time from src/data/site.ts, so a rename never leaves a stale
 * name baked into an image. Same look as /stats/og.png: dark surface, hairlines,
 * purple accents; the letters of the tag (N, V, E) are picked out in the name.
 */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { APIRoute } from 'astro';
import satori from 'satori';
import sharp from 'sharp';
import { game, site } from '@/data/site';
import { tagLetters } from '@/lib/tag';

const W = 1200;
const H = 630;
const PAD = 64;

const root = process.cwd();
const fromRoot = (...p: string[]) => readFile(join(root, ...p));
const font = (pkg: string, file: string) => fromRoot('node_modules', '@fontsource', pkg, 'files', file);

/** Site tokens (src/styles/global.css). */
const c = {
  bg: '#09090b',
  fg: '#f3f1ff',
  muted: '#a5a3b8',
  line: '#292735',
  accent: '#8b5cf6',
  accentSoft: '#b9a4fb',
};

type Node = { type: string; props: Record<string, unknown> };
const el = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}): Node => ({
  type,
  props: { style: { display: 'flex', ...style }, children, ...extra },
});
const text = (value: string, style: Record<string, unknown>) => el('div', style, value);
const display = (size: number, weight = 500) => ({ fontFamily: 'Space Grotesk', fontSize: size, fontWeight: weight });
const eyebrow = (value: string, color = c.muted) => text(value.toUpperCase(), { ...display(17, 500), letterSpacing: 4, color });
const png = (buf: Buffer) => `data:image/png;base64,${buf.toString('base64')}`;
const img = (src: string, width: number, height: number, style: Record<string, unknown> = {}) =>
  el('img', { width, height, ...style }, undefined, { src, width, height });

export const GET: APIRoute = async () => {
  const [bold, medium, mark, logo, photo] = await Promise.all([
    font('space-grotesk', 'space-grotesk-latin-700-normal.woff'),
    font('space-grotesk', 'space-grotesk-latin-500-normal.woff'),
    fromRoot('src', 'assets', 'brand', 'nv-mark.png').then((b) => sharp(b).resize({ height: 64 }).png().toBuffer({ resolveWithObject: true })),
    fromRoot('src', 'assets', 'brand', 'nv-logo.png').then((b) => sharp(b).resize({ height: 960 }).png().toBuffer({ resolveWithObject: true })),
    // The rooftop photo, mirrored as on the site and darkened to sit behind the type.
    fromRoot('src', 'assets', 'brand', 'rooftop.jpg').then((b) =>
      sharp(b).flop().resize(W, H, { fit: 'cover' }).modulate({ brightness: 0.55, saturation: 0.8 }).jpeg({ quality: 80 }).toBuffer(),
    ),
  ]);

  const markH = 32;
  const markW = Math.round((mark.info.width / mark.info.height) * markH);
  const logoH = 470;
  const logoW = Math.round((logo.info.width / logo.info.height) * logoH);

  const card = el('div', { width: W, height: H, position: 'relative', background: c.bg, color: c.fg }, [
    el('img', { position: 'absolute', top: 0, left: 0, width: W, height: H }, undefined, { src: `data:image/jpeg;base64,${photo.toString('base64')}`, width: W, height: H }),
    el('div', { position: 'absolute', top: 0, left: 0, width: W, height: H, backgroundImage: 'linear-gradient(90deg, rgba(9,9,11,0.97) 0%, rgba(9,9,11,0.85) 45%, rgba(9,9,11,0.35) 100%)' }),
    el('div', { position: 'absolute', top: 0, left: 0, width: W, height: H, backgroundImage: 'radial-gradient(55% 70% at 85% 45%, rgba(139,92,246,0.28), rgba(139,92,246,0) 70%)' }),
    el('div', { position: 'absolute', top: 0, left: 0, width: W, height: 2, backgroundImage: `linear-gradient(90deg, rgba(139,92,246,0), ${c.accent}, rgba(139,92,246,0))` }),
    img(png(logo.data), logoW, logoH, { position: 'absolute', right: 70, top: (H - logoH) / 2 }),

    el('div', { position: 'absolute', top: 0, left: 0, width: 720, height: H, boxSizing: 'border-box', flexDirection: 'column', padding: `56px ${PAD}px 52px` }, [
      el('div', { alignItems: 'center', gap: 18 }, [img(png(mark.data), markW, markH), eyebrow(`${game.name} family · ${game.platform}`)]),
      el('div', { flex: 1 }),
      el('div', { alignItems: 'baseline' }, tagLetters(site.name, site.shortName).map((l) =>
        text(l.char.toUpperCase(), { ...display(118, 700), letterSpacing: -2, lineHeight: 1, color: l.tag ? c.fg : 'rgba(243,241,255,0.26)' }),
      )),
      el('div', { alignItems: 'center', gap: 16, marginTop: 22 }, [
        text(`[${site.shortName}]`, { ...display(24, 700), letterSpacing: 6, color: c.accentSoft }),
        el('div', { width: 36, height: 1, background: c.line }),
        eyebrow(site.pronunciation),
      ]),
      el('div', { width: 560, height: 1, background: c.line, marginTop: 34 }),
      text(site.tagline, { ...display(28, 500), marginTop: 26 }),
      eyebrow(`${site.shortName} — United as one`, c.muted),
    ]),
  ]);

  const svg = await satori(card as unknown as Parameters<typeof satori>[0], {
    width: W,
    height: H,
    fonts: [
      { name: 'Space Grotesk', data: bold, weight: 700, style: 'normal' },
      { name: 'Space Grotesk', data: medium, weight: 500, style: 'normal' },
    ],
  });
  const out = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
  return new Response(new Uint8Array(out), { headers: { 'Content-Type': 'image/png' } });
};
