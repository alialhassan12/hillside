import { Link } from "react-router";
import heroImage from "../../assets/home.jpeg";

export default function HeroSection() {
  return (
    <section
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center text-white">
        <p className="mb-5 font-sans text-[13px] font-bold leading-[1.8] tracking-[1px] uppercase text-[#f5f5f5]">
          Serene Hilltop Luxury in Kenema City
        </p>

        <h1 className="font-serif text-[40px] leading-[1.2] font-bold text-white md:text-[80px]">
          Escape To Paradise...
        </h1>

        <div className="mt-10 flex flex-col items-center justify-center gap-2 sm:flex-row">
          <a
            href="#tour"
            className="bg-forest px-6 py-4 font-bold text-white transition-colors duration-300"
          >
            Take A Tour
          </a>

          <Link
            to="/contact"
            className="bg-gold px-6 py-4 font-bold text-white transition-colors duration-300"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
