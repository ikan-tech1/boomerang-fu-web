import { GameButton } from './GameButton';
import { ArenaScene } from './ArenaScene';

export function TrailerSection() {
  return (
    <section className="bf-panel-section bf-attract-mode" aria-labelledby="attract-title">
      <div className="bf-wood-frame bf-panel">
        <header className="bf-panel-header">
          <h2 id="attract-title">Attract Mode</h2>
          <p>Fast rounds, bouncing boomerangs, instant eliminations — no download required.</p>
        </header>
        <div className="bf-attract-frame">
          <ArenaScene theme="grass" showSliceFx showScorePop />
          <div className="bf-attract-overlay">
            <GameButton to="/play" variant="primary" size="lg">
              Play Now
            </GameButton>
          </div>
        </div>
      </div>
    </section>
  );
}
