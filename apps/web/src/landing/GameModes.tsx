import { Link } from 'react-router-dom';
import { GAME_MODES } from './content';

export function GameModes() {
  return (
    <section id="modes" className="lp-section" aria-labelledby="modes-title">
      <div className="lp-section-header">
        <span className="lp-section-label">Game Modes</span>
        <h2 id="modes-title">Four Ways to Throw Down</h2>
        <p>From free-for-all brawls to stealthy hide-and-seek — every mode keeps the boomerang flying.</p>
      </div>
      <div className="lp-modes-grid">
        {GAME_MODES.map((mode) => (
          <article key={mode.id} className="lp-mode-card">
            <div className="lp-mode-icon" aria-hidden="true">{mode.icon}</div>
            <h3>{mode.name}</h3>
            <p>{mode.description}</p>
            <div className="lp-mode-accent" style={{ background: mode.accent }} />
          </article>
        ))}
      </div>
      <p style={{ textAlign: 'center', marginTop: 32 }}>
        <Link to="/play" className="lp-btn lp-btn-primary">
          Choose a Mode
        </Link>
      </p>
    </section>
  );
}
