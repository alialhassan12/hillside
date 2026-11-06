import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router";
import { ArrowUp } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

// Show the back-to-top button after scrolling this far (px).
const BACK_TO_TOP_OFFSET = 600;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function PublicLayout() {
  const { pathname, hash, key } = useLocation();
  const isFirstLoad = useRef(true);
  const previousPathname = useRef(pathname);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // New page: start at the top. Links like /#about_us scroll to the
  // section. On the first load (including refresh) always stay at the top.
  useEffect(() => {
    // Track the previous page for every navigation, including #hash ones.
    const samePage = previousPathname.current === pathname;
    previousPathname.current = pathname;

    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }

    if (hash) {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
      return;
    }

    // A new page starts at the top instantly; clicking the link of the
    // page you are already on glides back up.
    window.scrollTo({
      top: 0,
      behavior: samePage && !prefersReducedMotion() ? "smooth" : "instant",
    });
  }, [pathname, hash, key]);

  // Back-to-top button appears once the visitor has scrolled down.
  useEffect(() => {
    function onScroll() {
      setShowBackToTop(window.scrollY > BACK_TO_TOP_OFFSET);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reveal-on-scroll: add `is-visible` to each [data-reveal] element the
  // first time it enters the viewport (styles in index.css). Content that
  // loads later (API data) is picked up by the MutationObserver.
  useEffect(() => {
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) return;

    const root = document.documentElement;
    root.classList.add("reveal-ready");

    const intersection = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            intersection.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );

    function observeNew() {
      document
        .querySelectorAll("[data-reveal]:not(.is-visible)")
        .forEach((element) => intersection.observe(element));
    }

    observeNew();
    const mutation = new MutationObserver(observeNew);
    mutation.observe(document.body, { childList: true, subtree: true });

    return () => {
      intersection.disconnect();
      mutation.disconnect();
      root.classList.remove("reveal-ready");
    };
  }, []);

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }

  return (
    <>
      <Navbar />
      {/* Re-keyed per page so each new page fades in */}
      <div key={pathname} className="motion-safe:animate-page-in">
        <Outlet />
      </div>
      <Footer />

      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        title="Back to top"
        // Hidden while near the top: not clickable and not focusable.
        aria-hidden={!showBackToTop}
        tabIndex={showBackToTop ? 0 : -1}
        className={`fixed right-5 bottom-5 z-40 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-forest text-sand shadow-lg ring-1 ring-sand/40 transition-all duration-300 hover:-translate-y-1 hover:bg-gold hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:right-8 sm:bottom-8 ${
          showBackToTop
            ? "opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <ArrowUp size={22} aria-hidden="true" />
      </button>
    </>
  );
}
