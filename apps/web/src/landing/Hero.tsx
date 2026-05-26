import { Link } from 'react-router-dom';
import { TAGLINE } from './content';

export function Hero() {
  return (
    <section className="lp-hero" aria-labelledby="hero-title">
      <div className="lp-hero-bg" aria-hidden="true" />
      <div className="lp-hero-grid" aria-hidden="true" />
      <div className="lp-hero-inner">
        <div>
          <span className="lp-hero-badge">
            <span aria-hidden="true">🎉</span> Fan recreation · Play in browser
          </span>
          <h1 id="hero-title">
            Food fighters.<br />
            <span className="highlight">Flying chaos.</span>
          </h1>
          <p className="lp-hero-tagline">{TAGLINE}</p>
          <div className="lp-hero-actions">
            <Link to="/play" className="lp-btn lp-btn-primary">
              Play Free
            </Link>
            <a href="#how-to-play" className="lp-btn lp-btn-secondary">
              How to Play
            </a>
          </div>
        </div>
        <div className="lp-hero-visual" aria-hidden="true">
          <div className="lp-arena-mock">
            <div className="lp-arena-floor" />
            <div className="lp-food-fighter f1">🥑</div>
            <div className="lp-food-fighter f2">🍌</div>
            <div className="lp-food-fighter f3">🍎</div>
            <div className="lp-boomerang-orbit">
              <span className="lp-boomerang">🪃</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
