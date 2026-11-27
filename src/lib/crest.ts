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
/** Hairline inlines down the stems, so the whole letter reads as engraved. */
const N_STEM_INLINES = 'M42.25 35.5V84.5M77.75 35.5V84.5';

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
    (variant === 'full' ? `<path d="${N_STEM_INLINES}" stroke="var(--crest-bg,#0b0a08)" stroke-width=".7" stroke-linecap="round"/>` : '') +
    `</g>`;

  let body: string;
  let viewBox: string;
  if (variant === 'mark') {
    viewBox = '36 28 48 64';
    body = letter;
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
      letter;
  }

  const a11y = title ? `role="img" aria-label="${title}"><title>${title}</title` : 'aria-hidden="true" focusable="false"';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" class="${className}" ${a11y}>${defs}${body}</svg>`;
}
