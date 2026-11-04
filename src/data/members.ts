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
  player('Saetsuna', 'Boss', 'leadership'),
  player('Zedvais', 'Underboss', 'leadership'),
  player('Zellacutiepie', 'Underboss', 'leadership'),
  player('Teralament', 'Advisor', 'council'),
  player('Sophmadman', 'Capo', 'council'),
  player('Sitdogeeee', 'Capo', 'council'),
  player('L4_n13', 'Capo', 'council'),
  player('LittleSharkSquirt', 'Capo', 'council'),
  // Soldiers
  player('Konakorner666', 'Soldier', 'ranks'),
  player('girlfrmGirlVille', 'Soldier', 'ranks'),
  player('naraninani', 'Soldier', 'ranks'),
  player('Emanwilqt', 'Soldier', 'ranks'),
  player('iamesoeur', 'Soldier', 'ranks'),
  player('nafismuaz7', 'Soldier', 'ranks'),
  player('Wood2Karam', 'Soldier', 'ranks'),
  // Associates
  player('cookiegirlswirl5555', 'Associate', 'ranks'),
  player('XxCrazyGamer2xxx', 'Associate', 'ranks'),
  player('RanchBoiz', 'Associate', 'ranks'),
  player('R0zentinee', 'Associate', 'ranks'),
  player('fatbol12435', 'Associate', 'ranks'),
  player('Its_Yana2', 'Associate', 'ranks'),
  player('KING03', 'Associate', 'ranks'),
  player('bertsky100', 'Associate', 'ranks'),
  player('Kevinfire_21', 'Associate', 'ranks'),
  player('hunterX2_20', 'Associate', 'ranks'),
  player('wuffy1756', 'Associate', 'ranks'),
  player('valuen1212345', 'Associate', 'ranks'),
  player('Bruhnigol', 'Associate', 'ranks'),
  player('ParrotM0m', 'Associate', 'ranks'),
  player('Naw_Poe', 'Associate', 'ranks'),
  player('tigerqueen200', 'Associate', 'ranks'),
  player('mateusphcn1', 'Associate', 'ranks'),
  player('TrusiMoti', 'Associate', 'ranks'),
];

export const tierOrder: MemberTier[] = ['leadership', 'council', 'ranks'];
export const membersByTier = (tier: MemberTier) => members.filter((m) => m.tier === tier);
