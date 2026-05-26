import Phaser from 'phaser';
import type { PlayerEntity } from '../entities/Player';
import { POWER_UP_LABELS } from '../systems/PowerUpInventory';

export class DebugOverlay {
  private readonly graphics: Phaser.GameObjects.Graphics;
  private readonly labels: Phaser.GameObjects.Text[] = [];
  private enabled: boolean;

  constructor(private readonly scene: Phaser.Scene, enabled = false) {
    this.enabled = enabled;
    this.graphics = scene.add.graphics().setDepth(1000);
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    this.graphics.setVisible(enabled);
    for (const l of this.labels) l.setVisible(enabled);
  }

  update(players: PlayerEntity[]): void {
    this.graphics.clear();
    if (!this.enabled) return;

    for (const player of players) {
      if (!player.alive) continue;
      const x = player.body.position.x;
      const y = player.body.position.y;

      // Hitbox
      this.graphics.lineStyle(1, 0x00ff00, 0.8);
      this.graphics.strokeCircle(x, y, 20);

      // Velocity vector
      const vx = player.body.velocity.x;
      const vy = player.body.velocity.y;
      this.graphics.lineStyle(2, 0xffff00, 0.9);
      this.graphics.lineBetween(x, y, x + vx * 0.1, y + vy * 0.1);

      // Boomerang hitbox
      if (player.boomerang.body && player.boomerang.state !== 'held') {
        this.graphics.lineStyle(1, 0xff0000, 0.8);
        this.graphics.strokeRect(
          player.boomerang.body.position.x - 8,
          player.boomerang.body.position.y - 4,
          16,
          8,
        );
      }

      // State label
      let label = this.labels[player.id];
      if (!label) {
        label = this.scene.add.text(x, y - 40, '', {
          fontSize: '9px',
          color: '#0f0',
          backgroundColor: '#000000aa',
        }).setDepth(1001);
        this.labels[player.id] = label;
      }
      label.setText(player.getStateLabel());
      label.setPosition(x - 30, y - 45);
      label.setVisible(true);
    }
  }
}

export class HudOverlay {
  private readonly scene: Phaser.Scene;
  private timerText: Phaser.GameObjects.Text;
  private scoreTexts: Phaser.GameObjects.Text[] = [];
  private modeText: Phaser.GameObjects.Text;
  private powerUpTexts: Phaser.GameObjects.Text[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.timerText = scene.add.text(10, 10, '', { fontSize: '16px', color: '#fff' }).setDepth(999);
    this.modeText = scene.add.text(10, 30, '', { fontSize: '12px', color: '#aaa' }).setDepth(999);
  }

  update(
    roundTimerMs: number,
    modeLabel: string,
    players: PlayerEntity[],
  ): void {
    const sec = Math.ceil(roundTimerMs / 1000);
    this.timerText.setText(`⏱ ${sec}s`);
    this.modeText.setText(modeLabel);

    for (let i = 0; i < players.length; i++) {
      const p = players[i];
      if (!p) continue;
      let st = this.scoreTexts[i];
      if (!st) {
        st = this.scene.add.text(10, 55 + i * 18, '', {
          fontSize: '12px',
          color: '#fff',
        }).setDepth(999);
        this.scoreTexts[i] = st;
      }
      st.setText(`P${p.id + 1} ${p.kills}K ${p.isBot ? '(bot)' : ''}`);

      let pu = this.powerUpTexts[i];
      if (!pu) {
        pu = this.scene.add.text(800 - 150, 10 + i * 16, '', {
          fontSize: '10px',
          color: '#ffcc00',
        }).setDepth(999);
        this.powerUpTexts[i] = pu;
      }
      const icons = p.inventory.getAll().map((t) => POWER_UP_LABELS[t]?.slice(0, 3) ?? t).join(' ');
      pu.setText(icons);
    }
  }
}
