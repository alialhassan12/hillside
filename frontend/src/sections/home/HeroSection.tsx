import { Link } from "react-router";
import { useHero } from "../../hooks/useHero";

export default function HeroSection() {
  const { data: hero, isPending, isError } = useHero();

  if (isPending) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-ink">
        <div
          role="status"
          aria-label="Loading hotel information"
          className="flex w-full max-w-5xl flex-col items-center px-6"
        >
          <div className="animate-pulse motion-reduce:animate-none mb-5 h-4 w-64 max-w-full rounded bg-white/10" />
          <div className="animate-pulse motion-reduce:animate-none mb-6 h-12 w-full max-w-2xl rounded bg-white/10 md:h-20" />
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="animate-pulse motion-reduce:animate-none h-12 w-40 bg-white/10" />
            <div className="animate-pulse motion-reduce:animate-none h-12 w-40 bg-white/10" />
          </div>
        </div>
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

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center text-white motion-safe:animate-rise-in">
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
