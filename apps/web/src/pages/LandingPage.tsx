import { LandingHeader } from '../landing/LandingHeader';
import { Hero } from '../landing/Hero';
import { FeaturesStrip } from '../landing/FeaturesStrip';
import { CharacterShowcase } from '../landing/CharacterShowcase';
import { GameModes } from '../landing/GameModes';
import { PowerUpsGrid } from '../landing/PowerUpsGrid';
import { ArenaPreview } from '../landing/ArenaPreview';
import { HowToPlay } from '../landing/HowToPlay';
import { TrailerSection } from '../landing/TrailerSection';
import { LandingFooter } from '../landing/LandingFooter';

export default function LandingPage() {
  return (
    <div className="bf-landing">
      <LandingHeader />
      <main>
        <Hero />
        <FeaturesStrip />
        <CharacterShowcase />
        <GameModes />
        <PowerUpsGrid />
        <ArenaPreview />
        <HowToPlay />
        <TrailerSection />
      </main>
      <LandingFooter />
    </div>
  );
}
