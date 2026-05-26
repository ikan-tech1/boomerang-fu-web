import { Link } from 'react-router-dom';

export function TrailerSection() {
  return (
    <section className="lp-trailer" aria-labelledby="trailer-title">
      <div className="lp-section-header">
        <span className="lp-section-label">Gameplay</span>
        <h2 id="trailer-title">See the Chaos Unfold</h2>
        <p>Fast rounds, bouncing boomerangs, and instant eliminations. Jump in and experience it yourself.</p>
      </div>
      <div className="lp-trailer-frame">
        <div className="lp-trailer-scene">
          <div className="lp-trailer-hud">
            <span className="lp-trailer-timer">1:42</span>
            <div className="lp-trailer-score">
              <span>🥑 4</span>
              <span>🍌 3</span>
              <span>🍎 2</span>
            </div>
          </div>
          <div className="lp-trailer-playfield">
            <span className="lp-trailer-entity e1" aria-hidden="true">🥑</span>
            <span className="lp-trailer-entity e2" aria-hidden="true">🍌</span>
            <span className="lp-trailer-entity e3" aria-hidden="true">🍩</span>
            <span className="lp-trailer-boom" aria-hidden="true">🪃</span>
          </div>
        </div>
        <div className="lp-trailer-overlay">
          <Link to="/play" className="lp-trailer-play-icon" aria-label="Play the game">
            ▶
          </Link>
          <p>Live gameplay · No download required</p>
        </div>
      </div>
    </section>
  );
}
