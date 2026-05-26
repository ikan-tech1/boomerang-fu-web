import { FEATURES } from './content';

export function FeaturesStrip() {
  return (
    <section className="lp-features" aria-label="Game features">
      <div className="lp-features-grid">
        {FEATURES.map((f) => (
          <article key={f.label} className="lp-feature-card">
            <div className="lp-feature-icon" aria-hidden="true">{f.icon}</div>
            <h3>
              {f.label}
              {'badge' in f && f.badge && <span className="lp-badge">{f.badge}</span>}
            </h3>
            <p>{f.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
