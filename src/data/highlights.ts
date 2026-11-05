/**
 * Community highlights shown in "Our Journey".
 * Never invent results: leave `date` and `metric` out until there is a real
 * record. Entries marked `placeholder: true` render as "To be recorded".
 *
 * Figures come from `stats.ts`, so a stats update refreshes these cards too.
 */
import { formatNumber, stats } from '@/data/stats';

const rank = (label: string) => stats.rankings.find((r) => r.label === label)?.rank;
const respectRank = rank('Respect');
const territoryRank = rank('Territories');
const weeksSinceFounding = Math.round(
  (Date.parse(stats.asOf) - Date.parse(stats.founded)) / (7 * 24 * 60 * 60 * 1000),
);

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
    title: `Level ${stats.level} reached`,
    description: `From founding to family level ${stats.level} in about ${weeksSinceFounding} weeks.`,
    icon: 'progression',
    date: 'Nov 2026',
    metric: { value: `Lv. ${stats.level}`, label: 'Family level' },
  },
  {
    category: 'Family Vault & perks',
    title: `${stats.perkLevels.current} perk levels`,
    description: 'Sixteen family perks active across economy, core and elite, funded by member donations.',
    icon: 'vault',
    date: 'Nov 2026',
    metric: { value: `${stats.perkLevels.current} / ${stats.perkLevels.max}`, label: 'Perk levels' },
  },
  {
    category: 'Territory expansion',
    title: `${stats.territories} territories held`,
    description: `Ranked #${territoryRank} in territories.`,
    icon: 'territory',
    date: 'Nov 2026',
    metric: { value: `#${territoryRank}`, label: 'In territories' },
  },
  {
    category: 'Notable achievements',
    title: 'Top 100 in respect',
    description: `Ranked #${respectRank} in respect with ${formatNumber(stats.respect)} respect earned.`,
    icon: 'respect',
    date: 'Nov 2026',
    metric: { value: `#${respectRank}`, label: 'In respect' },
  },
  {
    category: 'Family wars',
    title: 'Undefeated in war',
    description: `${stats.wars.won + stats.wars.lost} family wars fought side by side, ${stats.wars.won} won, ${stats.wars.lost === 0 ? 'none' : stats.wars.lost} lost.`,
    icon: 'war',
    date: 'Nov 2026',
    metric: { value: `${stats.wars.won}–${stats.wars.lost}`, label: 'War record' },
  },
];
