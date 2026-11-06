import { Link } from "react-router";
import { ChevronRight } from "lucide-react";

import BrandWordmark from "./BrandWordmark";
import { useServices } from "../../hooks/useServices";
import { useContacts } from "../../hooks/useContacts";
import { useCompanyAddress } from "../../hooks/useCompanyAddress";
import { getContactLink } from "../../lib/contactLink";

export default function Footer() {
  const { data: services = [] } = useServices();
  const { data: contacts = [] } = useContacts();
  const { data: companyAddress } = useCompanyAddress();

  // Website and social links show as icons under the logo;
  // email, phone and anything else go in the contact details column.
  const contactLinks = contacts.map((contact) => ({
    contact,
    ...getContactLink(contact.link),
  }));
  const socialLinks = contactLinks.filter((item) => item.kind === "web");
  const detailLinks = contactLinks.filter((item) => item.kind !== "web");

  return (
    <footer className="bg-footer font-sans text-white">
      <div className="mx-auto grid max-w-330 grid-cols-1 gap-12 px-6 py-24 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
        {/* Hotel branding */}
        <div>
          <BrandWordmark />

          <p className="mt-8 text-sm leading-7 text-white/60">
            Luxury hilltop retreat surrounded by nature's beauty.
          </p>

          {socialLinks.length > 0 && (
            <ul className="flex flex-wrap gap-3">
              {socialLinks.map(({ contact, href }) => (
                <li key={contact.id}>
                  <a
                    href={href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Hillside Hotel on ${contact.name}`}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 transition-colors hover:bg-gold"
                  >
                    <img
                      src={contact.icon_url}
                      alt=""
                      className="h-6 w-6 object-contain"
                    />
                  </a>
                </li>
              ))}
            </ul>
          )}
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
              {companyAddress?.address_icon_url && (
                <img
                  src={companyAddress.address_icon_url}
                  alt=""
                  className="h-5 w-5 shrink-0 object-contain"
                />
              )}

              <span>{companyAddress?.address}</span>
            </div>

            {detailLinks.map(({ contact, href, label }) => {
              const content = (
                <>
                  <img
                    src={contact.icon_url}
                    alt=""
                    className="h-5 w-5 shrink-0 object-contain"
                  />

                  <span className="break-all">{label}</span>
                </>
              );

              // Unknown formats are shown as text, never as a link.
              return href ? (
                <a
                  key={contact.id}
                  href={href}
                  className="flex items-start gap-3 hover:text-sand"
                >
                  {content}
                </a>
              ) : (
                <div key={contact.id} className="flex items-start gap-3">
                  {content}
                </div>
              );
            })}
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
