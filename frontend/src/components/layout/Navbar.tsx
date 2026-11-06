import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router";
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
  const { pathname, hash } = useLocation();
  const menuRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // NavLink ignores the #hash, so "Home" and "About Us" (both "/") would
  // be active together. Decide it here instead.
  function isItemActive(path: string) {
    if (path === "/#about_us") return pathname === "/" && hash === "#about_us";
    if (path === "/") return pathname === "/" && hash !== "#about_us";
    return pathname === path || pathname.startsWith(`${path}/`);
  }

  // While the dropdown is open: close on Escape (focus back on the
  // button) or on a click/tap outside the menu.
  useEffect(() => {
    if (!isMenuOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        buttonRef.current?.focus();
      }
    }

    function onPointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [isMenuOpen]);

  return (
    // Mobile: a solid dark bar in the page flow (the menu pushes the page
    // down, like the original site). Desktop: transparent, over the hero.
    <header
      ref={menuRef}
      className="relative z-50 bg-ink md:absolute md:inset-x-0 md:top-0 md:bg-transparent"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:py-6 lg:px-10">
        <BrandWordmark />

        <div className="hidden items-center gap-10 md:flex">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              aria-current={isItemActive(item.path) ? "page" : undefined}
              className={`text-[15px] font-bold tracking-[2px] uppercase transition-colors hover:text-amber-300 ${
                isItemActive(item.path)
                  ? "text-white"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Mobile: "☰ MENU" text button */}
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          className="flex cursor-pointer items-center gap-2 py-2 font-sans text-base tracking-[2px] text-white uppercase transition-colors hover:text-gold-bright focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-bright md:hidden"
        >
          {isMenuOpen ? (
            <X size={20} aria-hidden="true" />
          ) : (
            <Menu size={20} aria-hidden="true" />
          )}
          {isMenuOpen ? "Close" : "Menu"}
        </button>
      </nav>

      {/* Mobile dropdown: full width under the bar, slides open by
          animating the grid row from 0 to its content height. `inert`
          keeps the hidden links out of reach while closed. */}
      <div
        id="mobile-menu"
        inert={!isMenuOpen}
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none md:hidden ${
          isMenuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <ul className="px-6 pt-1 pb-8">
            {navigation.map((item) => {
              const isActive = isItemActive(item.path);

              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`block py-3 font-sans text-[15px] font-bold tracking-[3px] uppercase transition-colors ${
                      isActive
                        ? "text-gold-bright"
                        : "text-white hover:text-gold-bright"
                    }`}
                  >
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </header>
  );
}
