"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Bell, Search, ChevronRight } from "lucide-react";

function buildCrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map((seg, i) => ({
    label: seg.charAt(0).toUpperCase() + seg.slice(1),
    href: "/" + segments.slice(0, i + 1).join("/"),
  }));
  return crumbs;
}

export function AdminTopbar() {
  const pathname = usePathname();
  const crumbs = buildCrumbs(pathname);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const handleOutsideClick = () => {
    setShowNotifications(false);
    setShowUserMenu(false);
    setShowSearch(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center justify-between px-6 h-14">
          {/* Breadcrumbs */}
          <nav className="hidden sm:flex items-center gap-x-1.5 text-sm">
            {crumbs.map((crumb, idx) => {
              const isLast = idx === crumbs.length - 1;
              return (
                <div key={crumb.href} className="flex items-center gap-x-1.5">
                  {idx > 0 && (
                    <ChevronRight className="size-3 text-neutral-400" />
                  )}
                  {isLast ? (
                    <span className="text-neutral-600 dark:text-neutral-400">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="flex-1" />

          {/* Search */}
          <div className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400" />
              <input
                type="search"
                className="w-56 pl-8 pr-3 py-1.5 text-sm rounded-md border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 transition-colors"
                placeholder="Search..."
              />
            </div>
          </div>

          {/* Search mobile */}
          <div className="relative md:hidden">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 -m-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              <Search className="size-4" />
            </button>
            {showSearch && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowSearch(false)}
                />
                <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-neutral-950 rounded-lg shadow-lg border border-neutral-100 dark:border-neutral-800 p-2 z-50">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400" />
                    <input
                      type="search"
                      className="w-full pl-8 pr-3 py-2 text-sm rounded-md border border-neutral-200 dark:border-neutral-800 bg-transparent focus:outline-none focus:border-neutral-400"
                      placeholder="Search..."
                      autoFocus
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="p-2 -m-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              <Bell className="size-4" />
            </button>

            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-neutral-950 rounded-lg shadow-lg border border-neutral-100 dark:border-neutral-800 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
                    <h3 className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                      Notifications
                    </h3>
                  </div>
                  <ul className="divide-y divide-neutral-50 dark:divide-neutral-900 max-h-80 overflow-y-auto">
                    {[
                      { title: "New order received", time: "2 min ago" },
                      { title: "Server usage at 90%", time: "1 hr ago" },
                      { title: "New user registered", time: "3 hrs ago" },
                    ].map((n) => (
                      <li key={n.title}>
                        <button className="w-full text-left px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                          <p className="text-sm text-neutral-700 dark:text-neutral-300">
                            {n.title}
                          </p>
                          <p className="text-xs text-neutral-400 mt-0.5">
                            {n.time}
                          </p>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>

          {/* User */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-x-2 p-1 -m-1 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
            >
              <div className="size-7 rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 text-xs font-medium flex items-center justify-center">
                AD
              </div>
            </button>

            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-neutral-950 rounded-lg shadow-lg border border-neutral-100 dark:border-neutral-800 overflow-hidden z-50">
                  <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-800">
                    <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                      admin@example.com
                    </p>
                  </div>
                  <div className="p-1">
                    <Link
                      href="/admin/profile"
                      className="block px-3 py-2 rounded-md text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/admin/settings/billing"
                      className="block px-3 py-2 rounded-md text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                    >
                      Billing
                    </Link>
                    <div className="border-t border-neutral-100 dark:border-neutral-800 my-1" />
                    <button className="w-full text-left px-3 py-2 rounded-md text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {(showNotifications || showUserMenu || showSearch) && (
        <div className="fixed inset-0 z-30" onClick={handleOutsideClick} />
      )}
    </>
  );
}
