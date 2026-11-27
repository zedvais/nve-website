/**
 * The Navierre monogram: a sharp, chiselled N inside a fine double ring with a
 * watch-bezel of ticks, deco wings and a low sunrise of rays behind the letter.
 * Original artwork, drawn entirely from paths (no fonts), so the same SVG
 * renders on the site, in favicons and in the build-time link-preview images.
 * Bold enough to read at icon size.
 */

export interface CrestOptions {
  /** Prefix for gradient ids, so several monograms can share a page. */
  id?: string;
  /** 'full' = ring, rays and N; 'mark' = the N alone (tight spaces). */
  variant?: 'full' | 'mark';
  /** Solid colour instead of the antique-gold gradient (e.g. 'currentColor'). */
  color?: string;
  /** Extra classes for the root <svg>. */
  className?: string;
  /** Accessible title. Omit for a decorative monogram. */
  title?: string;
  /**
   * Adds hooks for the draw-in (see .crest-* in global.css): the rings draw
   * themselves, the rays fan out, then the N is struck.
   */
  animated?: boolean;
}

const r2 = (n: number) => Math.round(n * 100) / 100;

type Pt = [number, number];

/**
 * A sharp, chiselled N after the family's original mark: the left stem and the
 * diagonal are one blade meeting in a point at the top, the right stem stands
 * apart behind a hairline gap, and two small blades echo the diagonal. Each
 * blade is split along its ridge into a lit face and a shaded face, so the gold
 * reads as cut metal. Drawn on an 80 × 100 grid.
 */
const N_FACES: { lit: Pt[]; shade: Pt[] }[] = [
  // left stem + diagonal
  {
    lit: [[0, 0], [16, 0], [65, 61.5], [65, 73.5], [6.5, 10], [6.5, 93], [0, 100]],
    shade: [[6.5, 10], [65, 73.5], [65, 85.5], [13, 20], [13, 86], [6.5, 93]],
  },
  // right stem, cut to a point at the top
  {
    lit: [[69, 11], [74.5, 5.5], [74.5, 100], [69, 100]],
    shade: [[74.5, 5.5], [80, 0], [80, 100], [74.5, 100]],
  },
  // blade under the diagonal
  {
    lit: [[18, 33], [30, 48], [30, 57], [18, 42]],
    shade: [[18, 42], [30, 57], [30, 66], [18, 51]],
  },
  // blade over the diagonal
  {
    lit: [[50, 18], [62, 33], [62, 42], [50, 27]],
    shade: [[50, 27], [62, 42], [62, 51], [50, 36]],
  },
];

const poly = (pts: Pt[], scale: number, dx: number, dy: number) =>
  'M' + pts.map(([x, y]) => `${r2(dx + x * scale)} ${r2(dy + y * scale)}`).join('L') + 'Z';

export function crestSvg(opts: CrestOptions = {}): string {
  const { id = 'crest', variant = 'full', color, className = '', title, animated = false } = opts;
  const paint = color ?? `url(#${id}-gold)`;
  const cls = (name: string) => (animated ? ` class="${name}"` : '');
  const draw = animated ? ' pathLength="1"' : '';
  const lit = color ?? `url(#${id}-lit)`;
  const shade = color ?? `url(#${id}-shade)`;
  const defs = color
    ? ''
    : `<defs><linearGradient id="${id}-gold" gradientUnits="userSpaceOnUse" x1="20" y1="8" x2="100" y2="112">` +
      '<stop offset="0" stop-color="#f3e1a8"/><stop offset=".45" stop-color="#c9a45c"/>' +
      '<stop offset=".72" stop-color="#e6cd8c"/><stop offset="1" stop-color="#9c7a3c"/></linearGradient>' +
      `<linearGradient id="${id}-lit" gradientUnits="userSpaceOnUse" x1="30" y1="25" x2="90" y2="95">` +
      '<stop offset="0" stop-color="#fbeec4"/><stop offset=".55" stop-color="#e2c27a"/><stop offset="1" stop-color="#c9a45c"/></linearGradient>' +
      `<linearGradient id="${id}-shade" gradientUnits="userSpaceOnUse" x1="30" y1="25" x2="90" y2="95">` +
      '<stop offset="0" stop-color="#b8924c"/><stop offset=".6" stop-color="#8e6d33"/><stop offset="1" stop-color="#6e5226"/></linearGradient>' +
      '</defs>';

  /** The N at a given scale and offset (its grid is 80 × 100). */
  const letterAt = (scale: number, dx: number, dy: number) =>
    `<g${cls('crest-letter')}>` +
    `<path d="${N_FACES.map((f) => poly(f.lit, scale, dx, dy)).join('')}" fill="${lit}"/>` +
    `<path d="${N_FACES.map((f) => poly(f.shade, scale, dx, dy)).join('')}" fill="${shade}"${color ? ' fill-opacity=".62"' : ''}/>` +
    `</g>`;

  let body: string;
  let viewBox: string;
  if (variant === 'mark') {
    viewBox = '-4 -4 88 108';
    body = letterAt(1, 0, 0);
  } else {
    viewBox = '0 0 120 120';
    // A low sunrise of fine rays beneath the letter, clipped to the inner ring.
    const rays = Array.from({ length: 9 }, (_, i) => {
      const a = ((-60 + i * 15) * Math.PI) / 180;
      return `M${r2(60 + Math.sin(a) * 24)} ${r2(112 - Math.cos(a) * 24)}L${r2(60 + Math.sin(a) * 44)} ${r2(112 - Math.cos(a) * 44)}`;
    }).join('');
    // Watch-bezel ticks between the two rings: fine, with a longer one every 15°.
    const ticks = Array.from({ length: 72 }, (_, i) => {
      if (i % 18 === 0) return ''; // leave room for the diamonds at the poles and sides
      const a = (i * 5 * Math.PI) / 180;
      const r1 = 52.6;
      const rOut = i % 3 === 0 ? 55 : 54.1;
      return `M${r2(60 + Math.cos(a) * r1)} ${r2(60 + Math.sin(a) * r1)}L${r2(60 + Math.cos(a) * rOut)} ${r2(60 + Math.sin(a) * rOut)}`;
    }).join('');
    // Stepped deco bars either side of the letter, at its waist.
    const bars = 'M20 56H34M11.5 60H34M20 64H34' + 'M86 56H100M86 60H108.5M86 64H100';
    body =
      `<clipPath id="${id}-clip"><circle cx="60" cy="60" r="50"/></clipPath>` +
      `<g clip-path="url(#${id}-clip)" stroke="${paint}" stroke-width=".45" stroke-opacity=".38"${cls('crest-rays')}><path d="${rays}"/></g>` +
      `<g fill="none" stroke="${paint}">` +
      `<circle cx="60" cy="60" r="56" stroke-width="2" transform="rotate(-90 60 60)"${draw}${cls('crest-draw')}/>` +
      `<circle cx="60" cy="60" r="51.5" stroke-width=".7" transform="rotate(90 60 60)"${draw}${cls('crest-draw crest-draw-late')}/>` +
      `</g>` +
      `<path d="${ticks}" stroke="${paint}" stroke-width=".55"${cls('crest-ticks')}/>` +
      `<path d="${bars}" stroke="${paint}" stroke-width=".9" stroke-linecap="square"${cls('crest-bars')}/>` +
      // diamonds at the four points of the ring
      `<g fill="${paint}"${cls('crest-pips')}>` +
      '<path d="M60 0.5 63.5 4 60 7.5 56.5 4Z"/><path d="M60 112.5 63.5 116 60 119.5 56.5 116Z"/>' +
      '<path d="M0.5 60 4 56.5 7.5 60 4 63.5Z"/><path d="M112.5 60 116 56.5 119.5 60 116 63.5Z"/>' +
      '</g>' +
      // 0.56 scale: 45 × 56, centred in the ring
      letterAt(0.56, 37.6, 32);
  }

  const a11y = title ? `role="img" aria-label="${title}"><title>${title}</title` : 'aria-hidden="true" focusable="false"';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" class="${className}" ${a11y}>${defs}${body}</svg>`;
}
