import { balance } from '@boomerang/content';

export interface CharacterDef {
  id: string;
  name: string;
  source: string;
  color: string;
  colorHex: number;
}

const parseColor = (hex: string): number => parseInt(hex.replace('#', ''), 16);

export class CharacterRegistry {
  private readonly characters: Map<string, CharacterDef>;

  constructor() {
    this.characters = new Map(
      balance.characters.map((c: { id: string; name: string; source: string; color: string }) => [
        c.id,
        { ...c, colorHex: parseColor(c.color) },
      ]),
    );
  }

  get(id: string): CharacterDef {
    const c = this.characters.get(id);
    if (!c) {
      const fallback = this.characters.get('avocado');
      if (!fallback) throw new Error('No characters registered');
      return fallback;
    }
    return c;
  }

  getAll(): CharacterDef[] {
    return [...this.characters.values()];
  }

  getBySource(source: string): CharacterDef[] {
    return this.getAll().filter((c) => c.source === source);
  }
}

export const characterRegistry = new CharacterRegistry();
