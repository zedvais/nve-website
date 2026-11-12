/**
 * Family stats snapshot from Idle Mafia.
 * Update these numbers from the in-game Family overview and bump `asOf`.
 * Everything derived from them (open seats, XP progress, the Journey highlights)
 * is calculated, so only the raw values need editing.
 */
import { formatDate, formatNumber, percentOf, seatsLeft } from '@/lib/format';

export type PerkTier = 'economy' | 'core' | 'elite';

export interface Perk {
  name: string;
  effect: string;
  tier: PerkTier;
}

export const stats = {
  /** Date of this snapshot (ISO), shown as "Stats as of …". */
  asOf: '2026-11-12',
  founded: '2026-09-29',
  level: 66,
  members: { current: 49, max: 51 },
  respect: 2309,
  perkLevels: { current: 258, max: 400 },
  xp: { current: 2_287_651, next: 3_696_218 },
  territories: 15,
  /** Family war record. */
  wars: { won: 11, lost: 0 },
  rankings: [
    { label: 'Respect', rank: 69 },
    { label: 'Territories', rank: 31 },
    { label: 'Family level', rank: 90 },
  ],
};

export const perkTiers: Record<PerkTier, { label: string; color: string }> = {
  economy: { label: 'Economy', color: '#a5a3b8' },
  core: { label: 'Core', color: '#b9a4fb' },
  elite: { label: 'Elite', color: '#d9c08a' },
};

export const perks: Perk[] = [
  { name: 'Job Cut', effect: '+17% job cash', tier: 'economy' },
  { name: 'Landlord', effect: '+19% property income', tier: 'economy' },
  { name: 'Smugglers', effect: '+17% operation payout', tier: 'economy' },
  { name: 'Enforcers', effect: '+18% attack power', tier: 'core' },
  { name: 'Guardians', effect: '+17% defense power', tier: 'core' },
  { name: 'Hustlers', effect: '+14% job experience', tier: 'core' },
  { name: 'Medics', effect: '+14% health regen', tier: 'core' },
  { name: 'Runners', effect: '+7.5% stamina regen', tier: 'core' },
  { name: 'Bagmen', effect: '+15% cash stolen', tier: 'core' },
  { name: 'Insurance', effect: '+15% less cash lost', tier: 'core' },
  { name: 'Veterans', effect: '+13% fight experience', tier: 'core' },
  { name: 'Demolition', effect: '+15% siege damage', tier: 'core' },
  { name: 'Boss Hunters', effect: '+15% boss damage', tier: 'core' },
  { name: 'Hitters', effect: '+20% attack power', tier: 'elite' },
  { name: 'Bodyguards', effect: '+19% defense power', tier: 'elite' },
  { name: 'Fences', effect: '+15% job drop chance', tier: 'elite' },
];

// ---- Derived values -------------------------------------------------------

export const openSeats = seatsLeft(stats.members.current, stats.members.max);
export const xpPercent = percentOf(stats.xp.current, stats.xp.next);
export const asOfLabel = formatDate(stats.asOf, { month: 'long', day: 'numeric', year: 'numeric' });
export const foundedLabel = formatDate(stats.founded, { month: 'long', day: 'numeric', year: 'numeric' });
export const foundedShort = formatDate(stats.founded, { month: 'short', year: 'numeric' });
export { formatNumber };
