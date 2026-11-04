import { Link } from "react-router";
import { useHero } from "../../hooks/useHero";

export default function HeroSection() {
  const { data: hero, isPending, isError } = useHero();

  if (isPending) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-ink">
        <p className="text-white">Loading hotel information...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-ink">
        <p className="text-white">Unable to load hotel information.</p>
      </section>
    );
  }

  return (
    <section
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center bg-scroll lg:bg-fixed"
      style={{ backgroundImage: `url("${hero.image_url}")` }}
    >
      <div className="absolute inset-0 bg-ink/50" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center text-white">
        <p className="mb-5 font-sans text-[13px] font-bold leading-[1.8] tracking-[1px] uppercase text-[#f5f5f5]">
          {hero.subTitle}
        </p>

        <h1 className="mb-6 font-serif text-[40px] font-bold leading-[1.2] text-white md:text-[80px]">
          {hero.title}
        </h1>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#vd"
            className="bg-forest px-8 py-4 font-sans text-[12px] font-bold uppercase tracking-[1px] text-white transition-colors hover:bg-forest/90"
          >
            Take A Tour
          </a>

          <Link
            to="/contact"
            className="bg-gold px-8 py-4 font-sans text-[12px] font-bold uppercase tracking-[1px] text-white transition-colors hover:bg-gold/90"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
