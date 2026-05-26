import { FEATURES } from './content';

export function FeaturesStrip() {
  return (
    <section className="bf-couch-bar" aria-label="Game features">
      <ul className="bf-couch-stats">
        {FEATURES.map((f) => (
          <li key={f.label}>
            <strong>{f.label}</strong>
            <span>
              {f.detail}
              {'badge' in f && f.badge && <em className="bf-beta-tag">{f.badge}</em>}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
