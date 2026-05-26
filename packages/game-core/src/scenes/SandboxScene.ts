import { balance } from '@boomerang/content';
import Phaser from 'phaser';
import { BotBrain } from '../ai/BotBrain';
import { arenaLoader, TrapSystem } from '../arena/ArenaLoader';
import { DebugOverlay, HudOverlay } from '../debug/DebugOverlay';
import { PlayerEntity } from '../entities/Player';
import { LocalInputMux } from '../input/LocalInputMux';
import { GameModeManager, type GameModeId } from '../modes/GameModeManager';
import { applyHitPowerUps, PowerUpSystem } from '../systems/PowerUpSystem';

interface SandboxSceneData {
  debug?: boolean;
  mode?: GameModeId;
  arenaId?: string;
}

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
  private debug = false;
  private hitstopTimer = 0;

  constructor() {
    super({ key: 'SandboxScene' });
  }

  init(data: SandboxSceneData): void {
    const opts = { ...this.game.registry.get('launchOptions'), ...data } as SandboxSceneData;
    this.debug = opts.debug ?? false;
    this.modeManager = new GameModeManager(opts.mode ?? 'freeForAll');
  }

  create(data: SandboxSceneData): void {
    const opts = { ...this.game.registry.get('launchOptions'), ...data } as SandboxSceneData;
    const arena = arenaLoader.load(opts.arenaId ?? 'kitchen-classic');
    this.arenaBounds = { w: arena.width, h: arena.height };

    // Walls
    this.matter.world.setBounds(20, 20, arena.width - 40, arena.height - 40, 32, true, true, true, true);

    this.trapSystem = new TrapSystem(this);
    this.trapSystem.loadArena(arena);

    this.powerUpSystem = new PowerUpSystem(this);
    this.debugOverlay = new DebugOverlay(this, this.debug);
    this.hud = new HudOverlay(this);

    // Spawn human + bot
    const spawns = arena.spawnPoints;
    this.spawnPlayer(0, 'avocado', spawns[0]?.x ?? 150, spawns[0]?.y ?? 300, false, 0);
    this.spawnPlayer(1, 'banana', spawns[1]?.x ?? 650, spawns[1]?.y ?? 300, true, 1);

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
    this.powerUpSystem.update(dt, this.players);

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
    this.hud.update(this.modeManager.state.roundTimerMs, this.modeManager.getModeLabel(), this.players);

    if (this.modeManager.isRoundOver()) {
      this.showRoundEnd();
    }
  }

  private checkBoomerangHits(): void {
    for (const attacker of this.players) {
      if (!attacker.alive || attacker.boomerang.state === 'held') continue;
      for (const victim of this.players) {
        if (victim.id === attacker.id || !victim.alive) continue;
        if (this.modeManager.canFriendlyFire(attacker.team, victim.team)) continue;
        if (victim.isInvulnerable()) continue;
        if (!attacker.boomerang.checkHit(victim)) continue;

        applyHitPowerUps(attacker, victim, this);
        if (!victim.alive) {
          this.hitstopTimer = balance.combat.hitstopMs;
        }
      }
    }
  }

  private onMeleeHit(attacker: PlayerEntity, target: PlayerEntity): void {
    if (this.modeManager.canFriendlyFire(attacker.team, target.team)) return;
    target.takeHit(attacker, 'melee');
    this.hitstopTimer = balance.combat.hitstopMs;
  }

  private handleRespawns(): void {
    const arena = arenaLoader.load('kitchen-classic');
    for (const player of this.players) {
      if (!player.alive && player.respawnTimer <= 0) {
        const spawn = arena.spawnPoints[player.id % arena.spawnPoints.length];
        player.respawn(spawn?.x ?? 400, spawn?.y ?? 300);
      }
    }
  }

  private roundEnded = false;
  private showRoundEnd(): void {
    if (this.roundEnded) return;
    this.roundEnded = true;
    const sorted = [...this.players].sort((a, b) => b.kills - a.kills);
    const winner = sorted[0];
    this.add
      .text(this.arenaBounds.w / 2, this.arenaBounds.h / 2, `Round Over!\nP${(winner?.id ?? 0) + 1} wins`, {
        fontSize: '24px',
        color: '#fff',
        align: 'center',
        backgroundColor: '#000000cc',
        padding: { x: 16, y: 8 },
      })
      .setOrigin(0.5)
      .setDepth(2000);
  }
}
