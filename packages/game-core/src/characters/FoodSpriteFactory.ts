import Phaser from 'phaser';

/** Six launch characters get extra silhouette + eye pass for couch readability */
const CORE_SILHOUETTE_IDS = new Set([
  'avocado',
  'banana',
  'apple',
  'orange',
  'watermelon',
  'pineapple',
]);

/** Procedural food silhouettes — distinct readable shapes per character id */
export function createFoodSprite(
  scene: Phaser.Scene,
  characterId: string,
  colorHex: number,
  radius: number,
): Phaser.GameObjects.Container {
  const g = scene.add.graphics();
  const draw = SHAPE_DRAWERS[characterId] ?? drawGenericFruit;

  if (CORE_SILHOUETTE_IDS.has(characterId)) {
    drawSilhouetteBody(g, colorHex, radius, () => draw(g, radius));
    addFacingEyes(g, radius);
  } else {
    g.fillStyle(colorHex, 1);
    g.lineStyle(2, 0xffffff, 1);
    draw(g, radius);
  }

  const container = scene.add.container(0, 0, [g]);
  container.setSize(radius * 2, radius * 2);
  return container;
}

/** Dark outer stroke so food reads at zoom-out / motion blur */
function drawSilhouetteBody(
  g: Phaser.GameObjects.Graphics,
  colorHex: number,
  radius: number,
  drawShape: () => void,
): void {
  g.lineStyle(Math.max(3, Math.round(radius * 0.22)), 0x14141f, 1);
  drawShape();
  g.fillStyle(colorHex, 1);
  drawShape();
  g.lineStyle(2, 0xffffff, 0.95);
  drawShape();
}

function addFacingEyes(g: Phaser.GameObjects.Graphics, r: number): void {
  const y = -r * 0.12;
  const spacing = r * 0.28;
  g.fillStyle(0x14141f, 1);
  g.fillCircle(-spacing, y, r * 0.14);
  g.fillCircle(spacing, y, r * 0.14);
  g.fillStyle(0xffffff, 1);
  g.fillCircle(-spacing + 1, y - 1, r * 0.06);
  g.fillCircle(spacing + 1, y - 1, r * 0.06);
}

type ShapeDrawer = (g: Phaser.GameObjects.Graphics, r: number) => void;

const drawGenericFruit: ShapeDrawer = (g, r) => {
  g.fillCircle(0, 0, r);
  g.strokeCircle(0, 0, r);
};

const drawAvocado: ShapeDrawer = (g, r) => {
  g.fillEllipse(0, 2, r * 1.1, r * 1.35);
  g.fillStyle(0x3d2817, 1);
  g.fillCircle(0, 0, r * 0.45);
  g.fillStyle(0x6b8e23, 1);
  g.fillCircle(0, -r * 1.15, r * 0.2);
};

const drawBanana: ShapeDrawer = (g, r) => {
  g.fillEllipse(-r * 0.15, 0, r * 1.55, r * 0.62);
  g.fillStyle(0x8b6914, 1);
  g.fillEllipse(-r * 0.95, -r * 0.05, r * 0.35, r * 0.2);
};

const drawApple: ShapeDrawer = (g, r) => {
  g.fillCircle(0, r * 0.1, r);
  g.fillStyle(0x228b22, 1);
  g.fillRect(-2, -r * 1.1, 4, r * 0.35);
  g.lineStyle(2, 0xffffff, 1);
  g.strokeCircle(0, r * 0.1, r);
};

const drawOrange: ShapeDrawer = (g, r) => {
  g.fillCircle(0, 0, r);
  g.lineStyle(1, 0xffcc66, 0.8);
  for (let i = -2; i <= 2; i++) {
    g.lineBetween(-r, i * 4, r, i * 4);
  }
  g.lineStyle(2, 0xffffff, 1);
  g.strokeCircle(0, 0, r);
};

const drawWatermelon: ShapeDrawer = (g, r) => {
  g.fillCircle(0, 0, r);
  g.lineStyle(3, 0x1a6b1a, 1);
  for (let i = -2; i <= 2; i++) {
    g.lineBetween(-r + 4, i * 6, r - 4, i * 6);
  }
  g.lineStyle(2, 0xffffff, 1);
  g.strokeCircle(0, 0, r);
};

const drawPineapple: ShapeDrawer = (g, r) => {
  g.fillRoundedRect(-r * 0.7, -r * 0.2, r * 1.4, r * 1.1, 6);
  g.lineStyle(1, 0xc4a035, 0.7);
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 3; col++) {
      g.strokeRect(-r * 0.55 + col * (r * 0.35), -r * 0.05 + row * (r * 0.22), r * 0.28, r * 0.18);
    }
  }
  g.fillStyle(0x2d6a2d, 1);
  g.fillTriangle(-r * 0.5, -r, 0, -r * 1.55, r * 0.5, -r);
};

const drawStrawberry: ShapeDrawer = (g, r) => {
  g.fillTriangle(0, r, -r * 0.85, -r * 0.3, r * 0.85, -r * 0.3);
  g.fillStyle(0x2d6a2d, 1);
  g.fillCircle(-r * 0.35, -r * 0.55, r * 0.22);
  g.fillCircle(0, -r * 0.7, r * 0.22);
  g.fillCircle(r * 0.35, -r * 0.55, r * 0.22);
  g.lineStyle(2, 0xffffff, 1);
  g.strokeTriangle(0, r, -r * 0.85, -r * 0.3, r * 0.85, -r * 0.3);
};

const drawCherry: ShapeDrawer = (g, r) => {
  g.fillCircle(-r * 0.45, r * 0.15, r * 0.55);
  g.fillCircle(r * 0.45, r * 0.15, r * 0.55);
  g.lineStyle(2, 0x4a3728, 1);
  g.lineBetween(-r * 0.45, -r * 0.35, r * 0.2, -r * 0.9);
  g.lineStyle(2, 0xffffff, 1);
  g.strokeCircle(-r * 0.45, r * 0.15, r * 0.55);
  g.strokeCircle(r * 0.45, r * 0.15, r * 0.55);
};

const drawLemon: ShapeDrawer = (g, r) => {
  g.fillEllipse(0, 0, r * 1.2, r * 0.85);
  g.strokeEllipse(0, 0, r * 1.2, r * 0.85);
};

const drawGrape: ShapeDrawer = (g, r) => {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3 - row; col++) {
      const ox = (col - 1) * r * 0.55 + row * 0.15;
      const oy = (row - 1) * r * 0.5;
      g.fillCircle(ox, oy, r * 0.38);
    }
  }
  g.lineStyle(2, 0xffffff, 1);
  g.strokeCircle(0, -r * 0.5, r * 0.35);
};

const drawCoconut: ShapeDrawer = (g, r) => {
  g.fillCircle(0, 0, r);
  g.fillStyle(0x3d2817, 1);
  g.fillCircle(-r * 0.25, -r * 0.15, r * 0.18);
  g.fillCircle(0, -r * 0.35, r * 0.18);
  g.fillCircle(r * 0.25, -r * 0.15, r * 0.18);
  g.lineStyle(2, 0xffffff, 1);
  g.strokeCircle(0, 0, r);
};

const drawPeach: ShapeDrawer = (g, r) => {
  g.fillCircle(0, r * 0.05, r);
  g.lineStyle(2, 0xcc8866, 1);
  g.lineBetween(0, -r, 0, r * 0.3);
  g.lineStyle(2, 0xffffff, 1);
  g.strokeCircle(0, r * 0.05, r);
};

const drawDonut: ShapeDrawer = (g, r) => {
  g.fillCircle(0, 0, r);
  g.fillStyle(0x1a1a2e, 1);
  g.fillCircle(0, 0, r * 0.45);
  g.fillStyle(0xff69b4, 1);
  g.fillRect(-r, -r * 0.15, r * 2, r * 0.3);
  g.lineStyle(2, 0xffffff, 1);
  g.strokeCircle(0, 0, r);
};

const drawCupcake: ShapeDrawer = (g, r) => {
  g.fillTriangle(0, r * 0.9, -r * 0.75, r * 0.1, r * 0.75, r * 0.1);
  g.fillCircle(0, -r * 0.35, r * 0.75);
  g.lineStyle(2, 0xffffff, 1);
  g.strokeCircle(0, -r * 0.35, r * 0.75);
};

const drawCookie: ShapeDrawer = (g, r) => {
  g.fillCircle(0, 0, r);
  g.fillStyle(0x3d2817, 1);
  for (const [x, y] of [[-6, -4], [5, 2], [-3, 6], [7, -5]] as const) {
    g.fillCircle(x, y, 3);
  }
  g.lineStyle(2, 0xffffff, 1);
  g.strokeCircle(0, 0, r);
};

const drawIcecream: ShapeDrawer = (g, r) => {
  g.fillTriangle(0, r, -r * 0.55, r * 0.15, r * 0.55, r * 0.15);
  g.fillCircle(0, -r * 0.4, r * 0.65);
  g.strokeCircle(0, -r * 0.4, r * 0.65);
};

const drawPopsicle: ShapeDrawer = (g, r) => {
  g.fillRoundedRect(-r * 0.45, -r * 0.9, r * 0.9, r * 1.35, 8);
  g.fillStyle(0xc4a484, 1);
  g.fillRect(-r * 0.12, r * 0.35, r * 0.24, r * 0.55);
  g.lineStyle(2, 0xffffff, 1);
  g.strokeRoundedRect(-r * 0.45, -r * 0.9, r * 0.9, r * 1.35, 8);
};

const drawCake: ShapeDrawer = (g, r) => {
  g.fillRect(-r * 0.85, -r * 0.15, r * 1.7, r * 0.85);
  g.fillRect(-r * 0.65, -r * 0.75, r * 1.3, r * 0.65);
  g.lineStyle(2, 0xffffff, 1);
  g.strokeRect(-r * 0.85, -r * 0.15, r * 1.7, r * 0.85);
};

const drawMuffin: ShapeDrawer = (g, r) => {
  g.fillRect(-r * 0.65, r * 0.05, r * 1.3, r * 0.65);
  g.fillCircle(0, -r * 0.25, r * 0.85);
  g.strokeCircle(0, -r * 0.25, r * 0.85);
};

const drawPie: ShapeDrawer = (g, r) => {
  g.fillTriangle(0, -r * 0.85, -r, r * 0.5, r, r * 0.5);
  g.lineStyle(2, 0xffffff, 1);
  g.strokeTriangle(0, -r * 0.85, -r, r * 0.5, r, r * 0.5);
};

const SHAPE_DRAWERS: Record<string, ShapeDrawer> = {
  avocado: drawAvocado,
  banana: drawBanana,
  apple: drawApple,
  orange: drawOrange,
  watermelon: drawWatermelon,
  pineapple: drawPineapple,
  strawberry: drawStrawberry,
  cherry: drawCherry,
  lemon: drawLemon,
  grape: drawGrape,
  coconut: drawCoconut,
  peach: drawPeach,
  donut: drawDonut,
  cupcake: drawCupcake,
  cookie: drawCookie,
  icecream: drawIcecream,
  popsicle: drawPopsicle,
  cake: drawCake,
  muffin: drawMuffin,
  pie: drawPie,
};
