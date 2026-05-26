/** Chunky food fighter with disconnected limbs — CSS/SVG, no emoji. */

import type { CSSProperties } from 'react';

export interface FoodFighterProps {
  color: string;
  accent?: string;
  shape?: 'round' | 'tall' | 'wide';
  facing?: 'left' | 'right';
  className?: string;
  anim?: 'idle' | 'dash' | 'throw';
  label?: string;
}

export function FoodFighterSprite({
  color,
  accent = '#2d2a26',
  shape = 'round',
  facing = 'right',
  className = '',
  anim = 'idle',
  label,
}: FoodFighterProps) {
  const flip = facing === 'left' ? 'bf-fighter--flip' : '';
  const shapeClass = `bf-fighter--${shape}`;

  return (
    <div
      className={`bf-fighter ${shapeClass} bf-fighter--${anim} ${flip} ${className}`.trim()}
      aria-hidden={!label}
      aria-label={label}
      style={{ '--fighter-color': color, '--fighter-accent': accent } as CSSProperties}
    >
      <div className="bf-fighter-shadow" />
      <div className="bf-fighter-limb bf-fighter-limb--arm-l" />
      <div className="bf-fighter-limb bf-fighter-limb--arm-r" />
      <div className="bf-fighter-body">
        <div className="bf-fighter-face">
          <span className="bf-fighter-eye" />
          <span className="bf-fighter-eye" />
        </div>
      </div>
      <div className="bf-fighter-limb bf-fighter-limb--leg-l" />
      <div className="bf-fighter-limb bf-fighter-limb--leg-r" />
    </div>
  );
}
