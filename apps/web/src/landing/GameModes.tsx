import { GAME_MODES } from './content';
import { GameButton } from './GameButton';

const MODE_ART: Record<string, string> = {
  freeForAll: '⚔',
  teams: '🌶',
  goldenBoomerang: '★',
  hideAndSeek: '?',
};

export function GameModes() {
  return (
    <section id="modes" className="bf-panel-section">
      <div className="bf-wood-frame bf-panel">
        <header className="bf-panel-header">
          <h2 id="modes-title">Select Game Mode</h2>
          <p>Free-for-all brawls, team spice, golden boomerang hunts, and prop disguise chaos.</p>
        </header>
        <div className="bf-mode-select">
          {GAME_MODES.map((mode) => (
            <article
              key={mode.id}
              className="bf-mode-tile"
              style={{ '--mode-accent': mode.accent } as React.CSSProperties}
            >
              <span className="bf-mode-tile-icon" aria-hidden="true">
                {MODE_ART[mode.id]}
              </span>
              <h3>{mode.name}</h3>
              <p>{mode.description}</p>
            </article>
          ))}
        </div>
        <div className="bf-panel-cta">
          <GameButton to="/play" variant="primary">
            Choose a Mode
          </GameButton>
        </div>
      </div>
    </section>
  );
}
