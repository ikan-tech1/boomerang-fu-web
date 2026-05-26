# UI Wireframes Notes

> Menu flow matching original game. React shell in `apps/web`.

## Screen Flow

```
Main Menu
├── Play → Mode Select
│   ├── Free-for-All
│   ├── Teams
│   ├── Golden Boomerang
│   └── Hide & Seek
├── Settings
└── Credits

Mode Select → Player Slots (1-6, bot fill)
           → Character Select (per slot)
           → Rules Editor (optional)
           → Map Select
           → Loading → Game Canvas

Post-Round → Scoreboard → XP Bar → Unlock Popup → Rematch / Menu
```

## Main Menu

- Logo / title (working title: "Boomerang Fu Web Recreation")
- Play, Settings, Credits buttons
- Background: animated food characters (placeholder)

## Character Select

- Grid of 20 characters (locked/unlocked state)
- Per-player cursor with color assignment
- Ready confirmation per slot

## Rules Editor

- Round timer slider
- Kill limit toggle
- Power-up pool checkboxes (13 types)
- Spawn rate slider
- Friendly fire toggle
- Shield for loser toggle

## In-Round HUD

- Top: round timer, mode indicator
- Per-player: kill count, lives (if applicable)
- Bottom: power-up icon stack (max 3)
- Golden boomerang indicator (mode)
- Hide & Seek phase timer

## Post-Round Scoreboard

- Ranked kill list with team colors
- MVP highlight
- XP gained + progress bar
- Rematch / Change Map / Main Menu

## Debug Overlays (dev only)

- Hitbox outlines (player, boomerang, melee arc)
- Velocity vectors
- State machine labels
- FPS counter
