import type { CSSProperties } from "react";
import { Link, useParams } from "react-router";
import { useServices } from "../../hooks/useServices";
import { useServiceDetails } from "../../hooks/useServiceDetails";
import { useServicesBanner } from "../../hooks/useServiceBanner";

const pulse = "animate-pulse motion-reduce:animate-none";

export default function ServiceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: banner } = useServicesBanner();

  const {
    data: services,
    isPending: servicesPending,
    isError: servicesError,
  } = useServices();

  const {
    data: details = [],
    isPending: detailsPending,
    isError: detailsError,
  } = useServiceDetails(id);

  const service = services?.find((item) => item.id === id);

  if (!id) {
    return <p className="py-24 text-center">Invalid service URL.</p>;
  }

  // The hero needs the service name, so wait for the services list only.
  if (servicesPending) {
    return (
      <main>
        <section
          role="status"
          aria-label="Loading service"
          className="flex min-h-screen items-center justify-center bg-forest px-6"
        >
          <div className="flex w-full max-w-md flex-col items-center">
            <div className={`${pulse} mb-4 h-3 w-48 rounded bg-white/10`} />
            <div className={`${pulse} h-12 w-full rounded bg-white/10 sm:h-14`} />
          </div>
        </section>
      </main>
    );
  }

  if (servicesError) {
    return (
      <p className="py-24 text-center text-red-600">
        Unable to load service details.
      </p>
    );
  }

  if (!service) {
    return (
      <div className="py-24 text-center">
        <h1 className="font-serif text-4xl">Service not found</h1>

        <Link
          to="/services"
          className="mt-6 inline-block text-gold hover:underline"
        >
          Back to Services
        </Link>
      </div>
    );
  }

  return (
    <main>
      {/* Service details hero */}
      <section
        className="relative flex min-h-screen items-center justify-center bg-forest bg-cover bg-center bg-scroll lg:bg-fixed"
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

            <Link to="/services" className="hover:text-sand">
              Our Services
            </Link>

            <span>&gt;</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl">{service.name}</h1>
        </div>
      </section>

      {/* Service description */}
      <section className="mx-auto max-w-330 px-6 py-16">
        <p
          data-reveal="up"
          className="mx-auto max-w-200 text-center font-sans text-lg leading-8 text-body"
        >
          {service.description}
        </p>
      </section>

      {/* Detail cards */}
      <section className="mx-auto max-w-330 px-6 pb-24">
        {detailsPending ? (
          <ul
            role="status"
            aria-label="Loading service details"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {[0, 1, 2].map((card) => (
              <li key={card} className="rounded-xl bg-gold/15 p-4 shadow-lg">
                <div className={`${pulse} aspect-square w-full rounded-lg bg-gold/25`} />
                <div className={`${pulse} mx-auto mt-5 h-6 w-2/3 rounded bg-gold/25`} />
                <div className="mt-3 space-y-2">
                  <div className={`${pulse} h-4 w-full rounded bg-gold/20`} />
                  <div className={`${pulse} mx-auto h-4 w-3/4 rounded bg-gold/20`} />
                </div>
              </li>
            ))}
          </ul>
        ) : detailsError ? (
          <p className="text-center text-red-600">
            Unable to load the details for this service.
          </p>
        ) : details.length === 0 ? (
          <p className="text-center text-body">
            No additional details available for this service.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {details.map((detail, index) => (
              <div
                key={detail.id}
                data-reveal="up"
                style={
                  { "--reveal-delay": `${(index % 3) * 120}ms` } as CSSProperties
                }
              >
                {/* Lift on hover and zoom the photo, like the original site */}
                <article className="group h-full overflow-hidden rounded-xl bg-gold p-4 shadow-lg transition-[translate,box-shadow] duration-400 ease-out hover:-translate-y-2.5 hover:shadow-2xl motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                  {detail.image_url && (
                    <div className="overflow-hidden rounded-lg">
                      <img
                        src={detail.image_url}
                        alt={detail.title}
                        loading="lazy"
                        className="aspect-square w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      />
                    </div>
                  )}

                  <h2 className="mt-5 text-center font-serif text-xl font-bold text-white">
                    {detail.title}
                  </h2>

                  <p className="mt-3 text-center font-sans text-sm leading-6 text-forest">
                    {detail.description}
                  </p>
                </article>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
