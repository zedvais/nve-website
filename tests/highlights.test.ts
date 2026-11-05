import { describe, expect, it } from 'vitest';
import { highlights } from '@/data/highlights';
import { stats } from '@/data/stats';

const byIcon = (icon: string) => highlights.find((h) => h.icon === icon)!;

describe('highlights', () => {
  it('reads its figures from the stats snapshot', () => {
    expect(byIcon('progression').metric?.value).toBe(`Lv. ${stats.level}`);
    expect(byIcon('vault').metric?.value).toBe(`${stats.perkLevels.current} / ${stats.perkLevels.max}`);
    expect(byIcon('war').metric?.value).toBe(`${stats.wars.won}–${stats.wars.lost}`);
  });

  it('never renders a missing ranking', () => {
    for (const h of highlights) {
      expect(`${h.title} ${h.description} ${h.metric?.value ?? ''}`).not.toMatch(/undefined|NaN/);
    }
  });
});
