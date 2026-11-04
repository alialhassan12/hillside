import HeroSection from "../../sections/home/HeroSection";
import HighlightsBar from "../../sections/home/HighlightsBar";
import AboutSection from "../../sections/home/AboutSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <HighlightsBar />
      <AboutSection />
    </main>
  );
}
