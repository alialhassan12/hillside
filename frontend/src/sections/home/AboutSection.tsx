import type { CSSProperties } from "react";
import AboutFeatureCard from "../../components/about/AboutFeatureCard";
import { useAbout } from "../../hooks/useAbout";

export default function AboutSection() {
  const { data: features, isPending, isError } = useAbout();

  if (isPending) {
    return (
      <section id="about_us" className="bg-surface py-24 sm:py-20">
        <div
          role="status"
          aria-label="Loading About Us"
          className="mx-auto grid max-w-330 grid-cols-1 items-center gap-12 px-6 md:grid-cols-2 xl:gap-16"
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-4">
            {[0, 1].map((card) => (
              <div key={card} className="flex flex-col gap-4">
                <div className="animate-pulse motion-reduce:animate-none h-57.5 w-full bg-forest/10" />
                <div className="animate-pulse motion-reduce:animate-none h-64 rounded-[10px] bg-white" />
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="animate-pulse motion-reduce:animate-none h-4 w-24 rounded bg-sand/20" />
            <div className="animate-pulse motion-reduce:animate-none h-12 w-full rounded bg-forest/10 md:h-16" />
            <div className="animate-pulse motion-reduce:animate-none h-12 w-3/4 rounded bg-forest/10 md:h-16" />
            <div className="animate-pulse motion-reduce:animate-none h-5 w-full rounded bg-forest/10" />
            <div className="animate-pulse motion-reduce:animate-none mt-4 h-12 w-48 bg-sand/20" />
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section id="about_us" className="bg-surface py-24 sm:py-20">
        <div className="mx-auto max-w-330 px-6">
          <p>Unable to load About Us information.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="about_us" className="bg-surface py-24 sm:py-20">
      <div className="mx-auto grid max-w-330 grid-cols-1 items-center gap-12 px-6 md:grid-cols-2 xl:gap-16">
        {/* Left: Feature cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-4">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              data-reveal="zoom"
              style={{ "--reveal-delay": `${(index + 1) * 120}ms` } as CSSProperties}
            >
              <AboutFeatureCard
                title={feature.title}
                description={feature.text}
                image={feature.image_url}
                icon={feature.icon_url}
                reversed={index === 0}
              />
            </div>
          ))}
        </div>

        {/* Right: About content */}
        <div data-reveal="from-right" className="min-w-0">
          <span className="font-sans text-[13px] font-bold uppercase tracking-[2px] text-gold">
            About Us
          </span>

          <h2 className="mt-4 font-serif text-[38px] leading-[1.4] text-heading md:text-[64px]">
            Serene Hilltop Luxury in Kenema City
          </h2>

          <p className="mt-6 font-sans text-base leading-[1.8] text-body">
            Discover comfort, relaxation, and exceptional hospitality at
            Hillside Hotel, surrounded by beautiful hilltop views.
          </p>

          <a
            href="#vd"
            className="mt-8 inline-flex items-center justify-center bg-gold px-8 py-4 font-sans text-[12px] font-bold uppercase tracking-[1px] text-white transition-colors duration-300 hover:bg-gold-muted"
          >
            Explore Our Hotel
          </a>
        </div>
      </div>
    </section>
  );
}
