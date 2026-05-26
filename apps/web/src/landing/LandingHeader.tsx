import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getNavSections } from './content';

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`lp-header${scrolled ? ' scrolled' : ''}`}>
      <Link to="/" className="lp-logo" aria-label="Boomerang Fu Web home">
        <span className="lp-logo-icon" aria-hidden="true">🪃</span>
        <span className="lp-logo-text">Boomerang Fu Web</span>
      </Link>
      <nav className="lp-nav" aria-label="Page sections">
        {getNavSections().map((s) => (
          <a key={s.id} href={`#${s.id}`}>
            {s.label}
          </a>
        ))}
      </nav>
      <Link to="/play" className="lp-btn lp-btn-primary lp-btn-sm">
        Play Now
      </Link>
    </header>
  );
}
