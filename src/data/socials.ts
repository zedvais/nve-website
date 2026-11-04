/**
 * Social and community links.
 * Leave `url` empty for anything that is not live yet: empty links are hidden
 * (or shown as "coming soon" for Discord) instead of pointing somewhere invented.
 */

export type SocialIcon = 'discord' | 'youtube' | 'twitch' | 'x' | 'instagram' | 'tiktok';

export interface SocialLink {
  name: string;
  icon: SocialIcon;
  url: string;
}

/** Discord invite, e.g. 'https://discord.gg/your-invite'. */
export const discord: SocialLink = {
  name: 'Discord',
  icon: 'discord',
  url: 'https://discord.gg/b99p22KwBD',
};

export const socials: SocialLink[] = [
  discord,
  { name: 'YouTube', icon: 'youtube', url: '' },
  { name: 'Twitch', icon: 'twitch', url: '' },
  { name: 'X', icon: 'x', url: '' },
  { name: 'Instagram', icon: 'instagram', url: '' },
  { name: 'TikTok', icon: 'tiktok', url: '' },
];

export const activeSocials = socials.filter((s) => s.url.trim() !== '');
export const hasDiscord = discord.url.trim() !== '';
