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

export type MemberTier = 'leadership' | 'council' | 'capos' | 'ranks';

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
    label: 'Boss & Underbosses',
    description: 'Lead the family, set the direction and give the orders in war.',
    variant: 'feature',
  },
  council: {
    label: 'Advisors',
    description: 'Second in command. Advisors coordinate the family and oversee day-to-day operations.',
    variant: 'default',
  },
  capos: {
    label: 'Capos',
    description: 'Our recruiters and coordinators. Capos bring new members in and keep the family organised.',
    variant: 'default',
  },
  ranks: {
    label: 'Soldiers & Associates',
    description: 'The heart of Noctus Volpe.',
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
  player('Sophmadman', 'Capo', 'capos'),
  player('Sitdogeeee', 'Capo', 'capos'),
  player('L4_n13', 'Capo', 'capos'),
  player('LittleSharkSquirt', 'Capo', 'capos'),
  // Soldiers and Associates: add them here, e.g.
  // player('Username', 'Soldier', 'ranks'),
];

export const tierOrder: MemberTier[] = ['leadership', 'council', 'capos', 'ranks'];
export const membersByTier = (tier: MemberTier) => members.filter((m) => m.tier === tier);
