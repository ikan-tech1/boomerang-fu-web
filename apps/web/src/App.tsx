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
import { getColyseusEndpoint, OnlineClient, type OnlineSyncBridge } from './net/OnlineClient';

type BotDifficulty = 'easy' | 'medium' | 'hard';

type Screen = 'menu' | 'lobby' | 'game';

export default function App() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [mode, setMode] = useState<GameModeId>('freeForAll');
  const [arenaId, setArenaId] = useState('kitchen-classic');
  const [debug, setDebug] = useState(true);
  const [characterId, setCharacterId] = useState('avocado');
  const [botCount, setBotCount] = useState(1);
  const [botDifficulty, setBotDifficulty] = useState<BotDifficulty>('medium');
  const [friendlyFire, setFriendlyFire] = useState(false);
  const [shieldsForLosers, setShieldsForLosers] = useState(false);
  const [powerUpRate, setPowerUpRate] = useState(1);
  const onlineClientRef = useRef<OnlineClient | null>(null);
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [onlineCode, setOnlineCode] = useState('');
  const [onlineStatus, setOnlineStatus] = useState('');

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
            <label>
              Bot difficulty
              <select value={botDifficulty} onChange={(e) => setBotDifficulty(e.target.value as BotDifficulty)}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </label>
            <label>
              Power-up rate: {powerUpRate.toFixed(1)}×
              <input
                type="range"
                min={0.5}
                max={2}
                step={0.1}
                value={powerUpRate}
                onChange={(e) => setPowerUpRate(Number(e.target.value))}
              />
            </label>
            <label>
              <input
                type="checkbox"
                checked={shieldsForLosers}
                onChange={(e) => setShieldsForLosers(e.target.checked)}
              />
              Shields for losers
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
            <div className="bf-online-panel">
              <strong>Online (Colyseus)</strong>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      if (!onlineClientRef.current) onlineClientRef.current = new OnlineClient();
                      const info = await onlineClientRef.current.connect(getColyseusEndpoint(), { mode, arenaId, characterId });
                      setOnlineCode(info.roomCode);
                      setOnlineStatus(`Host room ${info.roomCode} · ${getColyseusEndpoint()}`);
                    } catch (e) {
                      setOnlineStatus(e instanceof Error ? e.message : 'Connect failed');
                    }
                  }}
                >
                  Host
                </button>
                <input
                  placeholder="Room code"
                  value={onlineCode}
                  onChange={(e) => setOnlineCode(e.target.value.toUpperCase())}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      if (!onlineClientRef.current) onlineClientRef.current = new OnlineClient();
                      const info = await onlineClientRef.current.joinByCode(getColyseusEndpoint(), onlineCode, { characterId });
                      setOnlineStatus(`Joined ${info.roomCode} · ${getColyseusEndpoint()}`);
                    } catch (e) {
                      setOnlineStatus(e instanceof Error ? e.message : 'Join failed');
                    }
                  }}
                >
                  Join
                </button>
              </div>
              {onlineStatus && <p style={{ fontSize: 12, color: '#8af' }}>{onlineStatus}</p>}
            </div>
            <div className="bf-controls-help">
              <strong>P1 Controls</strong><br />
              WASD move · Shift dash · E melee<br />
              Space throw · R recall · F match prop (Hide)<br />
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
            botDifficulty={botDifficulty}
            characterId={characterId}
            friendlyFire={friendlyFire}
            onlineBridge={onlineClientRef.current?.connected ? onlineClientRef.current : undefined}
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
  botDifficulty,
  characterId,
  friendlyFire,
  onlineBridge,
  onMatchEnd,
  onExit,
}: {
  mode: GameModeId;
  arenaId: string;
  debug: boolean;
  botCount: number;
  botDifficulty: BotDifficulty;
  characterId: string;
  friendlyFire: boolean;
  onlineBridge?: OnlineSyncBridge;
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
      botCount: onlineBridge ? 0 : botCount,
      botDifficulty,
      characterId,
      friendlyFire,
      onlineBridge,
      localPlayerId: 0,
    });
    game.events.on('round-end', (data: { players: { id: number; kills: number; isBot: boolean }[] }) => {
      if (awardedRef.current) return;
      awardedRef.current = true;
      const human = data.players.find((p) => !p.isBot);
      onMatchEnd(human?.kills ?? 0);
    });
    gameRef.current = game;
  }, [mode, arenaId, debug, botCount, botDifficulty, characterId, friendlyFire, onlineBridge, onMatchEnd]);

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
