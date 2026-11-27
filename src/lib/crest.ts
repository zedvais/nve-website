/**
 * The Navierre monogram: a geometric art-deco N inside a fine double ring,
 * with a faint sunburst behind the letter. Original artwork, drawn entirely
 * from paths (no fonts), so the same SVG renders on the site, in favicons and
 * in the build-time link-preview images. Bold enough to read at icon size.
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

/**
 * Geometric N: two slim stems and a heavy diagonal, squared off like 1920s
 * signage. The diagonal carries a hairline inline, cut in the background colour.
 */
const N_STEMS = 'M40 32H44.5V88H40ZM75.5 32H80V88H75.5Z';
const N_DIAGONAL = 'M40 32H50L80 88H70Z';
const N_INLINE = 'M46.6 36.5 73.4 83.5';

export function crestSvg(opts: CrestOptions = {}): string {
  const { id = 'crest', variant = 'full', color, className = '', title, animated = false } = opts;
  const paint = color ?? `url(#${id}-gold)`;
  const cls = (name: string) => (animated ? ` class="${name}"` : '');
  const draw = animated ? ' pathLength="1"' : '';
  const defs = color
    ? ''
    : `<defs><linearGradient id="${id}-gold" gradientUnits="userSpaceOnUse" x1="20" y1="8" x2="100" y2="112">` +
      '<stop offset="0" stop-color="#f3e1a8"/><stop offset=".45" stop-color="#c9a45c"/>' +
      '<stop offset=".72" stop-color="#e6cd8c"/><stop offset="1" stop-color="#9c7a3c"/></linearGradient></defs>';

  const letter =
    `<g${cls('crest-letter')}>` +
    `<path d="${N_STEMS}" fill="${paint}"/><path d="${N_DIAGONAL}" fill="${paint}"/>` +
    `<path d="${N_INLINE}" stroke="var(--crest-bg,#0b0a08)" stroke-width="1.1" stroke-linecap="round"/>` +
    `</g>`;

  let body: string;
  let viewBox: string;
  if (variant === 'mark') {
    viewBox = '36 28 48 64';
    body = letter;
  } else {
    viewBox = '0 0 120 120';
    // Fine rays fanning up from the foot of the letter, clipped to the inner ring.
    const rays = Array.from({ length: 11 }, (_, i) => {
      const a = ((-75 + i * 15) * Math.PI) / 180;
      return `M${r2(60 + Math.sin(a) * 18)} ${r2(102 - Math.cos(a) * 18)}L${r2(60 + Math.sin(a) * 64)} ${r2(102 - Math.cos(a) * 64)}`;
    }).join('');
    body =
      `<clipPath id="${id}-clip"><circle cx="60" cy="60" r="50"/></clipPath>` +
      `<g clip-path="url(#${id}-clip)" stroke="${paint}" stroke-width=".45" stroke-opacity=".38"${cls('crest-rays')}><path d="${rays}"/></g>` +
      `<g fill="none" stroke="${paint}">` +
      `<circle cx="60" cy="60" r="56" stroke-width="2" transform="rotate(-90 60 60)"${draw}${cls('crest-draw')}/>` +
      `<circle cx="60" cy="60" r="51.5" stroke-width=".7" transform="rotate(90 60 60)"${draw}${cls('crest-draw crest-draw-late')}/>` +
      `</g>` +
      // diamonds at the poles of the ring
      `<g fill="${paint}"${cls('crest-pips')}><path d="M60 0.5 63.5 4 60 7.5 56.5 4Z"/><path d="M60 112.5 63.5 116 60 119.5 56.5 116Z"/></g>` +
      letter;
  }

  const a11y = title ? `role="img" aria-label="${title}"><title>${title}</title` : 'aria-hidden="true" focusable="false"';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" class="${className}" ${a11y}>${defs}${body}</svg>`;
}
