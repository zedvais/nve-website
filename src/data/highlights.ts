/**
 * Community highlights shown in "Our Journey".
 * Never invent results: leave `date` and `metric` out until there is a real
 * record. Entries marked `placeholder: true` render as "To be recorded".
 */

export type HighlightIcon = 'progression' | 'territory' | 'milestone' | 'event' | 'achievement';

export interface Highlight {
  category: string;
  title: string;
  description: string;
  icon: HighlightIcon;
  /** Free text, e.g. 'March 2026'. Omit when unknown. */
  date?: string;
  /** Optional headline figure, e.g. { value: 'Lv. 10', label: 'Family level' }. */
  metric?: { value: string; label: string };
  placeholder?: boolean;
}

export const highlights: Highlight[] = [
  {
    category: 'Family progression',
    title: 'Growing the family',
    description: 'Family level milestones and unlocked bonuses will be recorded here.',
    icon: 'progression',
    placeholder: true,
  },
  {
    category: 'Territory expansion',
    title: 'Claiming new ground',
    description: 'Territories taken and held by the family will be documented here.',
    icon: 'territory',
    placeholder: true,
  },
  {
    category: 'Community milestones',
    title: 'Moments that matter',
    description: 'Community firsts and membership milestones will be listed here.',
    icon: 'milestone',
    placeholder: true,
  },
  {
    category: 'Special events',
    title: 'Playing together',
    description: 'Family events, tournaments and community nights will appear here.',
    icon: 'event',
    placeholder: true,
  },
  {
    category: 'Notable achievements',
    title: 'Wins worth remembering',
    description: 'Standout results earned by the family will be celebrated here.',
    icon: 'achievement',
    placeholder: true,
  },
];
