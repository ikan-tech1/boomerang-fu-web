import { FoodFighterSprite } from './FoodFighterSprite';

export type ArenaTheme = 'kitchen' | 'grass' | 'bamboo';

interface FighterPlacement {
  id: string;
  color: string;
  accent?: string;
  shape?: 'round' | 'tall' | 'wide';
  x: number;
  y: number;
  facing?: 'left' | 'right';
  anim?: 'idle' | 'dash' | 'throw';
}

interface ArenaSceneProps {
  theme?: ArenaTheme;
  fighters?: FighterPlacement[];
  showBoomerang?: boolean;
  showSliceFx?: boolean;
  showScorePop?: boolean;
  className?: string;
  compact?: boolean;
}

const DEFAULT_FIGHTERS: FighterPlacement[] = [
  { id: 'avocado', color: '#568203', accent: '#3d5c02', shape: 'round', x: 22, y: 38, facing: 'right', anim: 'throw' },
  { id: 'banana', color: '#FFE135', accent: '#c9a800', shape: 'tall', x: 68, y: 52, facing: 'left', anim: 'dash' },
  { id: 'apple', color: '#FF0800', accent: '#b80600', shape: 'round', x: 48, y: 68, facing: 'right', anim: 'idle' },
];

export function ArenaScene({
  theme = 'kitchen',
  fighters = DEFAULT_FIGHTERS,
  showBoomerang = true,
  showSliceFx = false,
  showScorePop = false,
  className = '',
  compact = false,
}: ArenaSceneProps) {
  return (
    <div
      className={`bf-arena bf-arena--${theme}${compact ? ' bf-arena--compact' : ''} ${className}`.trim()}
      aria-hidden="true"
    >
      <div className="bf-arena-sky" />
      <div className="bf-arena-floor">
        {theme === 'kitchen' && (
          <>
            <div className="bf-arena-counter bf-arena-counter--tl" />
            <div className="bf-arena-counter bf-arena-counter--br" />
            <div className="bf-arena-pot" />
          </>
        )}
        {theme === 'grass' && (
          <>
            <div className="bf-arena-bush bf-arena-bush--1" />
            <div className="bf-arena-bush bf-arena-bush--2" />
          </>
        )}
        {theme === 'bamboo' && (
          <>
            <div className="bf-arena-bridge" />
            <div className="bf-arena-stalk bf-arena-stalk--1" />
            <div className="bf-arena-stalk bf-arena-stalk--2" />
          </>
        )}
      </div>

      {fighters.map((f) => (
        <div
          key={f.id}
          className="bf-arena-fighter"
          style={{ left: `${f.x}%`, top: `${f.y}%` }}
        >
          <FoodFighterSprite
            color={f.color}
            accent={f.accent}
            shape={f.shape}
            facing={f.facing}
            anim={f.anim}
          />
        </div>
      ))}

      {showBoomerang && (
        <svg className="bf-arena-boomerang" viewBox="0 0 48 48" aria-hidden="true">
          <path
            d="M8 24 C8 12 20 6 32 10 C38 12 42 18 40 24 C38 32 28 38 18 36 C12 34 8 30 8 24 Z"
            fill="#E8A317"
            stroke="#8B5A00"
            strokeWidth="2"
          />
          <path d="M14 22 L22 18 L20 26 Z" fill="#FFD54F" />
        </svg>
      )}

      {showSliceFx && (
        <>
          <div className="bf-slice-line bf-slice-line--1" />
          <div className="bf-slice-line bf-slice-line--2" />
          <div className="bf-slice-particle bf-slice-particle--1" />
          <div className="bf-slice-particle bf-slice-particle--2" />
          <div className="bf-slice-particle bf-slice-particle--3" />
        </>
      )}

      {showScorePop && (
        <div className="bf-score-pop">
          <span>+1</span>
        </div>
      )}
    </div>
  );
}
