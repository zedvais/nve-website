import { describe, expect, it } from 'vitest';
import { members, membersByTier, rankIndex, rankOrder, sortByRank, tierOrder, tiers } from '@/data/members';
import { stats } from '@/data/stats';

const tierForRole: Record<string, string> = {
  Boss: 'leadership',
  Underboss: 'leadership',
  Advisor: 'council',
  Capo: 'council',
  Soldier: 'ranks',
  Associate: 'ranks',
};

describe('sortByRank', () => {
  it('orders by in-game rank', () => {
    const sorted = sortByRank([{ role: 'Associate' }, { role: 'Boss' }, { role: 'Capo' }, { role: 'Underboss' }]);
    expect(sorted.map((m) => m.role)).toEqual(['Boss', 'Underboss', 'Capo', 'Associate']);
  });

  it('keeps list order within the same rank', () => {
    const list = [
      { role: 'Soldier', name: 'b' },
      { role: 'Associate', name: 'x' },
      { role: 'Soldier', name: 'a' },
    ];
    expect(sortByRank(list).map((m) => m.name)).toEqual(['b', 'a', 'x']);
  });

  it('puts unknown roles last and does not mutate the input', () => {
    const list = [{ role: 'Mystery' }, { role: 'Soldier' }];
    expect(sortByRank(list).map((m) => m.role)).toEqual(['Soldier', 'Mystery']);
    expect(list[0].role).toBe('Mystery');
    expect(rankIndex('Mystery')).toBe(rankOrder.length);
  });
});

describe('roster data', () => {
  it('uses only known ranks, each in its matching group', () => {
    for (const m of members) {
      expect(rankOrder, `${m.name} has unknown role "${m.role}"`).toContain(m.role);
      expect(m.tier, `${m.name} (${m.role}) is in the wrong group`).toBe(tierForRole[m.role]);
    }
  });

  it('has no duplicate Roblox usernames (case-insensitive)', () => {
    const names = members.map((m) => (m.roblox ?? m.name).toLowerCase());
    const dupes = names.filter((n, i) => names.indexOf(n) !== i);
    expect(dupes).toEqual([]);
  });

  it('has exactly one Boss', () => {
    expect(members.filter((m) => m.role === 'Boss')).toHaveLength(1);
  });

  it('does not list more members than the family has', () => {
    expect(members.length).toBeLessThanOrEqual(stats.members.current);
  });

  it('defines every group used and returns groups sorted by rank', () => {
    for (const tier of tierOrder) {
      expect(tiers[tier]).toBeDefined();
      const roles = membersByTier(tier).map((m) => rankIndex(m.role));
      expect(roles).toEqual([...roles].sort((a, b) => a - b));
    }
  });
});
