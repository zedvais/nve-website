import { describe, expect, it } from 'vitest';
import { stats, statsSummary } from '@/data/stats';
import { formatNumber } from '@/lib/format';

describe('statsSummary (link preview text for /stats)', () => {
  it('reads every figure from the stats snapshot', () => {
    expect(statsSummary).toContain(`Lv. ${stats.level}`);
    expect(statsSummary).toContain(`${stats.members.current}/${stats.members.max} members`);
    expect(statsSummary).toContain(`${formatNumber(stats.respect)} respect`);
    expect(statsSummary).toContain(`${stats.territories} territories held`);
    for (const r of stats.rankings) expect(statsSummary).toContain(`#${r.rank} in ${r.label.toLowerCase()}`);
  });

  it('never renders a missing value', () => {
    expect(statsSummary).not.toMatch(/undefined|NaN/);
  });
});
