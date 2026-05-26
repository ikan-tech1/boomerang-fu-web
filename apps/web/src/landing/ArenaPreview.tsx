import { ARENA_THEMES, arenaCount, getArenasByTheme } from './content';
import { ArenaScene, type ArenaTheme } from './ArenaScene';

const THEME_ARENA: Record<string, ArenaTheme> = {
  kitchen: 'kitchen',
  jungle: 'grass',
  bamboo: 'bamboo',
  clouds: 'grass',
  dessert: 'kitchen',
};

export function ArenaPreview() {
  return (
    <section id="arenas" className="bf-panel-section">
      <div className="bf-wood-frame bf-panel">
        <header className="bf-panel-header">
          <h2 id="arenas-title">Arena Gallery</h2>
          <p>Kitchen counters, jungle ruins, bamboo bridges, cloud castles, and dessert dungeons.</p>
        </header>
        <div className="bf-arena-gallery">
          {ARENA_THEMES.map((theme) => {
            const maps = getArenasByTheme(theme.id);
            const arenaTheme = THEME_ARENA[theme.id] ?? 'kitchen';
            return (
              <article key={theme.id} className="bf-arena-card">
                <div className="bf-arena-card-preview">
                  <ArenaScene theme={arenaTheme} compact showBoomerang={false} fighters={[]} />
                </div>
                <div className="bf-arena-card-body">
                  <h3>{theme.name}</h3>
                  <p>{theme.description}</p>
                  <ul className="bf-map-list">
                    {maps.map((m) => (
                      <li key={m.id}>{m.name}</li>
                    ))}
                    {maps.length === 0 && <li>Coming soon</li>}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
        <p className="bf-arena-total">{arenaCount} arenas loaded</p>
      </div>
    </section>
  );
}
