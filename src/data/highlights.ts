/**
 * Community highlights shown in "Our Journey".
 * Never invent results: leave `date` and `metric` out until there is a real
 * record. Entries marked `placeholder: true` render as "To be recorded".
 */

export type HighlightIcon = 'progression' | 'vault' | 'territory' | 'war' | 'heist';

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
    title: 'Climbing the levels',
    description: 'Family level milestones will be recorded here as NVE grows.',
    icon: 'progression',
    placeholder: true,
  },
  {
    category: 'Family Vault & perks',
    title: 'Perks unlocked',
    description: 'Cash, Gold and Stamina perks the family has unlocked together will be listed here.',
    icon: 'vault',
    placeholder: true,
  },
  {
    category: 'Territory expansion',
    title: 'Districts held',
    description: 'Territories taken and held by the family will be documented here.',
    icon: 'territory',
    placeholder: true,
  },
  {
    category: 'Family wars',
    title: 'Wars fought',
    description: 'Wars declared, fought and won as a family will be recorded here.',
    icon: 'war',
    placeholder: true,
  },
  {
    category: 'Notable achievements',
    title: 'Jobs worth remembering',
    description: 'Big heists, boss takedowns and standout moments will be celebrated here.',
    icon: 'heist',
    placeholder: true,
  },
];
