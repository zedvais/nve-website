/**
 * Build-time Roblox lookups. Turns usernames into user ids, profile links and
 * avatar headshot URLs using Roblox's public, unauthenticated web APIs.
 *
 * Runs only while Astro builds (or in `npm run dev`), never in the visitor's
 * browser. Any failure (network, rate limit, unknown username) is logged and
 * the member simply renders with the fallback avatar, so a Roblox outage can
 * never break a deploy.
 */

export interface RobloxProfile {
  id: number;
  /** Canonical username as Roblox stores it. */
  username: string;
  displayName: string;
  profileUrl: string;
  /** Headshot image URL on Roblox's CDN, when one is available. */
  headshotUrl?: string;
}

const USERS_API = 'https://users.roblox.com/v1/usernames/users';
const THUMBS_API = 'https://thumbnails.roblox.com/v1/users/avatar-headshot';
const TIMEOUT_MS = 8000;
/** Valid Roblox headshot sizes include 150x150, 180x180, 352x352 and 420x420. */
const HEADSHOT_SIZE = '352x352';

const cache = new Map<string, Promise<Map<string, RobloxProfile>>>();

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} from ${new URL(url).host}`);
  return (await res.json()) as T;
}

async function lookup(usernames: string[]): Promise<Map<string, RobloxProfile>> {
  const result = new Map<string, RobloxProfile>();
  if (usernames.length === 0) return result;

  try {
    const users = await fetchJson<{ data: { requestedUsername: string; id: number; name: string; displayName: string }[] }>(
      USERS_API,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ usernames, excludeBannedUsers: true }),
      },
    );

    for (const u of users.data ?? []) {
      result.set(u.requestedUsername.toLowerCase(), {
        id: u.id,
        username: u.name,
        displayName: u.displayName,
        profileUrl: `https://www.roblox.com/users/${u.id}/profile`,
      });
    }

    const missing = usernames.filter((n) => !result.has(n.toLowerCase()));
    if (missing.length) console.warn(`[roblox] No Roblox account found for: ${missing.join(', ')}`);
  } catch (err) {
    console.warn(`[roblox] Username lookup failed, using fallback avatars. ${(err as Error).message}`);
    return result;
  }

  const ids = [...result.values()].map((p) => p.id);
  if (ids.length === 0) return result;

  try {
    const params = new URLSearchParams({
      userIds: ids.join(','),
      size: HEADSHOT_SIZE,
      format: 'Png',
      isCircular: 'false',
    });
    const thumbs = await fetchJson<{ data: { targetId: number; state: string; imageUrl: string | null }[] }>(
      `${THUMBS_API}?${params}`,
      { headers: { Accept: 'application/json' } },
    );
    const byId = new Map((thumbs.data ?? []).map((t) => [t.targetId, t]));
    for (const profile of result.values()) {
      const t = byId.get(profile.id);
      if (t?.state === 'Completed' && t.imageUrl) profile.headshotUrl = t.imageUrl;
    }
  } catch (err) {
    console.warn(`[roblox] Avatar lookup failed, using fallback avatars. ${(err as Error).message}`);
  }

  return result;
}

/**
 * Look up several usernames in one batch. Results are cached for the
 * lifetime of the build, so every component can call this freely.
 * Keys of the returned map are lower-cased usernames.
 */
export function getRobloxProfiles(usernames: string[]): Promise<Map<string, RobloxProfile>> {
  const byLower = new Map<string, string>();
  for (const raw of usernames) {
    const name = raw.trim();
    if (name && !byLower.has(name.toLowerCase())) byLower.set(name.toLowerCase(), name);
  }
  const unique = [...byLower.values()];
  const key = [...byLower.keys()].sort().join(',');
  let pending = cache.get(key);
  if (!pending) {
    pending = lookup(unique);
    cache.set(key, pending);
  }
  return pending;
}
