import { POWER_UPS } from './content';

/** Simple SVG icons for power-ups — no emoji. */
function PowerUpIcon({ id }: { id: string }) {
  switch (id) {
    case 'shield':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2 L20 6 V12 C20 17 16 21 12 22 C8 21 4 17 4 12 V6 Z" fill="#4488ff" stroke="#2266cc" strokeWidth="1.5" />
        </svg>
      );
    case 'fire':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2 C12 8 8 10 8 14 C8 18 10 22 12 22 C14 22 16 18 16 14 C16 10 12 8 12 2 Z" fill="#ff4400" />
        </svg>
      );
    case 'ice':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="6" y="6" width="12" height="12" rx="2" fill="#44ccff" transform="rotate(45 12 12)" />
        </svg>
      );
    case 'golden':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 16 C4 12 8 8 12 8 C16 8 20 12 20 16 C20 18 18 20 12 20 C6 20 4 18 4 16 Z" fill="#ffd700" stroke="#b8860b" strokeWidth="1.5" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="8" fill="#ff6b4a" stroke="#cc4422" strokeWidth="1.5" />
        </svg>
      );
  }
}

export function PowerUpsGrid() {
  return (
    <section id="powerups" className="bf-panel-section">
      <div className="bf-wood-frame bf-panel">
        <header className="bf-panel-header">
          <h2 id="powerups-title">Power-Up Arsenal</h2>
          <p>Grab up to three. Stack shield and explosive — but never fire and ice together.</p>
        </header>
        <ul className="bf-powerup-grid" role="list">
          {POWER_UPS.map((pu) => (
            <li key={pu.id} className="bf-powerup-slot">
              <div className="bf-powerup-icon">
                <PowerUpIcon id={pu.id} />
              </div>
              <div>
                <h3>{pu.name}</h3>
                <p>{pu.description}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="bf-hud-note">Stack ×3 max · Pickup order shown on HUD</p>
      </div>
    </section>
  );
}
