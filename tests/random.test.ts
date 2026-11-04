import { describe, expect, it } from 'vitest';
import { seededRandom } from '@/lib/random';

describe('seededRandom', () => {
  it('returns the same sequence for the same seed', () => {
    const a = seededRandom(42);
    const b = seededRandom(42);
    expect(Array.from({ length: 5 }, a)).toEqual(Array.from({ length: 5 }, b));
  });

  it('returns different sequences for different seeds', () => {
    expect(seededRandom(1)()).not.toEqual(seededRandom(2)());
  });

  it('stays within [0, 1)', () => {
    const rand = seededRandom(7);
    for (let i = 0; i < 10_000; i++) {
      const n = rand();
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThan(1);
    }
  });

  it('matches the Park–Miller reference values', () => {
    // First output for seed 1 is 16807 / (2^31 - 1), shifted by the (s - 1) / (m - 1) mapping.
    expect(seededRandom(1)()).toBeCloseTo((16807 - 1) / 2147483646, 12);
  });

  it('handles zero, negative and fractional seeds without getting stuck', () => {
    for (const seed of [0, -5, 3.7]) {
      const rand = seededRandom(seed);
      expect(rand()).not.toEqual(rand());
    }
  });
});
