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
        hover:bg-gold-muted hover:shadow-soft-hover
        md:rounded-[50%_50%_50%_0%]
      "
    >
      <img
        src={service.icon_url}
        alt=""
        className="mb-5 h-12.5 w-12.5 object-contain"
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
