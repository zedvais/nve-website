import logoFull from '@/assets/brand/nv-logo.png';
import logoMark from '@/assets/brand/nv-mark.png';
import logoLockup from '@/assets/brand/nv-lockup.png';
import heroBackground from '@/assets/brand/rooftop.jpg';

/**
 * Central site configuration.
 * Everything that describes the community (copy, navigation, recruitment)
 * lives here so UI components never hardcode repeated content.
 */

export interface NavLink {
  label: string;
  /** Use "/#section" so links keep working from future sub-pages. */
  href: string;
  /** Section id used for the active-section indicator. */
  section: string;
}

export const site = {
  name: 'Noctus Volpe',
  shortName: 'NVE',
  monogram: 'NV',
  tagline: 'United by Passion. Driven by Ambition.',
  footerLine: 'Noctus Volpe — United as One.',
  description:
    'Noctus Volpe (NVE) is a family in Idle Mafia on Roblox, built on teamwork, dedication and the pursuit of something greater. More than a name. More than a family.',
  locale: 'en',
  /** Social preview image in /public (1200×630). */
  ogImage: '/og-image.jpg',
  /**
   * Official brand assets (src/assets/brand). Astro optimises them at build time.
   * - full:   the silver-and-purple NV fox monogram (hero, feature artwork)
   * - mark:   the simple white NV mark (header, small sizes)
   * - lockup: the simple mark with the NOCTUS VOLPE wordmark (footer)
   */
  logo: {
    full: logoFull,
    mark: logoMark,
    lockup: logoLockup,
    alt: 'Noctus Volpe logo',
  },
  /** Atmospheric hero photo: the fox on the rooftop above the city. */
  heroBackground,
};

/**
 * The game the family plays. Shown in the hero, footer and SEO copy.
 * `url` is the public Roblox game page; clear it to hide the "Play" link.
 */
export const game = {
  name: 'Idle Mafia',
  platform: 'Roblox',
  url: 'https://www.roblox.com/games/73897506680154',
  /** Shown in the hero status strip. Set to false to show "Closed". */
  recruiting: true,
  disclaimer:
    'Noctus Volpe is a player-run family. Not affiliated with or endorsed by Roblox Corporation or the developers of Idle Mafia.',
};

export const navigation: NavLink[] = [
  { label: 'Home', href: '/#home', section: 'home' },
  { label: 'About', href: '/#about', section: 'about' },
  { label: 'Family', href: '/#family', section: 'family' },
  { label: 'Values', href: '/#values', section: 'values' },
  { label: 'Join Us', href: '/#join', section: 'join' },
];

export const hero = {
  eyebrow: 'An Idle Mafia family on Roblox',
  heading: ['Noctus', 'Volpe'],
  tagline: 'United by Passion. Driven by Ambition.',
  description:
    'A community built on teamwork, dedication, and the pursuit of something greater. More than a name. More than a family.',
  primaryCta: { label: 'Explore Our Community', href: '/#about' },
  secondaryCta: { label: 'Join the Family', href: '/#join' },
};

export const about = {
  index: '01',
  label: 'About',
  heading: 'More than a community.',
  lead:
    'Noctus Volpe is a family in Idle Mafia. We run the city the way a real family should: together.',
  body: [
    'On paper, Idle Mafia is about properties, heists and Cash. In practice, the game gets better with people you trust. NVE brings together players who value cooperation, steady progression and real connections, whether you log in every evening or a few times a week.',
    'What one of us earns, all of us feel. Donations to the Family Vault unlock perks for everyone, wars are fought side by side, and every district we hold is held as a family. We help newer members get their operation running, and we plan for the long game rather than a quick climb.',
  ],
  pillars: [
    { title: 'A welcoming family', text: 'New to the streets or a seasoned boss, you get a warm welcome and people ready to help.' },
    { title: 'Shared progress', text: 'Vault donations power perks that every member benefits from.' },
    { title: 'Side by side in war', text: 'When the family goes to war, we coordinate and fight together.' },
    { title: 'Active participation', text: 'The family moves forward because its members show up.' },
    { title: 'Built to last', text: 'We grow with intention, for the long run.' },
  ],
};

export type ValueIcon = 'unity' | 'dedication' | 'respect' | 'ambition';

export const values = {
  index: '02',
  label: 'Values',
  heading: 'What defines us.',
  intro: 'Every family has a code. These four principles shape how we play, how we treat each other, and where we are headed.',
  items: [
    {
      number: '01',
      title: 'Unity',
      icon: 'unity' as ValueIcon,
      text: 'We grow stronger together, supporting one another both inside and outside the game.',
    },
    {
      number: '02',
      title: 'Dedication',
      icon: 'dedication' as ValueIcon,
      text: 'Every contribution matters. Consistency, effort, and participation shape our progress.',
    },
    {
      number: '03',
      title: 'Respect',
      icon: 'respect' as ValueIcon,
      text: 'A positive community built on mutual respect, fair play, and a drama-free environment.',
    },
    {
      number: '04',
      title: 'Ambition',
      icon: 'ambition' as ValueIcon,
      text: 'Always moving forward, expanding our reach, improving our skills, and setting new goals.',
    },
  ],
};

export const family = {
  index: '03',
  label: 'Family',
  heading: 'The people behind the name.',
  intro:
    'Every seat at the table matters. The Boss sets the direction, Underbosses and Advisors run the operation, Capos lead the crews, and every Soldier and Associate helps write the story.',
};

export const journey = {
  index: '04',
  label: 'Journey',
  heading: 'Our journey.',
  intro:
    'Family levels, perks unlocked, districts taken and wars won. The record of how far NVE has come, kept as it happens.',
  statsHeading: 'The family by the numbers',
  perksHeading: 'Family perks',
};

export const recruitment = {
  index: '05',
  label: 'Join Us',
  heading: 'Your place is with us.',
  statement:
    'We are looking for players who show up, pull together and want to grow with a family that has their back.',
  expectations: [
    { title: 'Active participation', text: 'Be present, take part in family activity and stay in touch on Discord.' },
    { title: 'Teamwork and cooperation', text: 'Coordinate with the family and play for the group, not just yourself.' },
    { title: 'Fuel the Family Vault', text: 'Donate Stamina, Cash and Gold Bars so everyone benefits from family perks.' },
    { title: 'Hold the territory', text: 'Answer the call in family wars and help claim and hold districts.' },
    { title: 'Earn your rank', text: 'Ranks follow progression and activity, from Associate up to Capo and beyond.' },
    { title: 'Respect, low drama', text: 'Communicate respectfully and keep the family a positive place.' },
  ],
  steps: [
    { title: 'Reach out', text: 'Join our Discord and introduce yourself to leadership.' },
    { title: 'Get the nod', text: 'A member of leadership will get in touch about your place in the family.' },
    { title: 'Join in game', text: 'Join Noctus Volpe in Idle Mafia and start contributing.' },
  ],
  primaryCta: { label: 'Join Noctus Volpe' },
  secondaryCta: { label: 'Connect on Discord' },
  /**
   * Optional application form (e.g. a Google Form). When empty,
   * the primary CTA falls back to the Discord invite from socials.ts.
   */
  applicationUrl: '',
  unavailableNote: 'Invite link coming soon. Check back shortly.',
};
