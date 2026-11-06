import type { CSSProperties } from "react";
import ServiceCard from "../../components/services/ServiceCard";
import { useServices } from "../../hooks/useServices";

export default function ServicesSection() {
  const { data: services, isPending, isError } = useServices();

  return (
    <section className="bg-surface py-24 sm:py-20">
      <div className="mx-auto max-w-330 px-6">
        {/* Section heading */}
        <div data-reveal="up" className="mb-12 text-center">
          <p className="mb-4 font-sans text-[13px] font-bold uppercase tracking-[2px] text-gold">
            Hillside Services
          </p>

          <h2 className="font-serif text-[38px] leading-[1.4] text-heading sm:text-[64px]">
            Explore Our Hotel Services
          </h2>
        </div>

        {/* Services grid */}
        <div className="flex flex-wrap justify-center gap-y-6">
          {isPending ? (
            <>
              <span role="status" className="sr-only">
                Loading services
              </span>
              {Array.from({ length: 6 }, (_, card) => (
                <div
                  key={card}
                  aria-hidden="true"
                  className="w-full px-3 md:w-1/4 xl:w-1/6"
                >
                  <div className="flex min-h-50 flex-col items-center justify-center rounded-sm bg-white px-5 py-10 shadow-soft md:rounded-[50%_50%_50%_0%]">
                    <div className="animate-pulse motion-reduce:animate-none mb-5 h-12.5 w-12.5 rounded-full bg-forest/10" />
                    <div className="animate-pulse motion-reduce:animate-none h-5 w-24 rounded bg-forest/10" />
                  </div>
                </div>
              ))}
            </>
          ) : isError ? (
            <p className="w-full text-center text-body">
              Unable to load services.
            </p>
          ) : services.length === 0 ? (
            <p className="w-full text-center text-body">
              No services available.
            </p>
          ) : (
            services.map((service, index) => (
              <div
                key={service.id}
                data-reveal="zoom"
                style={{ "--reveal-delay": `${(index % 6) * 100}ms` } as CSSProperties}
                className="w-full px-3 md:w-1/4 xl:w-1/6"
              >
                <ServiceCard service={service} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
