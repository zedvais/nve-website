/**
 * Community highlights shown in "Our Journey".
 * Never invent results: leave `date` and `metric` out until there is a real
 * record. Entries marked `placeholder: true` render as "To be recorded".
 */

export type HighlightIcon = 'founded' | 'progression' | 'vault' | 'territory' | 'respect' | 'war';

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
    category: 'Community milestones',
    title: 'The family is founded',
    description: 'Noctus Volpe opens its doors in Idle Mafia.',
    icon: 'founded',
    date: 'Sep 29, 2026',
  },
  {
    category: 'Family progression',
    title: 'Level 53 reached',
    description: 'From founding to family level 53 in about five weeks.',
    icon: 'progression',
    date: 'Nov 2026',
    metric: { value: 'Lv. 53', label: 'Family level' },
  },
  {
    category: 'Family Vault & perks',
    title: '242 perk levels',
    description: 'Sixteen family perks active across economy, core and elite, funded by member donations.',
    icon: 'vault',
    date: 'Nov 2026',
    metric: { value: '242 / 400', label: 'Perk levels' },
  },
  {
    category: 'Territory expansion',
    title: '15 territories held',
    description: 'Ranked #33 in territories.',
    icon: 'territory',
    date: 'Nov 2026',
    metric: { value: '#33', label: 'In territories' },
  },
  {
    category: 'Notable achievements',
    title: 'Top 100 in respect',
    description: 'Ranked #71 in respect with 1,970 respect earned.',
    icon: 'respect',
    date: 'Nov 2026',
    metric: { value: '#71', label: 'In respect' },
  },
  {
    category: 'Family wars',
    title: 'Undefeated in war',
    description: 'Eleven family wars fought side by side, eleven won, none lost.',
    icon: 'war',
    date: 'Nov 2026',
    metric: { value: '11–0', label: 'War record' },
  },
];
