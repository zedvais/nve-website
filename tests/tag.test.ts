import { describe, expect, it } from 'vitest';
import { tagLetters } from '@/lib/tag';
import { site } from '@/data/site';

const picked = (name: string, tag: string) =>
  tagLetters(name, tag)
    .filter((l) => l.tag)
    .map((l) => l.char)
    .join('');

describe('tagLetters', () => {
  it('reads Navierre as N-aV-ierrE', () => {
    const letters = tagLetters('Navierre', 'NVE');
    expect(letters.map((l) => (l.tag ? l.char.toUpperCase() : l.char.toLowerCase())).join('')).toBe('NaVierrE');
  });

  it('spells the site tag out of the site name', () => {
    expect(picked(site.name, site.shortName).toUpperCase()).toBe(site.shortName.toUpperCase());
  });

  it('marks nothing when the tag cannot be spelled', () => {
    expect(picked('Vionne', 'NVE')).toBe('');
  });
});
