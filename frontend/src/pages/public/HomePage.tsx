import HeroSection from "../../sections/home/HeroSection";
import HighlightsBar from "../../sections/home/HighlightsBar";
import AboutSection from "../../sections/home/AboutSection";
import ServicesSection from "../../sections/home/ServicesSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <HighlightsBar />
      <AboutSection />
      <ServicesSection />
    </main>
  );
}
