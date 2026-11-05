import { Link, useParams } from "react-router";
import { useServices } from "../../hooks/useServices";
import { useServiceDetails } from "../../hooks/useServiceDetails";
import { useServicesBanner } from "../../hooks/useServiceBanner";

export default function ServiceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: banner } = useServicesBanner();

  const {
    data: services,
    isPending: servicesPending,
    isError: servicesError,
  } = useServices();

  const {
    data: details,
    isPending: detailsPending,
    isError: detailsError,
  } = useServiceDetails(id);

  const service = services?.find((item) => item.id === id);

  if (!id) {
    return <p className="py-24 text-center">Invalid service URL.</p>;
  }

  if (servicesPending || detailsPending) {
    return <p className="py-24 text-center">Loading service details...</p>;
  }

  if (servicesError || detailsError) {
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
        <div className="relative z-10 px-6 text-center text-white">
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
        <p className="mx-auto max-w-200 text-center font-sans text-lg leading-8 text-body">
          {service.description}
        </p>
      </section>

      {/* Detail cards */}
      <section className="mx-auto max-w-330 px-6 pb-24">
        {details.length === 0 ? (
          <p className="text-center text-body">
            No additional details available for this service.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {details.map((detail) => (
              <article
                key={detail.id}
                className="overflow-hidden rounded-xl bg-gold p-4 shadow-lg"
              >
                <img
                  src={detail.image_url}
                  alt={detail.title}
                  loading="lazy"
                  className="aspect-square w-full rounded-lg object-cover"
                />

                <h2 className="mt-5 text-center font-serif text-xl font-bold text-white">
                  {detail.title}
                </h2>

                <p className="mt-3 text-center font-sans text-sm leading-6 text-forest">
                  {detail.description}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
