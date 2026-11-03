/**
 * The family roster.
 * All entries below are PLACEHOLDERS. Replace them with real members
 * (and set `placeholder: false` or remove the field) when ready.
 *
 * Avatars: put images in src/assets/avatars/ and import them here,
 * e.g. `import fox from '@/assets/avatars/fox.png'` then `avatar: fox`.
 * Without an avatar, the card shows the member's initials.
 */
import type { ImageMetadata } from 'astro';

export type MemberTier = 'leadership' | 'staff' | 'member';

export interface Member {
  name: string;
  role: string;
  tier: MemberTier;
  bio?: string;
  avatar?: ImageMetadata;
  placeholder?: boolean;
}

export const tiers: Record<MemberTier, { label: string; description: string }> = {
  leadership: {
    label: 'Family Leadership',
    description: 'Sets the direction and keeps the family true to its values.',
  },
  staff: {
    label: 'Staff & Officers',
    description: 'Organise activities, welcome new members and keep things running.',
  },
  member: {
    label: 'Members',
    description: 'The heart of Noctus Volpe.',
  },
};

export const members: Member[] = [
  {
    name: 'Leader Name',
    role: 'Family Leader',
    tier: 'leadership',
    bio: 'Short introduction for the family leader goes here.',
    placeholder: true,
  },
  {
    name: 'Co-Leader Name',
    role: 'Co-Leader',
    tier: 'leadership',
    bio: 'Short introduction for the co-leader goes here.',
    placeholder: true,
  },
  { name: 'Officer Name', role: 'Officer', tier: 'staff', bio: 'Area of responsibility goes here.', placeholder: true },
  { name: 'Officer Name', role: 'Officer', tier: 'staff', bio: 'Area of responsibility goes here.', placeholder: true },
  { name: 'Officer Name', role: 'Recruitment Officer', tier: 'staff', bio: 'Area of responsibility goes here.', placeholder: true },
  { name: 'Member Name', role: 'Member', tier: 'member', placeholder: true },
  { name: 'Member Name', role: 'Member', tier: 'member', placeholder: true },
  { name: 'Member Name', role: 'Member', tier: 'member', placeholder: true },
  { name: 'Member Name', role: 'Member', tier: 'member', placeholder: true },
  { name: 'Member Name', role: 'Member', tier: 'member', placeholder: true },
  { name: 'Member Name', role: 'Member', tier: 'member', placeholder: true },
  { name: 'Member Name', role: 'Member', tier: 'member', placeholder: true },
  { name: 'Member Name', role: 'Member', tier: 'member', placeholder: true },
];

export const membersByTier = (tier: MemberTier) => members.filter((m) => m.tier === tier);
