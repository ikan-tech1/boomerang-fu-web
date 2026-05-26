import { useCallback, useEffect, useRef, useState } from 'react';
import { balance } from '@boomerang/content';
import { createGame, type GameModeId } from '@boomerang/game-core';
import type Phaser from 'phaser';

type Screen = 'menu' | 'lobby' | 'game';

export default function App() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [mode, setMode] = useState<GameModeId>('freeForAll');
  const [arenaId, setArenaId] = useState('kitchen-classic');
  const [debug, setDebug] = useState(true);
  const [characterId, setCharacterId] = useState('avocado');
  const [botCount, setBotCount] = useState(1);
  const [friendlyFire, setFriendlyFire] = useState(false);

  return (
    <div className="bf-app">
      <header className="bf-header">
        <h1>Boomerang Fu Web</h1>
        <nav className="bf-nav">
          <button className={screen === 'menu' ? 'active' : ''} onClick={() => setScreen('menu')}>
            Menu
          </button>
          <button className={screen === 'lobby' ? 'active' : ''} onClick={() => setScreen('lobby')}>
            Lobby
          </button>
          <button className={screen === 'game' ? 'active' : ''} onClick={() => setScreen('game')}>
            Play
          </button>
        </nav>
      </header>

      {screen === 'menu' && (
        <MenuScreen onSelectMode={(m) => { setMode(m); setScreen('lobby'); }} />
      )}

      {screen === 'lobby' && (
        <div className="bf-main">
          <aside className="bf-sidebar">
            <h2>Mode: {modeLabel(mode)}</h2>
            <label>
              Arena
              <select value={arenaId} onChange={(e) => setArenaId(e.target.value)}>
                {balance.arenas.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </label>
            <label>
              Character
              <div className="bf-char-grid">
                {balance.characters.slice(0, 12).map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`bf-char-btn ${characterId === c.id ? 'selected' : ''}`}
                    style={{ background: c.color }}
                    onClick={() => setCharacterId(c.id)}
                  >
                    {c.name.slice(0, 5)}
                  </button>
                ))}
              </div>
            </label>
            <label>
              Bots: {botCount}
              <input
                type="range"
                min={0}
                max={5}
                value={botCount}
                onChange={(e) => setBotCount(Number(e.target.value))}
              />
            </label>
            <label>
              <input
                type="checkbox"
                checked={friendlyFire}
                onChange={(e) => setFriendlyFire(e.target.checked)}
              />
              Friendly Fire
            </label>
            <label>
              <input type="checkbox" checked={debug} onChange={(e) => setDebug(e.target.checked)} />
              Debug Overlay
            </label>
            <div className="bf-controls-help">
              <strong>P1 Controls</strong><br />
              WASD move · Shift dash · E melee<br />
              Space throw · R recall<br />
              D toggle debug in-game
            </div>
            <button
              style={{ marginTop: 16, width: '100%', padding: 10 }}
              onClick={() => setScreen('game')}
            >
              Start Match
            </button>
          </aside>
          <div className="bf-game-container">
            <p style={{ color: '#666' }}>Configure match in sidebar, then press Start Match</p>
          </div>
        </div>
      )}

      {screen === 'game' && (
        <div className="bf-main">
          <GameCanvas mode={mode} arenaId={arenaId} debug={debug} />
        </div>
      )}
    </div>
  );
}

function MenuScreen({ onSelectMode }: { onSelectMode: (mode: GameModeId) => void }) {
  const modes: GameModeId[] = ['freeForAll', 'teams', 'goldenBoomerang', 'hideAndSeek'];
  return (
    <div className="bf-screen-menu">
      <h2>Select Game Mode</h2>
      {modes.map((m) => (
        <button key={m} onClick={() => onSelectMode(m)}>{modeLabel(m)}</button>
      ))}
    </div>
  );
}

function GameCanvas({
  mode,
  arenaId,
  debug,
}: {
  mode: GameModeId;
  arenaId: string;
  debug: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  const launch = useCallback(() => {
    if (!containerRef.current) return;
    gameRef.current?.destroy(true);
    gameRef.current = createGame(containerRef.current, {
      width: 960,
      height: 600,
      debug,
      mode,
      arenaId,
    });
  }, [mode, arenaId, debug]);

  useEffect(() => {
    launch();
    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [launch]);

  return (
    <div className="bf-game-container">
      <div ref={containerRef} data-testid="game-canvas" />
    </div>
  );
}

function modeLabel(mode: GameModeId): string {
  const labels: Record<GameModeId, string> = {
    freeForAll: 'Free-for-All',
    teams: 'Teams',
    goldenBoomerang: 'Golden Boomerang',
    hideAndSeek: 'Hide & Seek',
  };
  return labels[mode];
}
