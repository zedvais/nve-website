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

/** 2026 -> "MMXXVI". Whole numbers from 1 to 3999. */
export const roman = (n: number): string => {
  if (!Number.isInteger(n) || n < 1 || n > 3999) throw new RangeError(`Cannot write ${n} in Roman numerals`);
  const table: [number, string][] = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
    [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ];
  let out = '';
  for (const [value, numeral] of table) {
    while (n >= value) {
      out += numeral;
      n -= value;
    }
  }
  return out;
};
