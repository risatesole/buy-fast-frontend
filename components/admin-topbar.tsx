"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Bell, Search } from "lucide-react";

// ─── Breadcrumb helper ────────────────────────────────────────────────────────

function buildCrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map((seg, i) => ({
    label: seg.charAt(0).toUpperCase() + seg.slice(1),
    href: "/" + segments.slice(0, i + 1).join("/"),
  }));
  return crumbs;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AdminTopbar() {
  const pathname = usePathname();
  const crumbs = buildCrumbs(pathname);

  // Keep Preline dropdowns alive after navigation
  useEffect(() => {
    const init = async () => {
      const { HSStaticMethods } = await import("preline");
      HSStaticMethods.autoInit();
    };
    init();
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-neutral-800 dark:border-neutral-700">
      <div className="flex items-center gap-x-3 px-4 sm:px-6 h-14">
        {/* ── Mobile sidebar toggle ── */}
        <button
          type="button"
          className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 transition-colors"
          data-hs-overlay="#app-sidebar"
          aria-haspopup="dialog"
          aria-expanded="false"
          aria-controls="app-sidebar"
          aria-label="Toggle sidebar"
        >
          <svg
            className="size-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 12h18M3 6h18M3 18h18"
            />
          </svg>
        </button>

        {/* ── Breadcrumbs ── */}
        <nav
          aria-label="Breadcrumb"
          className="hidden sm:flex items-center gap-x-1 text-sm"
        >
          {crumbs.map((crumb, idx) => {
            const isLast = idx === crumbs.length - 1;
            return (
              <span key={crumb.href} className="flex items-center gap-x-1">
                {idx > 0 && (
                  <svg
                    className="size-3.5 text-gray-400 dark:text-neutral-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
                {isLast ? (
                  <span className="font-medium text-gray-800 dark:text-neutral-200">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-gray-500 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </span>
            );
          })}
        </nav>

        {/* ── Spacer ── */}
        <div className="flex-1" />

        {/* ── Search ── */}
        <div className="relative hidden md:block">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <Search className="size-4 text-gray-400 dark:text-neutral-500" />
          </div>
          <input
            type="search"
            className="py-2 ps-9 pe-4 w-56 text-sm rounded-lg border border-gray-200 bg-gray-50 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-400 transition-shadow"
            placeholder="Search…"
            aria-label="Search"
          />
        </div>

        {/* ── Notifications ── */}
        <div
          className="hs-dropdown relative"
          data-hs-dropdown-placement="bottom-right"
        >
          <button
            id="topbar-notifications"
            type="button"
            className="hs-dropdown-toggle relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="size-5" />
            {/* Unread badge */}
            <span className="absolute top-1.5 end-1.5 size-2 rounded-full bg-red-500" />
          </button>

          {/* Notifications dropdown */}
          <div
            className="hs-dropdown-menu hs-dropdown-open:opacity-100 hidden w-80 bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden dark:bg-neutral-800 dark:border-neutral-700"
            aria-labelledby="topbar-notifications"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-neutral-700">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-neutral-200">
                Notifications
              </h3>
              <button
                type="button"
                className="text-xs text-blue-600 hover:underline dark:text-blue-400"
              >
                Mark all as read
              </button>
            </div>
            <ul className="divide-y divide-gray-100 dark:divide-neutral-700 max-h-72 overflow-y-auto">
              {[
                {
                  title: "New order received",
                  time: "2 min ago",
                  unread: true,
                },
                {
                  title: "Server usage at 90%",
                  time: "1 hr ago",
                  unread: true,
                },
                {
                  title: "New user registered",
                  time: "3 hrs ago",
                  unread: false,
                },
              ].map((n) => (
                <li key={n.title}>
                  <button
                    type="button"
                    className="w-full flex items-start gap-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors text-left"
                  >
                    {n.unread && (
                      <span className="mt-1.5 size-2 rounded-full bg-blue-500 shrink-0" />
                    )}
                    {!n.unread && <span className="mt-1.5 size-2 shrink-0" />}
                    <div>
                      <p
                        className={`text-sm ${n.unread ? "font-medium text-gray-800 dark:text-neutral-200" : "text-gray-600 dark:text-neutral-400"}`}
                      >
                        {n.title}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-neutral-500 mt-0.5">
                        {n.time}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
            <div className="px-4 py-2.5 border-t border-gray-200 dark:border-neutral-700">
              <Link
                href="/admin/notifications"
                className="text-xs text-blue-600 hover:underline dark:text-blue-400"
              >
                View all notifications →
              </Link>
            </div>
          </div>
        </div>

        {/* ── User avatar ── */}
        <div
          className="hs-dropdown relative"
          data-hs-dropdown-placement="bottom-right"
        >
          <button
            id="topbar-user"
            type="button"
            className="hs-dropdown-toggle flex items-center gap-x-2 rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
            aria-label="User menu"
          >
            <span className="flex items-center justify-center size-8 rounded-full bg-gray-200 text-gray-700 text-xs font-bold dark:bg-neutral-700 dark:text-neutral-300">
              SC
            </span>
            <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-neutral-300">
              default
            </span>
            <svg
              className="size-4 text-gray-400 dark:text-neutral-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* User dropdown */}
          <div
            className="hs-dropdown-menu hs-dropdown-open:opacity-100 hidden min-w-48 bg-white shadow-md rounded-xl border border-gray-200 p-1 dark:bg-neutral-800 dark:border-neutral-700"
            aria-labelledby="topbar-user"
          >
            <div className="px-3 py-2 border-b border-gray-200 dark:border-neutral-700 mb-1">
              <p className="text-sm font-semibold text-gray-800 dark:text-neutral-200">
                default
              </p>
              <p className="text-xs text-gray-500 dark:text-neutral-400">
                default@example.com
              </p>
            </div>
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
    </header>
  );
}
