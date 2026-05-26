import { CONTROLS } from './content';

export function HowToPlay() {
  return (
    <section id="how-to-play" className="lp-section" aria-labelledby="controls-title">
      <div className="lp-section-header">
        <span className="lp-section-label">Controls</span>
        <h2 id="controls-title">Master the Boomerang</h2>
        <p>One-hit kills. Charge your throw. Recall mid-flight. Dash through danger. Simple to learn, brutal to master.</p>
      </div>
      <div className="lp-controls-layout">
        <div className="lp-keyboard" aria-label="Keyboard layout preview">
          <div className="lp-keyboard-visual">
            <div className="lp-key-row">
              <span className="lp-key">W</span>
            </div>
            <div className="lp-key-row">
              <span className="lp-key active">A</span>
              <span className="lp-key">S</span>
              <span className="lp-key">D</span>
            </div>
            <div className="lp-key-row">
              <span className="lp-key wide">Shift</span>
              <span className="lp-key wide">Space</span>
            </div>
            <div className="lp-key-row">
              <span className="lp-key">E</span>
              <span className="lp-key">R</span>
            </div>
          </div>
          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--lp-text-muted)' }}>
            Player 1 keyboard · Gamepad supported in lobby
          </p>
        </div>
        <div className="lp-control-list" role="list">
          {CONTROLS.map((c) => (
            <div key={c.label} className="lp-control-item" role="listitem">
              <div className="lp-control-keys" aria-label={c.keys.join(' ')}>
                {c.keys.map((k) => (
                  <span key={k}>{k}</span>
                ))}
              </div>
              <div>
                <strong>{c.label}</strong>
                <span>{c.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
