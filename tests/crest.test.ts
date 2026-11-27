import { describe, expect, it } from 'vitest';
import { crestSvg } from '@/lib/crest';

describe('crestSvg', () => {
  it('draws the ringed monogram with a gold gradient scoped to its id', () => {
    const svg = crestSvg({ id: 'a' });
    expect(svg.startsWith('<svg')).toBe(true);
    expect(svg).toContain('id="a-gold"');
    expect(svg).toContain('url(#a-gold)');
    expect(svg).toContain('<circle');
    expect(svg).toContain('aria-hidden="true"');
  });

  it('keeps ids unique between instances', () => {
    expect(crestSvg({ id: 'one' })).not.toContain('two-gold');
    expect(crestSvg({ id: 'two' })).toContain('two-gold');
  });

  it('draws just the N for tight spaces', () => {
    const svg = crestSvg({ variant: 'mark' });
    expect(svg).not.toContain('<circle');
    expect(svg).toContain('viewBox="-4 -4 88 108"');
  });

  it('adds animation hooks only when asked', () => {
    expect(crestSvg()).not.toContain('crest-letter');
    const svg = crestSvg({ animated: true });
    expect(svg).toContain('class="crest-letter"');
    expect(svg).toContain('pathLength="1"');
  });

  it('can be a labelled image and use a solid colour', () => {
    const svg = crestSvg({ title: 'The Navierre crest', color: 'currentColor' });
    expect(svg).toContain('role="img"');
    expect(svg).toContain('<title>The Navierre crest</title>');
    expect(svg).not.toContain('linearGradient');
    expect(svg).toContain('fill="currentColor"');
    expect(svg).toContain('fill-opacity=".62"'); // the shaded faces still read in one colour
  });

  it('uses no text, so it renders the same without web fonts', () => {
    expect(crestSvg()).not.toContain('<text');
  });
});
