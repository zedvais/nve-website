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
    'Noctus Volpe (NVE) is a gaming family built on teamwork, dedication and the pursuit of something greater. More than a name. More than a family.',
  locale: 'en',
  /** Social preview image in /public. Replace with a branded 1200×630 image when available. */
  ogImage: '/og-image.png',
  /**
   * Official logo. Leave `src` empty to use the typographic NV placeholder.
   * When the real asset is ready, drop it in /public (SVG preferred) and set e.g. '/logo.svg'.
   */
  logo: {
    src: '',
    alt: 'Noctus Volpe logo',
  },
} as const;

export const navigation: NavLink[] = [
  { label: 'Home', href: '/#home', section: 'home' },
  { label: 'About', href: '/#about', section: 'about' },
  { label: 'Family', href: '/#family', section: 'family' },
  { label: 'Values', href: '/#values', section: 'values' },
  { label: 'Join Us', href: '/#join', section: 'join' },
];

export const hero = {
  eyebrow: 'Gaming family',
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
    'Noctus Volpe is a gaming family for players who would rather build something together than chase it alone.',
  body: [
    'We bring together people who value cooperation, steady progression and real connections. Whether you log in every evening or a few times a week, there is a place for you here, and people who notice when you show up.',
    'Every boost we unlock and every bit of ground we take is shared. We plan together, help newer members find their footing, and celebrate the wins as a family. The goal is not a quick climb. It is a community that is still growing, and still worth being part of, years from now.',
  ],
  pillars: [
    { title: 'A welcoming home', text: 'New or veteran, you get a warm welcome and people ready to help.' },
    { title: 'Shared progress', text: 'Achievements are earned together and enjoyed by everyone.' },
    { title: 'Teamwork first', text: 'We back each other up, in game and out of it.' },
    { title: 'Active participation', text: 'The family moves forward because its members show up.' },
    { title: 'Built to last', text: 'We grow with intention, for the long run.' },
  ],
};

export type ValueIcon = 'unity' | 'dedication' | 'respect' | 'ambition';

export const values = {
  index: '02',
  label: 'Values',
  heading: 'What defines us.',
  intro: 'Four principles shape how we play, how we treat each other, and where we are headed.',
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
    'Noctus Volpe is led by its members. Leadership sets the direction, officers keep things running, and every member helps write the story.',
};

export const journey = {
  index: '04',
  label: 'Journey',
  heading: 'Our journey.',
  intro:
    'The milestones that mark how far the family has come. This record grows as we do.',
};

export const recruitment = {
  index: '05',
  label: 'Join Us',
  heading: 'Your place is with us.',
  statement:
    'We are looking for players who show up, pull together and want to grow with a family that has their back.',
  expectations: [
    { title: 'Active participation', text: 'Be present, take part in family activities and keep in touch.' },
    { title: 'Teamwork and cooperation', text: 'Coordinate with others and play for the group, not just yourself.' },
    { title: 'Support family bonuses', text: 'Contribute stamina and resources so everyone benefits from shared bonuses.' },
    { title: 'Territory expansion', text: 'Help the family claim and hold new ground.' },
    { title: 'Earned ranks', text: 'Ranks follow progression and activity. Effort is recognised.' },
    { title: 'Respect, low drama', text: 'Communicate respectfully and keep the environment positive.' },
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
