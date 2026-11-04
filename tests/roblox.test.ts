import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type Fetch = typeof fetch;
const json = (body: unknown, ok = true, status = 200) =>
  ({ ok, status, statusText: ok ? 'OK' : 'Error', json: async () => body }) as Response;

// The module caches lookups per build, so load a fresh copy for every test.
async function load() {
  vi.resetModules();
  return import('@/lib/roblox');
}

beforeEach(() => {
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});
afterEach(() => {
  vi.unstubAllGlobals();
});

describe('getRobloxProfiles', () => {
  it('resolves usernames to profiles with headshots', async () => {
    const fetchMock = vi.fn<Fetch>(async (url) => {
      if (String(url).startsWith('https://users.roblox.com')) {
        return json({ data: [{ requestedUsername: 'saetsuna', id: 101, name: 'Saetsuna', displayName: 'Sae' }] });
      }
      return json({ data: [{ targetId: 101, state: 'Completed', imageUrl: 'https://tr.rbxcdn.com/abc.png' }] });
    });
    vi.stubGlobal('fetch', fetchMock);
    const { getRobloxProfiles } = await load();

    const profiles = await getRobloxProfiles(['saetsuna']);
    expect(profiles.get('saetsuna')).toEqual({
      id: 101,
      username: 'Saetsuna',
      displayName: 'Sae',
      profileUrl: 'https://www.roblox.com/users/101/profile',
      headshotUrl: 'https://tr.rbxcdn.com/abc.png',
    });
  });

  it('dedupes usernames case-insensitively and caches the batch', async () => {
    const fetchMock = vi.fn<Fetch>(async (url, init) => {
      if (String(url).startsWith('https://users.roblox.com')) {
        const { usernames } = JSON.parse(String(init?.body));
        expect(usernames).toEqual(['Zedvais']);
        return json({ data: [{ requestedUsername: 'Zedvais', id: 7, name: 'zedvais', displayName: 'zedvais' }] });
      }
      return json({ data: [] });
    });
    vi.stubGlobal('fetch', fetchMock);
    const { getRobloxProfiles } = await load();

    await getRobloxProfiles(['Zedvais', 'zedvais', ' ZEDVAIS ']);
    await getRobloxProfiles(['zedvais']);
    // One users call + one thumbnails call, despite two lookups.
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('returns an empty map instead of throwing when Roblox is down', async () => {
    vi.stubGlobal('fetch', vi.fn<Fetch>(async () => json({}, false, 503)));
    const { getRobloxProfiles } = await load();

    await expect(getRobloxProfiles(['Saetsuna'])).resolves.toEqual(new Map());
    expect(console.warn).toHaveBeenCalled();
  });

  it('keeps profiles when only the avatar lookup fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<Fetch>(async (url) => {
        if (String(url).startsWith('https://users.roblox.com')) {
          return json({ data: [{ requestedUsername: 'L4_n13', id: 9, name: 'L4_n13', displayName: 'L4_n13' }] });
        }
        throw new Error('network down');
      }),
    );
    const { getRobloxProfiles } = await load();

    const profile = (await getRobloxProfiles(['L4_n13'])).get('l4_n13');
    expect(profile?.id).toBe(9);
    expect(profile?.headshotUrl).toBeUndefined();
  });

  it('skips headshots that are not ready yet', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<Fetch>(async (url) =>
        String(url).startsWith('https://users.roblox.com')
          ? json({ data: [{ requestedUsername: 'Kymisuu', id: 3, name: 'Kymisuu', displayName: 'Kymisuu' }] })
          : json({ data: [{ targetId: 3, state: 'Pending', imageUrl: null }] }),
      ),
    );
    const { getRobloxProfiles } = await load();
    expect((await getRobloxProfiles(['Kymisuu'])).get('kymisuu')?.headshotUrl).toBeUndefined();
  });

  it('makes no requests for an empty list', async () => {
    const fetchMock = vi.fn<Fetch>();
    vi.stubGlobal('fetch', fetchMock);
    const { getRobloxProfiles } = await load();
    expect((await getRobloxProfiles([' ', ''])).size).toBe(0);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
