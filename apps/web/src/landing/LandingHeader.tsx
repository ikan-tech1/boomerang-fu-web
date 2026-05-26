import { Link } from 'react-router-dom';
import { GameButton } from './GameButton';

export function LandingHeader() {
  return (
    <header className="bf-menu-bar">
      <Link to="/" className="bf-menu-logo" aria-label="Boomerang Fu Web home">
        <svg className="bf-menu-logo-icon" viewBox="0 0 32 32" aria-hidden="true">
          <path
            d="M4 16 C4 8 12 4 20 6 C24 7 28 11 27 16 C26 22 20 26 14 25 C10 24 4 21 4 16 Z"
            fill="#E8A317"
            stroke="#8B5A00"
            strokeWidth="1.5"
          />
        </svg>
        <span>Boomerang Fu Web</span>
      </Link>
      <nav className="bf-menu-nav" aria-label="Page sections">
        <a href="#fighters">Fighters</a>
        <a href="#modes">Modes</a>
        <a href="#powerups">Power-Ups</a>
        <a href="#arenas">Arenas</a>
        <a href="#controls">Controls</a>
      </nav>
      <GameButton to="/play" variant="primary" size="sm">
        Play
      </GameButton>
    </header>
  );
}
