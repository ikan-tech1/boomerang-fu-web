import { Link } from 'react-router-dom';
import { TAGLINE } from './content';
import { GameButton } from './GameButton';
import { ArenaScene } from './ArenaScene';
import { GameLogo } from '../ui/GameLogo';
import { PlayerSlots } from '../ui/PlayerSlots';
import { TitleBackground } from '../ui/TitleBackground';

export function Hero() {
  return (
    <section className="bf-title-screen" aria-labelledby="title-heading">
      <TitleBackground variant="full" />

      <div className="bf-title-layout">
        <div className="bf-title-copy">
          <p className="bf-title-kicker">Fan recreation · Browser party brawler</p>

          <div id="title-heading">
            <GameLogo size="lg" />
          </div>

          <p className="bf-title-tagline">{TAGLINE}</p>

          <div className="bf-title-actions">
            <GameButton to="/play" variant="primary" size="lg">
              Play
            </GameButton>
            <GameButton href="#controls" variant="secondary" size="lg">
              Controls
            </GameButton>
          </div>

          <p className="bf-press-start" aria-hidden="true">
            <span className="bf-press-start-blink">Press Start</span>
          </p>

          <PlayerSlots />
        </div>

        <div className="bf-title-arena-wrap">
          <div className="bf-wood-frame">
            <div className="bf-panel" style={{ padding: 8, position: 'relative' }}>
              <ArenaScene theme="kitchen" showSliceFx showScorePop />
              <div className="bf-arena-hud">
                <span className="bf-arena-timer">1:42</span>
                <div className="bf-arena-kills">
                  <span style={{ background: '#568203' }}>4</span>
                  <span style={{ background: '#FFE135', color: '#3d3200' }}>3</span>
                  <span style={{ background: '#FF0800' }}>2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
