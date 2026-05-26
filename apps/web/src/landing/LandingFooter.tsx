import { Link } from 'react-router-dom';
import { GameButton } from './GameButton';

const GITHUB_URL = 'https://github.com/ikan-tech1/boomerang-fu-web';

export function LandingFooter() {
  return (
    <footer className="bf-credits">
      <div className="bf-credits-inner">
        <div className="bf-credits-brand">
          <h2 className="bf-credits-logo">Boomerang Fu Web</h2>
          <p>
            Unofficial fan recreation built with Phaser, React, and too many throwable vegetables.
          </p>
          <GameButton to="/play" variant="primary" size="sm">
            Play
          </GameButton>
        </div>
        <nav aria-label="Footer links">
          <h3>Menu</h3>
          <ul>
            <li><a href="#fighters">Fighters</a></li>
            <li><a href="#modes">Modes</a></li>
            <li><a href="#powerups">Power-Ups</a></li>
            <li><a href="#arenas">Arenas</a></li>
            <li><a href="#controls">Controls</a></li>
            <li><Link to="/play">Play</Link></li>
          </ul>
        </nav>
        <nav aria-label="Project links">
          <h3>Project</h3>
          <ul>
            <li>
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </li>
            <li>
              <a href="https://boomerang-fu-web.vercel.app" target="_blank" rel="noopener noreferrer">
                Live Demo
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="bf-credits-legal">
        <p>
          Boomerang Fu Web is not affiliated with Flyhigh Works or Cranky Watermelon.
          Original Boomerang Fu © its respective owners.
        </p>
        <p>© {new Date().getFullYear()} · MIT License</p>
      </div>
    </footer>
  );
}
