import { characters } from './content';
import { FoodFighterSprite } from './FoodFighterSprite';

export function CharacterShowcase() {
  return (
    <section id="fighters" className="bf-panel-section">
      <div className="bf-wood-frame bf-panel">
        <header className="bf-panel-header">
          <h2 id="fighters-title">Pick Your Fighter</h2>
          <p>Twenty edible warriors — fruity classics and dessert DLC treats.</p>
        </header>
        <ul className="bf-roster-grid" role="list">
          {characters.map((c, i) => (
            <li key={c.id} className="bf-roster-card">
              <FoodFighterSprite
                color={c.color}
                shape={c.id === 'banana' || c.id === 'pineapple' ? 'tall' : c.id === 'watermelon' ? 'wide' : 'round'}
                facing={i % 2 === 0 ? 'left' : 'right'}
                label={c.name}
              />
              <span className="bf-roster-name">{c.name}</span>
              {c.source === 'just-desserts' && (
                <span className="bf-roster-badge">DLC</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
