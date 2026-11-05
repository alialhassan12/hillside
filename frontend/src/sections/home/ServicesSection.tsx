import ServiceCard from "../../components/services/ServiceCard";
import { useServices } from "../../hooks/useServices";

export default function ServicesSection() {
  const { data: services, isPending, isError } = useServices();

  return (
    <section className="bg-surface py-24 sm:py-20">
      <div className="mx-auto max-w-330 px-6">
        {/* Section heading */}
        <div className="mb-12 text-center">
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
            <p className="w-full text-center text-body">Loading services...</p>
          ) : isError ? (
            <p className="w-full text-center text-body">
              Unable to load services.
            </p>
          ) : services.length === 0 ? (
            <p className="w-full text-center text-body">
              No services available.
            </p>
          ) : (
            services.map((service) => (
              <div key={service.id} className="w-full px-3 md:w-1/4 xl:w-1/6">
                <ServiceCard service={service} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
