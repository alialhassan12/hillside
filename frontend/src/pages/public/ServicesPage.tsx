import type { CSSProperties } from "react";
import { Link } from "react-router";
import { useServices } from "../../hooks/useServices";
import { useServicesBanner } from "../../hooks/useServiceBanner";

export default function ServicesPage() {
  const { data: services, isPending, isError } = useServices();
  const { data: banner } = useServicesBanner();

  return (
    <>
      <section
        className="relative flex min-h-screen items-center justify-center bg-cover bg-center bg-scroll lg:bg-fixed bg-forest"
        style={{
          backgroundImage: banner?.services_banner_img_url
            ? `url("${banner.services_banner_img_url}")`
            : undefined,
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/45" />

        {/* Banner content */}
        <div className="relative z-10 px-6 text-center text-white motion-safe:animate-rise-in">
          <div className="mb-3 flex items-center justify-center gap-2 font-sans text-xs font-bold uppercase tracking-widest">
            <Link to="/" className="hover:text-sand">
              Home
            </Link>

            <span>&gt;</span>
            <span>Our Services</span>
            <span>&gt;</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl">Our Services</h1>
        </div>
      </section>

      {/* Services content */}
      <section className="bg-surface px-6 py-24">
        <div className="mx-auto max-w-330">
          <div data-reveal="up" className="mb-12 text-center">
            <h2 className="font-serif text-[42px] text-forest">
              Hillside Services
            </h2>

            <p className="mt-4 font-sans text-sm text-body">
              Experience serene hilltop luxury and exceptional amenities at
              Hillside Hotel.
            </p>
          </div>

          {isPending ? (
            <ul
              role="status"
              aria-label="Loading services"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {Array.from({ length: 6 }, (_, card) => (
                <li
                  key={card}
                  className="rounded-xl bg-white px-8 py-10 shadow-soft"
                >
                  <div className="animate-pulse motion-reduce:animate-none mx-auto h-18 w-18 rounded-full bg-sand/30" />
                  <div className="animate-pulse motion-reduce:animate-none mx-auto mt-5 h-7 w-1/2 rounded bg-forest/10" />
                  <div className="mt-3 space-y-2">
                    <div className="animate-pulse motion-reduce:animate-none h-4 w-full rounded bg-forest/10" />
                    <div className="animate-pulse motion-reduce:animate-none mx-auto h-4 w-3/4 rounded bg-forest/10" />
                  </div>
                </li>
              ))}
            </ul>
          ) : isError ? (
            <p className="text-center text-red-600">Unable to load services.</p>
          ) : services.length === 0 ? (
            <p className="text-center text-body">No services available.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  data-reveal="up"
                  style={
                    {
                      "--reveal-delay": `${(index % 3) * 120}ms`,
                    } as CSSProperties
                  }
                >
                  <Link
                    to={`/services/${service.id}`}
                    className="group block h-full rounded-xl bg-white px-8 py-10 text-center shadow-soft transition-all duration-300 hover:-translate-y-2.5 hover:shadow-lift motion-reduce:hover:translate-y-0"
                  >
                    <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-full bg-sand transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
                      <img
                        src={service.icon_url}
                        alt=""
                        loading="lazy"
                        className="h-10 w-10 object-contain"
                      />
                    </div>

                    <h3 className="mt-5 font-serif text-2xl text-heading transition-colors group-hover:text-gold">
                      {service.name}
                    </h3>

                    <p className="mt-3 font-sans text-sm leading-7 text-body">
                      {service.description}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
