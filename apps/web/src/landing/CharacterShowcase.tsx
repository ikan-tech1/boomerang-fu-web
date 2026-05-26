import { CHARACTER_EMOJI, characters } from './content';

function CharacterCard({ id, name, color, source }: { id: string; name: string; color: string; source: string }) {
  return (
    <article className="lp-char-card">
      <div className="lp-char-avatar" style={{ background: color }}>
        <span aria-hidden="true">{CHARACTER_EMOJI[id] ?? '🍽️'}</span>
      </div>
      <p className="lp-char-name">{name}</p>
      <p className="lp-char-source">{source === 'just-desserts' ? 'Dessert DLC' : 'Base roster'}</p>
    </article>
  );
}

export function CharacterShowcase() {
  const doubled = [...characters, ...characters];

  return (
    <section id="characters" className="lp-section" aria-labelledby="characters-title">
      <div className="lp-section-header">
        <span className="lp-section-label">Roster</span>
        <h2 id="characters-title">Pick Your Fighter</h2>
        <p>
          Twenty edible warriors — fruity classics and sweet dessert DLC treats.
          Each with their own color and personality.
        </p>
      </div>
      <div className="lp-char-track-wrap">
        <div className="lp-char-track" role="list">
          {doubled.map((c, i) => (
            <div key={`${c.id}-${i}`} role="listitem">
              <CharacterCard {...c} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
