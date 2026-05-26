# Boomerang Fu Web Recreation

Faithful web recreation of Boomerang Fu (Cranky Watermelon) with recreated assets and reference-driven tuning.

## Quick Start

```bash
pnpm install
pnpm dev
```

Open http://localhost:5173

## Project Structure

```
apps/web/           Vite + React client shell
apps/server/        Colyseus multiplayer stub
packages/game-core/ Phaser 3 + Matter.js game engine
packages/netcode/   Input frame types
packages/content/   balance.json + schemas
tools/arena-validator/ Arena validation CLI
docs/reference/     Parity specification
```

## Controls (P1)

| Action | Key |
|--------|-----|
| Move | WASD |
| Dash | Shift |
| Melee | E |
| Throw | Space (hold to charge) |
| Recall | R |
| Debug toggle | D |

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start web dev server |
| `pnpm build` | Build all packages |
| `pnpm typecheck` | TypeScript check |
| `pnpm server` | Start Colyseus server |
| `pnpm test:e2e` | Playwright smoke tests |

## License

Fan recreation project. Original Boomerang Fu © Cranky Watermelon.
