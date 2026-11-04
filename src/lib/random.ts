/**
 * Deterministic pseudo-random numbers (Park–Miller "minimal standard" LCG).
 *
 * The procedural artwork (skylines, stars, embers, city lights) is generated
 * at build time. Using a fixed seed means every build draws exactly the same
 * picture, so deploys never shuffle the art and there is no client JS.
 */
export function seededRandom(seed: number): () => number {
  let s = Math.floor(Math.abs(seed)) % 2147483647 || 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
