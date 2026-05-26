const DEFAULT_SLOTS = [
  { slot: 1, color: '#568203', joined: true },
  { slot: 2, color: '#FFE135', joined: false },
  { slot: 3, color: '#FF0800', joined: false },
  { slot: 4, color: '#FFA500', joined: false },
  { slot: 5, color: '#6F2DA8', joined: false },
  { slot: 6, color: '#FC5A8D', joined: false },
];

interface PlayerSlotsProps {
  slots?: typeof DEFAULT_SLOTS;
  compact?: boolean;
}

export function PlayerSlots({ slots = DEFAULT_SLOTS, compact = false }: PlayerSlotsProps) {
  return (
    <div
      className={`bf-player-bar${compact ? ' bf-player-bar--compact' : ''}`}
      aria-label="Player slots, up to 6"
    >
      {slots.map(({ slot, color, joined }) => (
        <div
          key={slot}
          className={`bf-player-slot${joined ? ' bf-player-slot--joined' : ''}`}
          style={{ '--slot-color': color } as React.CSSProperties}
        >
          <span className="bf-player-slot-num">P{slot}</span>
          <span className="bf-player-slot-status">
            {joined ? 'Ready' : 'Press + to Join'}
          </span>
        </div>
      ))}
    </div>
  );
}
