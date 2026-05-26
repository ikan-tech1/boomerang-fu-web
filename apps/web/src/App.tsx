import { useCallback, useEffect, useRef, useState } from 'react';
import { balance } from '@boomerang/content';
import { createGame, type GameModeId } from '@boomerang/game-core';
import type Phaser from 'phaser';
import {
  awardMatchXp,
  loadProfile,
  saveProfile,
  type PlayerProfile,
} from './progress/ProfileStore';

type Screen = 'menu' | 'lobby' | 'game';

export default function App() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [mode, setMode] = useState<GameModeId>('freeForAll');
  const [arenaId, setArenaId] = useState('kitchen-classic');
  const [debug, setDebug] = useState(true);
  const [characterId, setCharacterId] = useState('avocado');
  const [botCount, setBotCount] = useState(1);
  const [friendlyFire, setFriendlyFire] = useState(false);
  const [profile, setProfile] = useState<PlayerProfile | null>(null);

  useEffect(() => {
    loadProfile().then(setProfile);
  }, []);

  const onMatchEnd = useCallback(async (kills: number) => {
    const current = profile ?? (await loadProfile());
    const updated = awardMatchXp(current, kills);
    await saveProfile(updated);
    setProfile(updated);
  }, [profile]);

  return (
    <div className="bf-app">
      <header className="bf-header">
        <h1>Boomerang Fu Web</h1>
        {profile && (
          <span className="bf-xp-badge">
            Lv {profile.level} · {profile.xp} XP · {profile.matchesPlayed} matches
          </span>
        )}
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
                {balance.characters
                  .filter((c) => profile?.unlockedCharacters.includes(c.id) ?? true)
                  .map((c) => (
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
            {mode === 'teams' && (
              <label>
                <input
                  type="checkbox"
                  checked={friendlyFire}
                  onChange={(e) => setFriendlyFire(e.target.checked)}
                />
                Friendly Fire
              </label>
            )}
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
          <GameCanvas
            mode={mode}
            arenaId={arenaId}
            debug={debug}
            botCount={botCount}
            characterId={characterId}
            friendlyFire={friendlyFire}
            onMatchEnd={onMatchEnd}
            onExit={() => setScreen('lobby')}
          />
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
  botCount,
  characterId,
  friendlyFire,
  onMatchEnd,
  onExit,
}: {
  mode: GameModeId;
  arenaId: string;
  debug: boolean;
  botCount: number;
  characterId: string;
  friendlyFire: boolean;
  onMatchEnd: (kills: number) => void;
  onExit: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const awardedRef = useRef(false);

  const launch = useCallback(() => {
    if (!containerRef.current) return;
    gameRef.current?.destroy(true);
    awardedRef.current = false;
    const game = createGame(containerRef.current, {
      width: 960,
      height: 600,
      debug,
      mode,
      arenaId,
      botCount,
      characterId,
      friendlyFire,
    });
    game.events.on('round-end', (data: { players: { id: number; kills: number; isBot: boolean }[] }) => {
      if (awardedRef.current) return;
      awardedRef.current = true;
      const human = data.players.find((p) => !p.isBot);
      onMatchEnd(human?.kills ?? 0);
    });
    gameRef.current = game;
  }, [mode, arenaId, debug, botCount, characterId, friendlyFire, onMatchEnd]);

  useEffect(() => {
    launch();
    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [launch]);

  return (
    <div className="bf-game-container">
      <button type="button" className="bf-back-btn" onClick={onExit}>← Lobby</button>
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
