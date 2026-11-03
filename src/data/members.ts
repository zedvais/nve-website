/**
 * The family roster, grouped by Idle Mafia rank.
 * All entries below are PLACEHOLDERS. Replace them with real members
 * (and remove `placeholder: true`) when ready.
 *
 * Avatars: put images in src/assets/avatars/ and import them here,
 * e.g. `import fox from '@/assets/avatars/fox.png'` then `avatar: fox`.
 * Without an avatar, the card shows the member's initials.
 */
import type { ImageMetadata } from 'astro';

export type MemberTier = 'leadership' | 'council' | 'capos' | 'ranks';

export interface Member {
  /** Display name or Roblox username. */
  name: string;
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
    description: 'Help run the Vault, write the family notice and keep the operation on track.',
    variant: 'default',
  },
  capos: {
    label: 'Capos',
    description: 'Lead by example and keep the crews organised and active.',
    variant: 'default',
  },
  ranks: {
    label: 'Soldiers & Associates',
    description: 'The heart of Noctus Volpe.',
    variant: 'compact',
  },
};

export const members: Member[] = [
  { name: 'Boss Name', role: 'Boss', tier: 'leadership', bio: 'Short introduction for the Boss goes here.', placeholder: true },
  { name: 'Underboss Name', role: 'Underboss', tier: 'leadership', bio: 'Short introduction goes here.', placeholder: true },
  { name: 'Advisor Name', role: 'Advisor', tier: 'council', bio: 'Area of responsibility goes here.', placeholder: true },
  { name: 'Advisor Name', role: 'Advisor', tier: 'council', bio: 'Area of responsibility goes here.', placeholder: true },
  { name: 'Advisor Name', role: 'Advisor', tier: 'council', bio: 'Area of responsibility goes here.', placeholder: true },
  { name: 'Capo Name', role: 'Capo', tier: 'capos', placeholder: true },
  { name: 'Capo Name', role: 'Capo', tier: 'capos', placeholder: true },
  { name: 'Capo Name', role: 'Capo', tier: 'capos', placeholder: true },
  { name: 'Soldier Name', role: 'Soldier', tier: 'ranks', placeholder: true },
  { name: 'Soldier Name', role: 'Soldier', tier: 'ranks', placeholder: true },
  { name: 'Soldier Name', role: 'Soldier', tier: 'ranks', placeholder: true },
  { name: 'Soldier Name', role: 'Soldier', tier: 'ranks', placeholder: true },
  { name: 'Associate Name', role: 'Associate', tier: 'ranks', placeholder: true },
  { name: 'Associate Name', role: 'Associate', tier: 'ranks', placeholder: true },
  { name: 'Associate Name', role: 'Associate', tier: 'ranks', placeholder: true },
  { name: 'Associate Name', role: 'Associate', tier: 'ranks', placeholder: true },
];

export const tierOrder: MemberTier[] = ['leadership', 'council', 'capos', 'ranks'];
export const membersByTier = (tier: MemberTier) => members.filter((m) => m.tier === tier);
