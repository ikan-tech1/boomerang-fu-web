interface GameLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function GameLogo({ size = 'md', className = '' }: GameLogoProps) {
  return (
    <h1 className={`bf-game-logo bf-game-logo--${size} ${className}`.trim()}>
      <span className="bf-game-logo-boom">BOOMERANG</span>
      <span className="bf-game-logo-fu">FU</span>
    </h1>
  );
}
