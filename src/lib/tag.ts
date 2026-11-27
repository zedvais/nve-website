/**
 * Splits the family name into letters and marks the ones that spell the tag.
 * The leading tag letters are matched in order from the start of the name and the
 * final tag letter from the end, so Navierre + NVE reads as N-aV-ierrE.
 */
export function tagLetters(name: string, tag: string): { char: string; tag: boolean }[] {
  const word = name.toLowerCase();
  const t = tag.toLowerCase();
  const picked = new Set<number>();
  let from = 0;
  for (const ch of t.slice(0, -1)) {
    const i = word.indexOf(ch, from);
    if (i === -1) return [...name].map((char) => ({ char, tag: false }));
    picked.add(i);
    from = i + 1;
  }
  const last = word.lastIndexOf(t.slice(-1));
  if (last < from) return [...name].map((char) => ({ char, tag: false }));
  picked.add(last);
  return [...name].map((char, i) => ({ char, tag: picked.has(i) }));
}
