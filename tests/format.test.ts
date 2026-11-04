import { describe, expect, it } from 'vitest';
import { formatDate, formatNumber, percentOf, seatsLeft } from '@/lib/format';

describe('formatDate', () => {
  it('formats ISO dates in en-US without time-zone drift', () => {
    expect(formatDate('2026-09-29', { month: 'long', day: 'numeric', year: 'numeric' })).toBe('September 29, 2026');
    expect(formatDate('2026-09-29', { month: 'short', year: 'numeric' })).toBe('Sep 2026');
    // The first of the month must not slip back a day in western time zones.
    expect(formatDate('2026-11-01', { month: 'short', day: 'numeric' })).toBe('Nov 1');
  });
});

describe('formatNumber', () => {
  it('adds thousands separators', () => {
    expect(formatNumber(1970)).toBe('1,970');
    expect(formatNumber(2_689_174)).toBe('2,689,174');
    expect(formatNumber(0)).toBe('0');
  });
});

describe('percentOf', () => {
  it('rounds to one decimal', () => {
    expect(percentOf(2_039_828, 2_689_174)).toBe(75.9);
  });
  it('clamps to 0–100 and survives a zero total', () => {
    expect(percentOf(150, 100)).toBe(100);
    expect(percentOf(-5, 100)).toBe(0);
    expect(percentOf(5, 0)).toBe(0);
  });
});

describe('seatsLeft', () => {
  it('never goes negative', () => {
    expect(seatsLeft(44, 50)).toBe(6);
    expect(seatsLeft(50, 50)).toBe(0);
    expect(seatsLeft(52, 50)).toBe(0);
  });
});
