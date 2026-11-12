/**
 * The family roster, grouped by Idle Mafia rank.
 *
 * `roblox` is the member's Roblox username. At build time the site fetches
 * their avatar headshot and profile link from Roblox (see src/lib/roblox.ts).
 * If the lookup fails, the card shows the NV mark instead.
 *
 * Optional: `bio` for a short line, `avatar` to override the Roblox headshot
 * with a local image (import it from src/assets/avatars/).
 */
import type { ImageMetadata } from 'astro';

export type MemberTier = 'leadership' | 'council' | 'ranks';

export interface Member {
  /** Name shown on the card. Defaults to the Roblox username. */
  name: string;
  /** Roblox username, used to fetch the avatar and profile link. */
  roblox?: string;
  /** In-game rank: Boss, Underboss, Advisor, Capo, Soldier or Associate. */
  role: string;
  tier: MemberTier;
  bio?: string;
  /** Extra title shown beside the rank, e.g. 'Founder'. */
  title?: string;
  avatar?: ImageMetadata;
  placeholder?: boolean;
}

export const tiers: Record<MemberTier, { label: string; description: string; variant: 'feature' | 'default' | 'compact' }> = {
  leadership: {
    label: 'Leadership',
    description: 'The Boss and Underbosses lead the family, set the direction and give the orders in war.',
    variant: 'feature',
  },
  council: {
    label: 'Capos',
    description: 'Capos are our recruiters and coordinators, keeping the family organised day to day.',
    variant: 'default',
  },
  ranks: {
    label: 'Members',
    description: 'Soldiers and Associates, the heart of Noctus Volpe.',
    variant: 'compact',
  },
};

/** Shorthand: a member whose display name is their Roblox username. */
const player = (roblox: string, role: string, tier: MemberTier, extra: Partial<Member> = {}): Member => ({
  name: roblox,
  roblox,
  role,
  tier,
  ...extra,
});

export const members: Member[] = [
  // Within each group, members are shown by rank, then in the order listed here.
  player('Saetsuna', 'Boss', 'leadership', { title: 'Founder' }),
  player('Zedvais', 'Underboss', 'leadership'),
  player('Zellacutipie', 'Underboss', 'leadership'),
  player('Sitdogeeee', 'Capo', 'council'),
  player('Sophmadman', 'Capo', 'council'),
  // Soldiers (highest respect first, as in-game)
  player('LittleSharkSquirt', 'Soldier', 'ranks'),
  player('pinty8', 'Soldier', 'ranks'),
  player('iamesoeur', 'Soldier', 'ranks'),
  player('Konakorner666', 'Soldier', 'ranks'),
  player('TrusiMoti', 'Soldier', 'ranks'),
  player('WeWazKings', 'Soldier', 'ranks'),
  player('nafismuaz7', 'Soldier', 'ranks'),
  player('Wood2Karam', 'Soldier', 'ranks'),
  player('Kymisuu', 'Soldier', 'ranks'),
  player('naraninani', 'Soldier', 'ranks'),
  player('ghomchiadel', 'Soldier', 'ranks'),
  player('R0zentinee', 'Soldier', 'ranks'),
  player('thebossman19624', 'Soldier', 'ranks'),
  player('Emanwilqt', 'Soldier', 'ranks'),
  player('Tasty00904', 'Soldier', 'ranks'),
  player('naw_kay', 'Soldier', 'ranks'),
  player('Kaelthren', 'Soldier', 'ranks'),
  player('WillieJr0101', 'Soldier', 'ranks'),
  player('Coolaaron122499', 'Soldier', 'ranks'),
  // Associates
  player('tjgamerforeal', 'Associate', 'ranks'),
  player('mateusphcn1', 'Associate', 'ranks'),
  player('MooS4yt0', 'Associate', 'ranks'),
  player('Notkai123456788', 'Associate', 'ranks'),
  player('tigerqueen200', 'Associate', 'ranks'),
  player('cookiegirlswirl5555', 'Associate', 'ranks'),
  player('Rani2009kis', 'Associate', 'ranks'),
  player('insaneity_wolf01', 'Associate', 'ranks'),
  player('valuen1212345', 'Associate', 'ranks'),
  player('sengkadiw', 'Associate', 'ranks'),
  player('ParrotM0m', 'Associate', 'ranks'),
  player('Shchteven', 'Associate', 'ranks'),
  player('LGSbr1', 'Associate', 'ranks'),
  player('RanchBoiz', 'Associate', 'ranks'),
  player('David4ikop', 'Associate', 'ranks'),
  player('XxCrazyGamer2xxx', 'Associate', 'ranks'),
  player('JagJagodagxxxuio', 'Associate', 'ranks'),
  player('Deathswhisper0', 'Associate', 'ranks'),
  player('wuffy1756', 'Associate', 'ranks'),
  player('zelliscute9', 'Associate', 'ranks'),
  player('KapitanBatory', 'Associate', 'ranks'),
  player('crazygillian1', 'Associate', 'ranks'),
  player('Naw_Poe', 'Associate', 'ranks'),
  player('KLNG03', 'Associate', 'ranks'),
  player('hunterX2_20', 'Associate', 'ranks'),
];

export const tierOrder: MemberTier[] = ['leadership', 'council', 'ranks'];
/** In-game ranks from highest to lowest. Unknown roles sort last. */
export const rankOrder = ['Boss', 'Underboss', 'Advisor', 'Capo', 'Soldier', 'Associate'] as const;
export const rankIndex = (role: string): number => {
  const i = (rankOrder as readonly string[]).indexOf(role);
  return i === -1 ? rankOrder.length : i;
};

/** Sorts by rank, keeping the original list order within a rank (Array.sort is stable). */
export const sortByRank = <T extends Pick<Member, 'role'>>(list: T[]): T[] =>
  [...list].sort((a, b) => rankIndex(a.role) - rankIndex(b.role));

/** Members of one group, sorted by rank (list order is kept within a rank). */
export const membersByTier = (tier: MemberTier) => sortByRank(members.filter((m) => m.tier === tier));
