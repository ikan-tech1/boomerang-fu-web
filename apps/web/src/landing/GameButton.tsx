import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

interface GameButtonProps {
  children: ReactNode;
  to?: string;
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'lg' | 'md' | 'sm';
  className?: string;
  onClick?: () => void;
}

export function GameButton({
  children,
  to,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
}: GameButtonProps) {
  const cls = `bf-btn bf-btn--${variant} bf-btn--${size} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={cls}>
        <span className="bf-btn-face">{children}</span>
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={cls}>
        <span className="bf-btn-face">{children}</span>
      </a>
    );
  }

  return (
    <button type="button" className={cls} onClick={onClick}>
      <span className="bf-btn-face">{children}</span>
    </button>
  );
}
