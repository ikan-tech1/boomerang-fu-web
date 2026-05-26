import { POWER_UPS } from './content';

export function PowerUpsGrid() {
  return (
    <section id="powerups" className="lp-section" aria-labelledby="powerups-title">
      <div className="lp-section-header">
        <span className="lp-section-label">Arsenal</span>
        <h2 id="powerups-title">13 Stackable Power-Ups</h2>
        <p>
          Grab up to three at once. Mix fire and ice? Never — but shield plus explosive? Chef&apos;s kiss.
        </p>
      </div>
      <div className="lp-powerups-grid" role="list">
        {POWER_UPS.map((pu) => (
          <article key={pu.id} className="lp-powerup-card" role="listitem">
            <div className="lp-powerup-icon" aria-hidden="true">{pu.icon}</div>
            <h3>{pu.name}</h3>
            <p>{pu.description}</p>
          </article>
        ))}
      </div>
      <p className="lp-stack-note">
        Stack up to 3 power-ups · Fire and Ice are mutually exclusive · HUD shows pickup order
      </p>
    </section>
  );
}
