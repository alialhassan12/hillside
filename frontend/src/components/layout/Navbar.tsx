import { useState } from "react";
import { NavLink } from "react-router";
import { Menu, X } from "lucide-react";
import BrandWordmark from "./BrandWordmark";

const navigation = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/#about_us" },
  { label: "Services", path: "/services" },
  { label: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <BrandWordmark />

        <div className="hidden items-center gap-10 md:flex">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `text-[15px] font-bold tracking-[2px] uppercase transition-colors hover:text-amber-300 ${
                  isActive ? "text-white" : "text-white/70 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <button
          type="button"
          className="text-white md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {isMenuOpen && (
        <div className="mx-4 rounded-lg bg-slate-950 p-5 md:hidden">
          <div className="flex flex-col gap-5">
            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:text-amber-300"
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
