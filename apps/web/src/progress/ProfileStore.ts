const DB_NAME = 'boomerang-fu-web';
const STORE = 'profile';
const KEY = 'main';

export interface PlayerProfile {
  xp: number;
  level: number;
  unlockedCharacters: string[];
  unlockedCostumes: string[];
  matchesPlayed: number;
}

const DEFAULT_PROFILE: PlayerProfile = {
  xp: 0,
  level: 1,
  unlockedCharacters: ['avocado', 'banana', 'apple', 'orange'],
  unlockedCostumes: [],
  matchesPlayed: 0,
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function loadProfile(): Promise<PlayerProfile> {
  try {
    const db = await openDb();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE, 'readonly');
      const get = tx.objectStore(STORE).get(KEY);
      get.onsuccess = () => {
        resolve({ ...DEFAULT_PROFILE, ...(get.result as PlayerProfile | undefined) });
      };
      get.onerror = () => resolve({ ...DEFAULT_PROFILE });
    });
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

export async function saveProfile(profile: PlayerProfile): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(profile, KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export function xpForLevel(level: number): number {
  return level * 100;
}

export function awardMatchXp(profile: PlayerProfile, kills: number): PlayerProfile {
  const gained = 25 + kills * 15;
  let xp = profile.xp + gained;
  let level = profile.level;
  while (xp >= xpForLevel(level)) {
    xp -= xpForLevel(level);
    level += 1;
  }
  const next: PlayerProfile = {
    ...profile,
    xp,
    level,
    matchesPlayed: profile.matchesPlayed + 1,
  };
  if (level >= 2 && !next.unlockedCharacters.includes('watermelon')) {
    next.unlockedCharacters = [...next.unlockedCharacters, 'watermelon'];
  }
  if (level >= 3 && !next.unlockedCharacters.includes('pineapple')) {
    next.unlockedCharacters = [...next.unlockedCharacters, 'pineapple'];
  }
  return next;
}
