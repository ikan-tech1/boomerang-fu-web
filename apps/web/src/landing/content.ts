import { balance } from '@boomerang/content';

export const TAGLINE = 'Slice and dice your friends with boomerangs';

export const CHARACTER_EMOJI: Record<string, string> = {
  avocado: '🥑',
  banana: '🍌',
  apple: '🍎',
  orange: '🍊',
  watermelon: '🍉',
  pineapple: '🍍',
  strawberry: '🍓',
  cherry: '🍒',
  lemon: '🍋',
  grape: '🍇',
  coconut: '🥥',
  peach: '🍑',
  donut: '🍩',
  cupcake: '🧁',
  cookie: '🍪',
  icecream: '🍦',
  popsicle: '🍭',
  cake: '🎂',
  muffin: '🥧',
  pie: '🥧',
};

export const POWER_UPS = [
  { id: 'shield', name: 'Shield', icon: '🛡️', description: 'Blocks one boomerang hit before shattering.' },
  { id: 'fire', name: 'Fire', icon: '🔥', description: 'Ignites targets; flames spread when you score a kill.' },
  { id: 'ice', name: 'Ice', icon: '🧊', description: 'Freezes enemies solid on contact until they thaw.' },
  { id: 'explosive', name: 'Explosive', icon: '💥', description: 'Boomerang detonates on hit or wall — three throws.' },
  { id: 'teleport', name: 'Teleport', icon: '✨', description: 'Blink to your aim point — three charges.' },
  { id: 'telekinesis', name: 'Telekinesis', icon: '🌀', description: 'Steer your boomerang remotely for five seconds.' },
  { id: 'disguise', name: 'Disguise', icon: '🎭', description: 'Blend in as an arena prop until someone hits you.' },
  { id: 'decoy', name: 'Decoy', icon: '👥', description: 'Spawn a fake clone to confuse pursuers.' },
  { id: 'battleRoyale', name: 'Battle Royale', icon: '⭕', description: 'Shrinking zone forces everyone toward the center.' },
  { id: 'spamDash', name: 'Spam Dash', icon: '⚡', description: 'Zero dash cooldown for eight seconds of chaos.' },
  { id: 'golden', name: 'Golden Boomerang', icon: '🏆', description: 'Heavy, slow, deadly — worth triple points.' },
  { id: 'magnet', name: 'Magnet', icon: '🧲', description: 'Pull nearby power-ups into your orbit.' },
  { id: 'multiThrow', name: 'Multi Throw', icon: '🪃', description: 'Launch three boomerangs at once — three volleys.' },
] as const;

export const GAME_MODES = [
  {
    id: 'freeForAll',
    name: 'Free-for-All',
    icon: '⚔️',
    description: 'Every food for themselves. Most kills before the timer wins.',
    accent: '#ff6b4a',
  },
  {
    id: 'teams',
    name: 'Teams',
    icon: '🌶️',
    description: 'Spicy vs Chill. Coordinate throws, protect your squad.',
    accent: '#4ecdc4',
  },
  {
    id: 'goldenBoomerang',
    name: 'Golden Boomerang',
    icon: '🏆',
    description: 'One golden weapon spawns mid-round. Hold it, score triple.',
    accent: '#ffd93d',
  },
  {
    id: 'hideAndSeek',
    name: 'Hide & Seek',
    icon: '🌿',
    description: 'Hiders disguise as props. Seekers hunt with boomerangs.',
    accent: '#95e06c',
  },
] as const;

export const ARENA_THEMES = [
  {
    id: 'kitchen',
    name: 'Kitchen',
    icon: '🍳',
    gradient: 'linear-gradient(135deg, #ff9a56 0%, #ff6b6b 100%)',
    description: 'Countertops, spinners, and toaster traps.',
  },
  {
    id: 'jungle',
    name: 'Jungle',
    icon: '🌴',
    gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    description: 'Temple ruins, vine swings, and snake pits.',
  },
  {
    id: 'bamboo',
    name: 'Bamboo',
    icon: '🎋',
    gradient: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)',
    description: 'Zen gardens, river runs, and lantern lanes.',
  },
  {
    id: 'clouds',
    name: 'Clouds',
    icon: '☁️',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    description: 'Sky castles, storm stations, and void pits.',
  },
  {
    id: 'dessert',
    name: 'Dessert',
    icon: '🍩',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    description: 'Donut dashes, candy canyons, and sugar rush.',
  },
] as const;

export const CONTROLS = [
  { keys: ['W', 'A', 'S', 'D'], label: 'Move', detail: 'Dash around the arena' },
  { keys: ['Shift'], label: 'Dash', detail: 'Quick burst with brief invulnerability' },
  { keys: ['E'], label: 'Melee', detail: 'Close-range swipe to deflect or finish' },
  { keys: ['Space'], label: 'Throw', detail: 'Hold to charge, release to fling' },
  { keys: ['R'], label: 'Recall', detail: 'Pull your boomerang back home' },
] as const;

export const FEATURES = [
  { icon: '🎮', label: 'Local Multiplayer', detail: 'Up to 6 players on one screen' },
  { icon: '🤖', label: 'Smart Bots', detail: 'Easy, medium, and hard AI opponents' },
  { icon: '🌐', label: 'Online Play', detail: 'Colyseus rooms', badge: 'Beta' as const },
  { icon: '🗺️', label: '52+ Arenas', detail: 'Kitchen, jungle, bamboo & more' },
] as const;

export const characters = balance.characters;
export const arenaCount = balance.arenas.length;

export function getArenasByTheme(theme: string) {
  return balance.arenas.filter((a) => a.theme === theme).slice(0, 4);
}

export function getNavSections() {
  return [
    { id: 'characters', label: 'Fighters' },
    { id: 'modes', label: 'Modes' },
    { id: 'powerups', label: 'Power-Ups' },
    { id: 'arenas', label: 'Arenas' },
    { id: 'how-to-play', label: 'Controls' },
  ];
}
