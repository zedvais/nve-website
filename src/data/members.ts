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
  /** In-game respect, shown on the card and used for sorting. */
  respect?: number;
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
    label: 'Advisors',
    description: 'Advisors are second in command, coordinating and overseeing the family. Capos are our recruiters and coordinators.',
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
  // Respect as of the in-game roster on 2026-11-04. Groups sort by rank, then respect.
  player('Saetsuna', 'Boss', 'leadership', { respect: 11_014, title: 'Founder' }),
  player('Zedvais', 'Underboss', 'leadership', { respect: 10_792 }),
  player('Zellacutiepie', 'Underboss', 'leadership', { respect: 10_963 }),
  player('Teralament', 'Advisor', 'council', { respect: 13_224 }),
  player('LittleSharkSquirt', 'Capo', 'council', { respect: 11_755 }),
  player('L4_n13', 'Capo', 'council', { respect: 8_386 }),
  player('Sitdogeeee', 'Capo', 'council', { respect: 8_001 }),
  player('Sophmadman', 'Capo', 'council', { respect: 7_286 }),
  // Soldiers
  player('pinty8', 'Soldier', 'ranks', { respect: 10_151 }),
  player('nafismuaz7', 'Soldier', 'ranks', { respect: 8_299 }),
  player('Konakorner666', 'Soldier', 'ranks', { respect: 8_248 }),
  player('Tasty00904', 'Soldier', 'ranks', { respect: 7_739 }),
  player('Kymisuu', 'Soldier', 'ranks', { respect: 7_620 }),
  player('ghomchiadel', 'Soldier', 'ranks', { respect: 7_433 }),
  player('iamesoeur', 'Soldier', 'ranks', { respect: 7_230 }),
  player('WeWazKings', 'Soldier', 'ranks', { respect: 6_497 }),
  player('thebossman19624', 'Soldier', 'ranks', { respect: 6_306 }),
  player('Emanwilqt', 'Soldier', 'ranks', { respect: 5_826 }),
  player('llIIIIlllIlIlIlIll', 'Soldier', 'ranks', { respect: 5_518 }),
  player('naraninani', 'Soldier', 'ranks', { respect: 5_493 }),
  player('naw_kay', 'Soldier', 'ranks', { respect: 5_254 }),
  player('Wood2Karam', 'Soldier', 'ranks', { respect: 4_341 }),
  player('girlfrmGirlVille', 'Soldier', 'ranks', { respect: 3_679 }),
  player('Kaelthren', 'Soldier', 'ranks', { respect: 2_911 }),
  player('WillieJr0101', 'Soldier', 'ranks', { respect: 2_699 }),
  player('Coolaaron122499', 'Soldier', 'ranks', { respect: 2_519 }),
  // Associates
  player('TrusiMoti', 'Associate', 'ranks', { respect: 8_463 }),
  player('cookiegirlswirl5555', 'Associate', 'ranks', { respect: 7_703 }),
  player('mateusphcn1', 'Associate', 'ranks', { respect: 7_668 }),
  player('tigerqueen200', 'Associate', 'ranks', { respect: 7_375 }),
  player('R0zentinee', 'Associate', 'ranks', { respect: 7_248 }),
  player('fatbol12435', 'Associate', 'ranks', { respect: 5_870 }),
  player('Kevinfire_21', 'Associate', 'ranks', { respect: 5_505 }),
  player('ParrotM0m', 'Associate', 'ranks', { respect: 4_840 }),
  player('valuen1212345', 'Associate', 'ranks', { respect: 4_785 }),
  player('XxCrazyGamer2xxx', 'Associate', 'ranks', { respect: 4_608 }),
  player('bertsky100', 'Associate', 'ranks', { respect: 4_460 }),
  player('RanchBoiz', 'Associate', 'ranks', { respect: 4_126 }),
  player('Its_Yana2', 'Associate', 'ranks', { respect: 3_936 }),
  player('wuffy1756', 'Associate', 'ranks', { respect: 2_484 }),
  player('Bruhnigol', 'Associate', 'ranks', { respect: 2_426 }),
  player('hunterX2_20', 'Associate', 'ranks', { respect: 1_762 }),
  player('KING03', 'Associate', 'ranks', { respect: 1_556 }),
  player('Naw_Poe', 'Associate', 'ranks', { respect: 1_451 }),
];

export const tierOrder: MemberTier[] = ['leadership', 'council', 'ranks'];
const rankOrder = ['Boss', 'Underboss', 'Advisor', 'Capo', 'Soldier', 'Associate'];
const rankIndex = (role: string) => (rankOrder.indexOf(role) + 1 || rankOrder.length + 1);

/** Members of one group, sorted by rank and then by respect (highest first). */
export const membersByTier = (tier: MemberTier) =>
  members
    .filter((m) => m.tier === tier)
    .sort((a, b) => rankIndex(a.role) - rankIndex(b.role) || (b.respect ?? 0) - (a.respect ?? 0));
