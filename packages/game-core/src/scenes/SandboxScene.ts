import { balance } from '@boomerang/content';
import Phaser from 'phaser';
import { BotBrain } from '../ai/BotBrain';
import { arenaLoader, TrapSystem } from '../arena/ArenaLoader';
import { DebugOverlay, HudOverlay } from '../debug/DebugOverlay';
import { PlayerEntity } from '../entities/Player';
import { LocalInputMux } from '../input/LocalInputMux';
import { GameModeManager, type GameModeId } from '../modes/GameModeManager';
import { BattleRoyaleZone } from '../systems/BattleRoyaleZone';
import { applyHitPowerUps, PowerUpSystem } from '../systems/PowerUpSystem';
import { TelekinesisSystem } from '../systems/TelekinesisSystem';

interface SandboxSceneData {
  debug?: boolean;
  mode?: GameModeId;
  arenaId?: string;
  botCount?: number;
  characterId?: string;
  friendlyFire?: boolean;
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
  private telekinesisSystem = new TelekinesisSystem();
  private battleRoyaleZone!: BattleRoyaleZone;
  private debug = false;
  private hitstopTimer = 0;
  private arenaId = 'kitchen-classic';
  private launchCharacterId = 'avocado';
  private launchBotCount = 1;

  constructor() {
    super({ key: 'SandboxScene' });
  }

  init(data: SandboxSceneData): void {
    const opts = { ...this.game.registry.get('launchOptions'), ...data } as SandboxSceneData;
    this.debug = opts.debug ?? false;
    this.arenaId = opts.arenaId ?? 'kitchen-classic';
    this.launchCharacterId = opts.characterId ?? 'avocado';
    this.launchBotCount = opts.botCount ?? 1;
    this.modeManager = new GameModeManager(opts.mode ?? 'freeForAll', {
      friendlyFire: opts.friendlyFire ?? false,
    });
  }

  create(data: SandboxSceneData): void {
    const opts = { ...this.game.registry.get('launchOptions'), ...data } as SandboxSceneData;
    const arena = arenaLoader.load(opts.arenaId ?? this.arenaId);
    this.arenaBounds = { w: arena.width, h: arena.height };

    this.matter.world.setBounds(20, 20, arena.width - 40, arena.height - 40, 32, true, true, true, true);

    this.trapSystem = new TrapSystem(this);
    this.trapSystem.loadArena(arena);

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
      for (const player of this.players) {
        player.disguised = true;
      }
    }

    this.modeManager.startRound();

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
      this.bots.set(id, new BotBrain(player));
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

    for (const player of this.players) {
      if (player.isBot) {
        const bot = this.bots.get(player.id);
        if (bot && player.alive) {
          const buttons = bot.update(dt, this.players);
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
        const spawn = arena.spawnPoints[player.id % arena.spawnPoints.length];
        player.respawn(spawn?.x ?? 400, spawn?.y ?? 300);
        if (this.modeManager.mode === 'hideAndSeek' && this.modeManager.state.hidePhase) {
          player.disguised = true;
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
