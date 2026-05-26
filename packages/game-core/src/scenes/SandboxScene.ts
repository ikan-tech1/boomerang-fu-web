import { balance } from '@boomerang/content';
import Phaser from 'phaser';
import { BotBrain, type BotDifficulty } from '../ai/BotBrain';
import { arenaLoader, TrapSystem } from '../arena/ArenaLoader';
import { PropDisguiseSystem } from '../systems/PropDisguiseSystem';
import { DebugOverlay, HudOverlay } from '../debug/DebugOverlay';
import { PlayerEntity } from '../entities/Player';
import { LocalInputMux } from '../input/LocalInputMux';
import { GameModeManager, type GameModeId } from '../modes/GameModeManager';
import { BattleRoyaleZone } from '../systems/BattleRoyaleZone';
import { applyHitPowerUps, PowerUpSystem } from '../systems/PowerUpSystem';
import { TelekinesisSystem } from '../systems/TelekinesisSystem';
import { audioManager } from '../audio/AudioManager';
import { OnlineSyncController } from '../net/OnlineSyncController';
import type { OnlineSyncBridge } from '../net/OnlineSyncController';

interface SandboxSceneData {
  debug?: boolean;
  mode?: GameModeId;
  arenaId?: string;
  botCount?: number;
  botDifficulty?: BotDifficulty;
  characterId?: string;
  friendlyFire?: boolean;
  shieldsForLosers?: boolean;
  onlineBridge?: OnlineSyncBridge;
  localPlayerId?: number;
}

const CHARACTER_ROTATION = [
  'avocado', 'banana', 'apple', 'orange', 'watermelon', 'pineapple',
  'strawberry', 'cherry', 'lemon', 'grape', 'coconut', 'peach',
];

export class SandboxScene extends Phaser.Scene {
  players: PlayerEntity[] = [];
  arenaBounds = { w: 800, h: 600 };

  private debugOverlay!: DebugOverlay;
  private hud!: HudOverlay;
  private inputMux = new LocalInputMux();
  private bots = new Map<number, BotBrain>();
  private modeManager!: GameModeManager;
  private powerUpSystem!: PowerUpSystem;
  private trapSystem!: TrapSystem;
  private propDisguiseSystem!: PropDisguiseSystem;
  private currentArena = arenaLoader.load('kitchen-classic');
  private telekinesisSystem = new TelekinesisSystem();
  private battleRoyaleZone!: BattleRoyaleZone;
  private debug = false;
  private hitstopTimer = 0;
  private arenaId = 'kitchen-classic';
  private launchCharacterId = 'avocado';
  private launchBotCount = 1;
  private botDifficulty: BotDifficulty = 'medium';
  private onlineBridge: OnlineSyncBridge | null = null;
  private onlineSync: OnlineSyncController | null = null;
  private localPlayerId = 0;
  private lastServerState: unknown = null;

  constructor() {
    super({ key: 'SandboxScene' });
  }

  init(data: SandboxSceneData): void {
    const opts = { ...this.game.registry.get('launchOptions'), ...data } as SandboxSceneData;
    this.debug = opts.debug ?? false;
    this.arenaId = opts.arenaId ?? 'kitchen-classic';
    this.launchCharacterId = opts.characterId ?? 'avocado';
    this.launchBotCount = opts.botCount ?? 1;
    this.botDifficulty = opts.botDifficulty ?? 'medium';
    this.onlineBridge = opts.onlineBridge ?? null;
    this.localPlayerId = opts.localPlayerId ?? 0;
    this.modeManager = new GameModeManager(opts.mode ?? 'freeForAll', {
      friendlyFire: opts.friendlyFire ?? false,
    });
    if (this.onlineBridge) {
      this.onlineSync = new OnlineSyncController(this.onlineBridge);
      this.onlineBridge.onStateChange((state) => {
        this.lastServerState = state;
      });
    }
  }

  create(data: SandboxSceneData): void {
    const opts = { ...this.game.registry.get('launchOptions'), ...data } as SandboxSceneData;
    const arena = arenaLoader.load(opts.arenaId ?? this.arenaId);
    this.currentArena = arena;
    this.arenaBounds = { w: arena.width, h: arena.height };

    this.matter.world.setBounds(20, 20, arena.width - 40, arena.height - 40, 32, true, true, true, true);

    this.trapSystem = new TrapSystem(this);
    this.trapSystem.loadArena(arena);
    this.propDisguiseSystem = new PropDisguiseSystem(this);
    this.propDisguiseSystem.loadArena(arena);

    this.battleRoyaleZone = new BattleRoyaleZone(this, this.arenaBounds);
    this.powerUpSystem = new PowerUpSystem(this, () => this.battleRoyaleZone.activate());
    this.debugOverlay = new DebugOverlay(this, this.debug);
    this.hud = new HudOverlay(this);

    const spawns = arena.spawnPoints;
    const totalPlayers = Math.min(
      balance.match.maxPlayers,
      1 + Math.max(0, opts.botCount ?? this.launchBotCount),
    );

    for (let i = 0; i < totalPlayers; i++) {
      const isBot = i > 0;
      const characterId = isBot
        ? CHARACTER_ROTATION[i % CHARACTER_ROTATION.length] ?? 'banana'
        : (opts.characterId ?? this.launchCharacterId);
      const team = this.modeManager.mode === 'teams' ? i % 2 : undefined;
      const spawn = spawns[i % spawns.length];
      this.spawnPlayer(
        i,
        characterId,
        spawn?.x ?? 150 + i * 80,
        spawn?.y ?? 300,
        isBot,
        team,
      );
    }

    if (this.modeManager.mode === 'hideAndSeek') {
      const seeker = this.players[0];
      if (seeker) {
        seeker.isSeeker = true;
        seeker.disguised = false;
        seeker.label.setText('SEEK');
        seeker.label.setColor('#ff4444');
      }
      for (const player of this.players) {
        if (player.isSeeker) continue;
        player.disguised = true;
        this.propDisguiseSystem.assignRandomPropType(player, arena);
        player.tryMatchDisguise = () => {
          if (this.propDisguiseSystem.tryMatchProp(player)) {
            audioManager.play('disguise_match');
          }
        };
      }
    }

    this.modeManager.startRound();
    audioManager.playMusic('menu');

    this.add.text(arena.width / 2, arena.height - 15, arena.name, {
      fontSize: '11px',
      color: '#888',
    }).setOrigin(0.5);

    if (this.debug) {
      this.add.text(10, arena.height - 20, '[D] toggle debug overlay', {
        fontSize: '10px',
        color: '#666',
      });
    }

    this.input.keyboard?.on('keydown-D', () => {
      this.debug = !this.debug;
      this.debugOverlay.setEnabled(this.debug);
    });

    this.input.keyboard?.on('keydown-F', () => {
      if (this.modeManager.mode !== 'hideAndSeek' || !this.modeManager.state.hidePhase) return;
      const human = this.players.find((p) => !p.isBot);
      if (human?.tryMatchDisguise) human.tryMatchDisguise();
    });
  }

  private spawnPlayer(
    id: number,
    characterId: string,
    x: number,
    y: number,
    isBot: boolean,
    team?: number,
  ): void {
    const player = new PlayerEntity(this, this.matter, {
      id,
      characterId,
      x,
      y,
      isBot,
      team,
    });
    this.players.push(player);
    if (isBot) {
      this.bots.set(id, new BotBrain(player, this.botDifficulty));
    }
  }

  override update(_time: number, delta: number): void {
    if (this.hitstopTimer > 0) {
      this.hitstopTimer -= delta;
      return;
    }

    const dt = delta;
    this.modeManager.update(dt);
    this.trapSystem.update(dt);
    this.telekinesisSystem.update(this.players);
    this.battleRoyaleZone.update(dt, this.players);
    this.powerUpSystem.update(dt, this.players);

    if (this.modeManager.shouldSpawnGoldenPickup()) {
      this.trySpawnGoldenPickup();
    }

    const humanCount = this.players.filter((p) => !p.isBot).length || 1;
    const inputs = this.inputMux.poll(Math.max(humanCount, 1));

    if (this.onlineSync && this.onlineBridge) {
      const human = this.players.find((p) => p.id === this.localPlayerId) ?? this.players[0];
      const input = inputs.find((i) => i.playerId === (human?.id ?? 0)) ?? inputs[0];
      if (human && input) {
        human.setMovement(input.moveX, input.moveY, input.aimX, input.aimY);
        this.onlineSync.pollLocalInput(human.id, input.moveX, input.moveY, input.aimX, input.aimY, input.buttons);
      }
      if (this.lastServerState) {
        const snaps = this.onlineSync.parseSnapshots(this.lastServerState);
        this.onlineSync.syncRemotePlayers(this.players, snaps);
        const localSnap = snaps.find((s) => s.sessionKey === this.onlineBridge?.getLocalSessionId());
        if (localSnap && human) {
          this.onlineSync.syncLocalPlayer(human, localSnap);
        }
      }
    }

    for (const player of this.players) {
      if (this.onlineSync && !player.isBot && player.id === this.localPlayerId) {
        player.applyInput({ dash: false, melee: false, throw: false, throwHeld: false, recall: false }, dt);
        player.update(dt, (attacker, target) => this.onMeleeHit(attacker, target));
        continue;
      }
      if (this.onlineSync && player.isBot) {
        continue;
      }
      if (player.isBot) {
        const bot = this.bots.get(player.id);
        if (bot && player.alive) {
          const buttons = bot.update(dt, this.players, this.modeManager.mode);
          player.applyInput(buttons, dt);
        }
      } else {
        const input = inputs.find((i) => i.playerId === player.id);
        if (input) {
          player.setMovement(input.moveX, input.moveY, input.aimX, input.aimY);
          player.applyInput(input.buttons, dt);
        }
      }

      player.update(dt, (attacker, target) => this.onMeleeHit(attacker, target));
    }

    this.checkBoomerangHits();
    this.handleRespawns();

    this.debugOverlay.update(this.players);
    this.hud.update(this.modeManager, this.players);

    if (this.modeManager.isRoundOver()) {
      this.showRoundEnd();
    }
  }

  private trySpawnGoldenPickup(): void {
    const scene = this as Phaser.Scene & { _goldenSpawned?: boolean };
    if (scene._goldenSpawned) return;
    scene._goldenSpawned = true;
    for (const player of this.players) {
      if (player.alive && !player.hasGoldenBoomerang) {
        player.addPowerUp('golden');
        player.hasGoldenBoomerang = true;
        break;
      }
    }
  }

  private checkBoomerangHits(): void {
    if (this.modeManager.mode === 'hideAndSeek' && this.modeManager.state.hidePhase) return;

    for (const attacker of this.players) {
      if (!attacker.alive || attacker.boomerang.state === 'held') continue;
      for (const victim of this.players) {
        if (victim.id === attacker.id || !victim.alive) continue;
        if (this.modeManager.canFriendlyFire(attacker.team, victim.team)) continue;
        if (victim.isInvulnerable()) continue;
        if (!attacker.boomerang.checkHit(victim)) continue;

        applyHitPowerUps(attacker, victim, this, this.modeManager.canScoreKill());
        if (!victim.alive) {
          this.hitstopTimer = balance.combat.hitstopMs;
        }
      }
    }
  }

  private onMeleeHit(attacker: PlayerEntity, target: PlayerEntity): void {
    if (this.modeManager.mode === 'hideAndSeek' && this.modeManager.state.hidePhase) return;
    if (this.modeManager.canFriendlyFire(attacker.team, target.team)) return;
    target.takeHit(attacker, 'melee', { countKill: this.modeManager.canScoreKill() });
    this.hitstopTimer = balance.combat.hitstopMs;
  }

  private handleRespawns(): void {
    const arena = arenaLoader.load(this.arenaId);
    for (const player of this.players) {
      if (!player.alive && player.respawnTimer <= 0) {
        if (this.modeManager.mode === 'teams' && player.teamRevivesLeft <= 0) continue;
        if (this.modeManager.mode === 'teams') player.teamRevivesLeft -= 1;
        const spawn = arena.spawnPoints[player.id % arena.spawnPoints.length];
        player.respawn(spawn?.x ?? 400, spawn?.y ?? 300);
        if (this.modeManager.mode === 'hideAndSeek' && this.modeManager.state.hidePhase && !player.isSeeker) {
          player.disguised = true;
          this.propDisguiseSystem.assignRandomPropType(player, this.currentArena);
        }
      }
    }
  }

  private roundEnded = false;
  private showRoundEnd(): void {
    if (this.roundEnded) return;
    this.roundEnded = true;
    const label = this.modeManager.getWinnerLabel(this.players);
    this.add
      .text(this.arenaBounds.w / 2, this.arenaBounds.h / 2, `Round Over!\n${label}`, {
        fontSize: '24px',
        color: '#fff',
        align: 'center',
        backgroundColor: '#000000cc',
        padding: { x: 16, y: 8 },
      })
      .setOrigin(0.5)
      .setDepth(2000);

    this.game.events.emit('round-end', {
      winner: label,
      players: this.players.map((p) => ({
        id: p.id,
        kills: p.kills,
        isBot: p.isBot,
      })),
    });
  }
}
