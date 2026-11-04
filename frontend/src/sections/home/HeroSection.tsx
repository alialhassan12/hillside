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
        <p className="mb-5 text-sm font-medium uppercase tracking-[0.3em] md:text-base">
          Serene Hilltop Luxury in Kenema City
        </p>

        <h1 className="text-5xl font-bold leading-tight md:text-7xl lg:text-8xl">
          Escape To Paradise...
        </h1>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#tour"
            className="rounded-md bg-amber-500 px-8 py-4 font-medium text-white transition-colors hover:bg-amber-600"
          >
            Take A Tour
          </a>

          <Link
            to="/contact"
            className="rounded-md border border-white px-8 py-4 font-medium text-white transition-colors hover:bg-white hover:text-slate-950"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
