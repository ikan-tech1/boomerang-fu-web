import { Link } from 'react-router-dom';
import { getNavSections } from './content';

const GITHUB_URL = 'https://github.com/ikan-tech1/boomerang-fu-web';

export function LandingFooter() {
  return (
    <footer className="lp-footer">
      <div className="lp-footer-inner">
        <div className="lp-footer-brand">
          <Link to="/" className="lp-logo">
            <span className="lp-logo-icon" aria-hidden="true">🪃</span>
            <span className="lp-logo-text">Boomerang Fu Web</span>
          </Link>
          <p>
            A browser-based fan recreation of the party brawler you know and love.
            Built with Phaser, React, and too many throwable vegetables.
          </p>
        </div>
        <div>
          <h4>Explore</h4>
          <ul className="lp-footer-links">
            {getNavSections().map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>{s.label}</a>
              </li>
            ))}
            <li>
              <Link to="/play">Play Now</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4>Project</h4>
          <ul className="lp-footer-links">
            <li>
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                GitHub Repository
              </a>
            </li>
            <li>
              <a href="https://boomerang-fu-web.vercel.app" target="_blank" rel="noopener noreferrer">
                Live Demo
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="lp-footer-bottom">
        <p className="lp-disclaimer">
          Boomerang Fu Web is an unofficial fan recreation and is not affiliated with, endorsed by,
          or connected to Flyhigh Works or the original Boomerang Fu game. All original game
          trademarks belong to their respective owners.
        </p>
        <p>© {new Date().getFullYear()} Boomerang Fu Web · MIT License</p>
      </div>
    </footer>
  );
}
