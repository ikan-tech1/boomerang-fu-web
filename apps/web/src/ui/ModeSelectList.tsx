import type { GameModeId } from '@boomerang/game-core';
import { GAME_MODES } from '../landing/content';

const MODE_IDS: GameModeId[] = ['freeForAll', 'teams', 'goldenBoomerang', 'hideAndSeek'];

const MODE_ICONS: Record<GameModeId, string> = {
  freeForAll: '⚔',
  teams: '🌶',
  goldenBoomerang: '★',
  hideAndSeek: '?',
};

interface ModeSelectListProps {
  selected?: GameModeId;
  onSelect: (mode: GameModeId) => void;
  heading?: string;
}

export function ModeSelectList({ selected, onSelect, heading = 'Select Game Mode' }: ModeSelectListProps) {
  return (
    <div className="bf-switch-menu">
      <h2 className="bf-switch-menu-heading">{heading}</h2>
      <ul className="bf-switch-menu-list" role="listbox" aria-label={heading}>
        {MODE_IDS.map((id) => {
          const meta = GAME_MODES.find((m) => m.id === id)!;
          const isSelected = selected === id;
          return (
            <li key={id} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={isSelected}
                className={`bf-switch-menu-item${isSelected ? ' bf-switch-menu-item--selected' : ''}`}
                style={{ '--mode-accent': meta.accent } as React.CSSProperties}
                onClick={() => onSelect(id)}
              >
                <span className="bf-switch-menu-icon" aria-hidden="true">
                  {MODE_ICONS[id]}
                </span>
                <span className="bf-switch-menu-label">{meta.name}</span>
                <span className="bf-switch-menu-cursor" aria-hidden="true">▶</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
