import { CONTROLS } from './content';
import { GameButton } from './GameButton';

export function HowToPlay() {
  return (
    <section id="controls" className="bf-panel-section">
      <div className="bf-wood-frame bf-panel">
        <header className="bf-panel-header">
          <h2 id="controls-title">Controls</h2>
          <p>One-hit kills. Charge your throw. Recall mid-flight. Dash through danger.</p>
        </header>
        <div className="bf-controls-screen">
          <div className="bf-keyboard-panel" aria-label="Keyboard layout preview">
            <div className="bf-keyboard">
              <div className="bf-key-row">
                <kbd className="bf-key">W</kbd>
              </div>
              <div className="bf-key-row">
                <kbd className="bf-key bf-key--lit">A</kbd>
                <kbd className="bf-key">S</kbd>
                <kbd className="bf-key">D</kbd>
              </div>
              <div className="bf-key-row">
                <kbd className="bf-key bf-key--wide">Shift</kbd>
                <kbd className="bf-key bf-key--wide">Space</kbd>
              </div>
              <div className="bf-key-row">
                <kbd className="bf-key">E</kbd>
                <kbd className="bf-key">R</kbd>
              </div>
            </div>
            <p className="bf-keyboard-note">Player 1 · Gamepad supported in lobby</p>
          </div>
          <ul className="bf-control-rows" role="list">
            {CONTROLS.map((c) => (
              <li key={c.label} className="bf-control-row">
                <div className="bf-control-keys">
                  {c.keys.map((k) => (
                    <kbd key={k}>{k}</kbd>
                  ))}
                </div>
                <div>
                  <strong>{c.label}</strong>
                  <span>{c.detail}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="bf-panel-cta">
          <GameButton to="/play" variant="primary">
            Jump In
          </GameButton>
        </div>
      </div>
    </section>
  );
}
