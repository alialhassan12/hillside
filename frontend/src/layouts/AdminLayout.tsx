import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import {
  ConciergeBell,
  ExternalLink,
  House,
  Images,
  LayoutDashboard,
  ListTree,
  LogOut,
  Mail,
  Menu,
  MessageSquareQuote,
  PanelLeftClose,
  PanelLeftOpen,
  Phone,
  Users,
  X,
} from "lucide-react";
import logo from "../assets/logo.png";

const navSections = [
  {
    label: "Overview",
    items: [{ to: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Website Content",
    items: [
      { to: "/admin/homepage", label: "Homepage", icon: House },
      { to: "/admin/services", label: "Services", icon: ConciergeBell },
      {
        to: "/admin/service-details",
        label: "Service Details",
        icon: ListTree,
      },
      { to: "/admin/media", label: "Media Library", icon: Images },
      { to: "/admin/contact", label: "Contact Information", icon: Phone },
    ],
  },
  {
    label: "Guest Interactions",
    items: [
      { to: "/admin/messages", label: "Messages", icon: Mail },
      {
        to: "/admin/testimonials",
        label: "Testimonials",
        icon: MessageSquareQuote,
      },
    ],
  },
  {
    label: "Administration",
    items: [{ to: "/admin/users", label: "Admin Users", icon: Users }],
  },
];

export default function AdminLayout() {
  // Mobile: is the slide-in sidebar open? Desktop: is it collapsed to icons?
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();

  // Find the section and page that match the current URL for the header.
  const currentSection = navSections.find((section) =>
    section.items.some((item) => item.to === pathname),
  );
  const currentPage = currentSection?.items.find(
    (item) => item.to === pathname,
  );

  // On desktop, hide text visually when collapsed but keep it for screen readers.
  const hiddenWhenCollapsed = collapsed ? "lg:sr-only" : "";
  const centeredWhenCollapsed = collapsed ? "lg:justify-center lg:px-0" : "";

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-700">
      {/* React 19 moves these tags into <head> */}
      <title>{`${currentPage?.label ?? "Admin"} | Hillside Hotel Admin`}</title>
      <meta name="robots" content="noindex, nofollow" />

      {/* Dark overlay behind the sidebar on small screens */}
      {sidebarOpen && (
        <div
          aria-hidden="true"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
        />
      )}

      <aside
        id="admin-sidebar"
        className={`fixed inset-y-0 left-0 z-40 flex w-68 flex-col bg-forest text-white transition-transform duration-200 motion-reduce:transition-none lg:translate-x-0 ${
          collapsed ? "lg:w-20" : ""
        } ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div
          className={`flex h-16 items-center justify-between border-b border-white/10 px-5 ${centeredWhenCollapsed}`}
        >
          <Link
            to="/admin"
            onClick={() => setSidebarOpen(false)}
            aria-label="Hillside Hotel admin dashboard"
            className={`flex items-center gap-3 ${collapsed ? "lg:hidden" : ""}`}
          >
            <img src={logo} alt="" className="h-9 w-auto" />
            <span className="flex flex-col leading-tight">
              <span className="text-lg font-semibold text-gold-bright">
                HILLSIDE
              </span>
              <span className="text-xs text-white/60">Admin panel</span>
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
            className="cursor-pointer rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>

          <button
            type="button"
            onClick={() => setCollapsed((current) => !current)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-controls="admin-sidebar"
            aria-expanded={!collapsed}
            className="hidden cursor-pointer rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-gold lg:inline-flex"
          >
            {collapsed ? (
              <PanelLeftOpen size={20} />
            ) : (
              <PanelLeftClose size={20} />
            )}
          </button>
        </div>

        <nav
          aria-label="Admin navigation"
          className="flex-1 overflow-y-auto px-3 py-5"
        >
          {navSections.map((section) => (
            <div key={section.label} className="mb-6">
              <p
                className={`mb-2 px-3 text-xs font-medium text-white/60 ${hiddenWhenCollapsed}`}
              >
                {section.label}
              </p>

              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end
                      title={collapsed ? item.label : undefined}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-gold ${centeredWhenCollapsed} ${
                          isActive
                            ? "bg-white/10 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.08)]"
                            : "text-white/70 hover:bg-white/5 hover:text-white"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon
                            size={18}
                            aria-hidden="true"
                            className={`shrink-0 ${
                              isActive ? "text-gold-bright" : ""
                            }`}
                          />
                          <span className={hiddenWhenCollapsed}>
                            {item.label}
                          </span>
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <Link
            to="/"
            title={collapsed ? "View website" : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white ${centeredWhenCollapsed}`}
          >
            <ExternalLink size={18} aria-hidden="true" className="shrink-0" />
            <span className={hiddenWhenCollapsed}>View website</span>
          </Link>
        </div>
      </aside>

      <div className={collapsed ? "lg:pl-20" : "lg:pl-68"}>
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-stone-200 bg-white px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
            aria-controls="admin-sidebar"
            aria-expanded={sidebarOpen}
            className="cursor-pointer rounded-lg p-2 text-stone-600 hover:bg-stone-100 lg:hidden"
          >
            <Menu size={22} />
          </button>

          <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
            <ol className="flex items-center gap-2 text-sm">
              {currentSection && (
                <li className="hidden text-stone-400 sm:block">
                  {currentSection.label}
                  <span className="ml-2" aria-hidden="true">
                    /
                  </span>
                </li>
              )}
              <li
                aria-current="page"
                className="truncate font-semibold text-stone-900"
              >
                {currentPage?.label ?? "Admin"}
              </li>
            </ol>
          </nav>

          <span className="hidden text-xs text-stone-500 md:inline">
            UI preview, actions not connected
          </span>

          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-forest text-sm font-semibold text-gold-bright"
            >
              A
            </span>
            <span className="hidden text-sm font-medium text-stone-900 sm:block">
              Admin
            </span>

            <button
              type="button"
              aria-label="Log out (not connected yet)"
              title="Not connected yet"
              className="cursor-pointer rounded-lg p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-900"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-360 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
