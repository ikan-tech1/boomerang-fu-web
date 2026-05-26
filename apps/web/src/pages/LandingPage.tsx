import { LandingHeader } from '../landing/LandingHeader';
import { Hero } from '../landing/Hero';
import { CharacterShowcase } from '../landing/CharacterShowcase';
import { GameModes } from '../landing/GameModes';
import { PowerUpsGrid } from '../landing/PowerUpsGrid';
import { ArenaPreview } from '../landing/ArenaPreview';
import { HowToPlay } from '../landing/HowToPlay';
import { FeaturesStrip } from '../landing/FeaturesStrip';
import { TrailerSection } from '../landing/TrailerSection';
import { LandingFooter } from '../landing/LandingFooter';
import '../landing/landing.css';

export default function LandingPage() {
  return (
    <div className="lp-page">
      <LandingHeader />
      <main>
        <Hero />
        <CharacterShowcase />
        <GameModes />
        <PowerUpsGrid />
        <ArenaPreview />
        <HowToPlay />
        <FeaturesStrip />
        <TrailerSection />
      </main>
      <LandingFooter />
    </div>
  );
}
