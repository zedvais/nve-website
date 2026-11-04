/** Small, pure formatting helpers shared by the data files and components. */

/** Formats an ISO date (YYYY-MM-DD) in en-US, independent of the build machine's time zone. */
export const formatDate = (iso: string, opts: Intl.DateTimeFormatOptions): string =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { timeZone: 'UTC', ...opts });

/** 1970 -> "1,970" */
export const formatNumber = (n: number): string => n.toLocaleString('en-US');

/** Progress as a percentage with one decimal, clamped to 0–100. */
export const percentOf = (current: number, total: number): number => {
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((current / total) * 1000) / 10));
};

/** Free seats in the family, never negative. */
export const seatsLeft = (current: number, max: number): number => Math.max(0, max - current);
