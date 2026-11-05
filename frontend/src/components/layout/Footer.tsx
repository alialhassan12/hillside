import { Link } from "react-router";
import { ChevronRight, Mail, MapPin } from "lucide-react";
import { FaInstagram } from "react-icons/fa6";
import BrandWordmark from "./BrandWordmark";
import { useServices } from "../../hooks/useServices";

export default function Footer() {
  const { data: services = [] } = useServices();

  return (
    <footer className="bg-footer font-sans text-white">
      <div className="mx-auto grid max-w-330 grid-cols-1 gap-12 px-6 py-24 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
        {/* Hotel branding */}
        <div>
          <BrandWordmark />

          <p className="mt-8 text-sm leading-7 text-white/60">
            Luxury hilltop retreat surrounded by nature's beauty.
          </p>

          <div className="mt-5 flex items-center gap-2">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-white transition-colors hover:bg-gold"
            >
              <FaInstagram size={20} />
            </a>
          </div>
        </div>

        {/* Services */}
        <div>
          <h3 className="mb-8 text-lg font-semibold">Services</h3>

          <ul className="space-y-3">
            {services.map((service) => (
              <li key={service.id}>
                <Link
                  to={`/services/${service.id}`}
                  className="flex items-center gap-1 text-sm text-white/60 transition-colors hover:text-sand"
                >
                  <ChevronRight size={16} />
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="mb-8 text-lg font-semibold">Quick Links</h3>

          <ul className="space-y-3">
            <li>
              <Link
                to="/"
                className="flex items-center gap-1 text-sm text-white/60 hover:text-sand"
              >
                <ChevronRight size={16} />
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/services"
                className="flex items-center gap-1 text-sm text-white/60 hover:text-sand"
              >
                <ChevronRight size={16} />
                Service
              </Link>
            </li>

            <li>
              <Link
                to="/contact"
                className="flex items-center gap-1 text-sm text-white/60 hover:text-sand"
              >
                <ChevronRight size={16} />
                Contact us
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact details */}
        <div>
          <h3 className="mb-8 text-lg font-semibold">Have a Questions?</h3>

          <div className="space-y-4 text-sm text-white/60">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="shrink-0 text-white" />
              <span>Reservation Road, Kenema, Sierra Leone.</span>
            </div>

            <a
              href="mailto:hillside.hotel.info@gmail.com"
              className="flex items-start gap-3 hover:text-sand"
            >
              <Mail size={18} className="shrink-0 text-white" />
              hillside.hotel.info@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-[#141414] py-10 text-center">
        <p className="px-6 text-xs text-white/40">
          Copyright © {new Date().getFullYear()} All rights reserved | HILLSIDE
          <span className="ml-1 text-[9px]">hotel</span>
        </p>
      </div>
    </footer>
  );
}
