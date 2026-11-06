import { Link } from "react-router";
import type { Service } from "../../types/service";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link
      to={`/services/${service.id}`}
      className="
        group flex min-h-50 flex-col
        items-center justify-center
        rounded-sm bg-white px-5 py-10
        text-center shadow-soft
        transition-all duration-300
        hover:-translate-y-2.5 hover:scale-103
        hover:bg-gold-muted hover:shadow-soft-hover
        motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100
        md:rounded-[50%_50%_50%_0%]
      "
    >
      <img
        src={service.icon_url}
        alt=""
        className="mb-5 h-12.5 w-12.5 object-contain transition-transform duration-300 group-hover:scale-120 group-hover:rotate-5 motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0"
      />

      <h3
        className="
        font-sans text-[20px] font-semibold
        leading-normal text-heading
        transition-colors group-hover:text-white
      "
      >
        {service.name}
      </h3>
    </Link>
  );
}
