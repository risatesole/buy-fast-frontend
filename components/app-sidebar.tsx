"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Settings,
  BarChart,
  ShoppingBag,
  Package,
  ChevronDown,
} from "lucide-react";

const platformItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
    sub: [
      { title: "Overview", url: "/admin/dashboard/overview" },
      { title: "Stats", url: "/admin/dashboard/stats" },
      { title: "Reports", url: "/admin/dashboard/reports" },
    ],
  },
  {
    title: "Customer",
    url: "/admin/customer",
    icon: ShoppingBag,
    sub: [{ title: "Orders", url: "/admin/customers/orders" }],
  },
  {
    title: "Products",
    url: "/admin/products",
    icon: Package,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
    sub: [
      { title: "All Users", url: "/admin/users/all" },
      { title: "Roles", url: "/admin/users/roles" },
      { title: "Permissions", url: "/admin/users/permissions" },
    ],
  },
  {
    title: "Analytics",
    url: "/admin/analytics",
    icon: BarChart,
    sub: [
      { title: "Traffic", url: "/admin/analytics/traffic" },
      { title: "Conversions", url: "/admin/analytics/conversions" },
      { title: "Retention", url: "/admin/analytics/retention" },
    ],
  },
  {
    title: "Docs",
    url: "/admin/docs",
    icon: BookOpen,
    sub: [
      { title: "Getting Started", url: "/admin/docs/getting-started" },
      { title: "API Reference", url: "/admin/docs/api-reference" },
      { title: "Changelog", url: "/admin/docs/changelog" },
    ],
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
    sub: [
      { title: "General", url: "/admin/settings/general" },
      { title: "Security", url: "/admin/settings/security" },
      { title: "Billing", url: "/admin/settings/billing" },
    ],
  },
];

const projectItems = [
  { title: "Design Engineering", url: "/admin/projects/design" },
  { title: "Sales & Marketing", url: "/admin/projects/sales" },
];

export function AppSidebar() {
  const pathname = usePathname();

  useEffect(() => {
    const init = async () => {
      const { HSStaticMethods } = await import("preline");
      // Defer one tick so the DOM is fully painted before Preline scans it
      setTimeout(() => HSStaticMethods.autoInit(), 0);
    };
    init();
  }, [pathname]);

  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || "My Company";

  return (
    /*
      Preline overlay drawer requirements:
      - class "hs-overlay" on the element
      - class "hidden" initially (Preline removes/adds it)
      - [--auto-close:lg] makes it auto-close when viewport >= lg (desktop shows it natively via CSS)
      - data-hs-overlay-keyboard="true" allows ESC to close
    */
    <div
      id="app-sidebar"
      className="hs-overlay [--auto-close:lg] hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform fixed top-0 start-0 bottom-0 z-[60] w-64 bg-white border-e border-gray-200 overflow-y-auto hidden lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 dark:bg-neutral-800 dark:border-neutral-700"
      role="dialog"
      tabIndex={-1}
      aria-label="Sidebar"
    >
      {/* ── Header / brand ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-neutral-700">
        <Link href="/" className="flex items-center gap-x-3 group">
          <div className="flex items-center justify-center size-9 rounded-lg bg-gray-900 text-white text-sm font-bold shrink-0 dark:bg-white dark:text-gray-900">
            {companyName[0].toUpperCase()}
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-gray-800 dark:text-neutral-200 group-hover:text-blue-600 transition-colors">
              {companyName}
            </span>
            <span className="text-xs text-gray-500 dark:text-neutral-400">
              Enterprise
            </span>
          </div>
        </Link>

        {/* Mobile close button */}
        <button
          type="button"
          className="lg:hidden p-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700"
          data-hs-overlay="#app-sidebar"
          aria-label="Close sidebar"
        >
          <svg
            className="size-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* ── Nav ── */}
      <nav className="flex flex-col gap-y-5 px-3 py-4">
        {/* Platform group */}
        <div>
          <p className="px-2 mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-neutral-500">
            Platform
          </p>
          <ul className="space-y-0.5">
            {platformItems.map((item) => {
              const Icon = item.icon;
              const isGroupActive =
                pathname === item.url ||
                item.sub?.some((s) => pathname.startsWith(s.url));

              if (!item.sub) {
                return (
                  <li key={item.title}>
                    <Link
                      href={item.url}
                      className={[
                        "flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm font-medium transition-colors",
                        isGroupActive
                          ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                          : "text-gray-700 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700",
                      ].join(" ")}
                    >
                      <Icon className="size-4 shrink-0" />
                      {item.title}
                    </Link>
                  </li>
                );
              }

              const accordionId = `acc-${item.title.toLowerCase().replace(/\s+/g, "-")}`;

              return (
                <li key={item.title}>
                  {/*
                    Preline accordion:
                    - parent needs class "hs-accordion" and a unique id
                    - trigger needs class "hs-accordion-toggle"
                    - content needs class "hs-accordion-content" + "hidden"
                    - Add "active" to parent to start open
                  */}
                  <div
                    className={`hs-accordion${isGroupActive ? " active" : ""}`}
                    id={accordionId}
                  >
                    <button
                      type="button"
                      className="hs-accordion-toggle hs-accordion-active:text-blue-600 hs-accordion-active:bg-blue-50 dark:hs-accordion-active:text-blue-400 dark:hs-accordion-active:bg-blue-900/30 w-full flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="flex-1 text-start">{item.title}</span>
                      <ChevronDown className="size-4 shrink-0 transition-transform hs-accordion-active:rotate-180" />
                    </button>

                    <div
                      className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden"
                      role="region"
                      aria-labelledby={accordionId}
                    >
                      <ul className="ps-7 pt-1 space-y-0.5">
                        {item.sub.map((sub) => {
                          const isSubActive = pathname === sub.url;
                          return (
                            <li key={sub.title}>
                              <Link
                                href={sub.url}
                                className={[
                                  "flex items-center gap-x-2 py-1.5 px-3 rounded-lg text-sm transition-colors",
                                  isSubActive
                                    ? "text-blue-600 font-medium dark:text-blue-400"
                                    : "text-gray-600 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700",
                                ].join(" ")}
                              >
                                <span
                                  className={[
                                    "size-1.5 rounded-full shrink-0",
                                    isSubActive
                                      ? "bg-blue-600 dark:bg-blue-400"
                                      : "bg-gray-300 dark:bg-neutral-500",
                                  ].join(" ")}
                                />
                                {sub.title}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Projects group */}
        <div>
          <p className="px-2 mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-neutral-500">
            Projects
          </p>
          <ul className="space-y-0.5">
            {projectItems.map((item) => (
              <li key={item.title}>
                <Link
                  href={item.url}
                  className={[
                    "flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm font-medium transition-colors",
                    pathname === item.url
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      : "text-gray-700 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700",
                  ].join(" ")}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* ── Footer / user profile ── */}
      <div className="mt-auto border-t border-gray-200 dark:border-neutral-700 px-3 py-3">
        <div
          className="hs-dropdown relative"
          data-hs-dropdown-placement="top-left"
        >
          <button
            id="sidebar-user-btn"
            type="button"
            className="hs-dropdown-toggle w-full flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
          >
            <span className="flex items-center justify-center size-9 rounded-full bg-gray-200 text-gray-700 text-xs font-bold dark:bg-neutral-700 dark:text-neutral-300 shrink-0">
              SC
            </span>
            <div className="flex flex-col text-left leading-tight overflow-hidden">
              <span className="text-sm font-semibold text-gray-800 dark:text-neutral-200 truncate">
                default
              </span>
              <span className="text-xs text-gray-500 dark:text-neutral-400 truncate">
                default@example.com
              </span>
            </div>
            <svg
              className="ms-auto size-4 text-gray-400 shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 9l4-4 4 4m0 6l-4 4-4-4"
              />
            </svg>
          </button>

          <div
            className="hs-dropdown-menu hs-dropdown-open:opacity-100 hidden min-w-48 bg-white shadow-md rounded-xl border border-gray-200 p-1 dark:bg-neutral-800 dark:border-neutral-700"
            aria-labelledby="sidebar-user-btn"
          >
            <Link
              href="/admin/profile"
              className="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700"
            >
              Profile
            </Link>
            <Link
              href="/admin/settings/billing"
              className="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700"
            >
              Billing
            </Link>
            <div className="border-t border-gray-200 dark:border-neutral-700 my-1" />
            <button
              type="button"
              className="w-full flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
