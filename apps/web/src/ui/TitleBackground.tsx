import { ArenaScene } from '../landing/ArenaScene';
import { FoodFighterSprite } from '../landing/FoodFighterSprite';

interface TitleBackgroundProps {
  variant?: 'full' | 'subtle';
}

export function TitleBackground({ variant = 'full' }: TitleBackgroundProps) {
  return (
    <div className={`bf-title-bg bf-title-bg--${variant}`} aria-hidden="true">
      <div className="bf-title-sky" />
      <div className="bf-title-cloud bf-title-cloud--1" />
      <div className="bf-title-cloud bf-title-cloud--2" />
      <div className="bf-title-cloud bf-title-cloud--3" />
      <div className="bf-title-kitchen-tiles" />

      {variant === 'full' && (
        <>
          <div className="bf-title-fighter bf-title-fighter--avocado">
            <FoodFighterSprite color="#568203" accent="#3d5c02" shape="round" facing="right" anim="throw" />
          </div>
          <div className="bf-title-fighter bf-title-fighter--donut">
            <FoodFighterSprite color="#D2691E" accent="#8B4513" shape="round" facing="left" anim="idle" />
          </div>
          <div className="bf-title-fighter bf-title-fighter--banana">
            <FoodFighterSprite color="#FFE135" accent="#c9a800" shape="tall" facing="right" anim="dash" />
          </div>
          <svg className="bf-title-boomerang-spin" viewBox="0 0 48 48" aria-hidden="true">
            <path
              d="M8 24 C8 12 20 6 32 10 C38 12 42 18 40 24 C38 32 28 38 18 36 C12 34 8 30 8 24 Z"
              fill="#E8A317"
              stroke="#8B5A00"
              strokeWidth="2"
            />
            <path d="M14 22 L22 18 L20 26 Z" fill="#FFD54F" />
          </svg>
        </>
      )}

      <div className="bf-title-arena-parallax">
        <ArenaScene theme="kitchen" compact showBoomerang={false} fighters={[]} />
      </div>
    </div>
  );
}
