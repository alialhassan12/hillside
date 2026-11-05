import HeroSection from "../../sections/home/HeroSection";
import HighlightsBar from "../../sections/home/HighlightsBar";
import AboutSection from "../../sections/home/AboutSection";
import ServicesSection from "../../sections/home/ServicesSection";
import TourVideoSection from "../../sections/home/TourVideoSection";
import TestimonialsSection from "../../sections/home/TestimonialsSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <HighlightsBar />
      <AboutSection />
      <ServicesSection />
      <TourVideoSection />
      <TestimonialsSection />
    </main>
  );
}
