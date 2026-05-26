import { ARENA_THEMES, arenaCount, getArenasByTheme } from './content';

export function ArenaPreview() {
  return (
    <section id="arenas" className="lp-section" aria-labelledby="arenas-title">
      <div className="lp-section-header">
        <span className="lp-section-label">Battlegrounds</span>
        <h2 id="arenas-title">Arenas Across Five Themes</h2>
        <p>
          Kitchen counters, jungle temples, bamboo bridges, cloud castles, and dessert dungeons —
          each with unique hazards and traps.
        </p>
      </div>
      <div className="lp-arena-themes">
        {ARENA_THEMES.map((theme) => {
          const maps = getArenasByTheme(theme.id);
          return (
            <article key={theme.id} className="lp-theme-card">
              <div className="lp-theme-header">
                <span className="lp-theme-icon" aria-hidden="true">{theme.icon}</span>
                <h3>{theme.name}</h3>
              </div>
              <div className="lp-theme-swatch" style={{ background: theme.gradient }} aria-hidden="true" />
              <div className="lp-theme-body">
                <p>{theme.description}</p>
                <div className="lp-theme-maps">
                  {maps.map((m) => (
                    <span key={m.id} className="lp-map-chip">{m.name}</span>
                  ))}
                  {maps.length === 0 && (
                    <span className="lp-map-chip">Coming soon</span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <p className="lp-arena-count">
        {arenaCount} arenas loaded · Goal: 50+ unique battlegrounds
      </p>
    </section>
  );
}
