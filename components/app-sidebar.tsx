"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Package,
  ChevronDown,
  Menu,
  Truck
} from "lucide-react";

const platformItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
    sub: [
      { title: "Admin", url: "/admin" },
      { title: "Overview", url: "/admin/dashboard/overview" },
      { title: "Reports", url: "/admin/dashboard/reports" },
    ],
  },
  {
    title: "Customer",
    url: "/admin/customer",
    icon: Users,
    sub: [
      { title: "Customers", url: "/admin/customers" },
      { title: "Orders", url: "/admin/customers/orders" },
    ],
  },
  {
    title: "Employee",
    icon: Users,
    sub: [
      { title: "Employee", url: "/admin/employee" }
    ],
  },
  {
    title: "Products",
    icon: Package,
    sub: [
      { title: "products", url: "/admin/products" },
      { title: "Categories", url: "/admin/products/categories" },
    ],
  },
  {
    title: "Inentory",
    icon: Truck,
    sub: [
      { title: "Inventory", url: "/admin/inventory" },
      {title: "Stock Movement", url: "/admin/inventory/stockmovement"},
      { title: "Management", url: "/admin/inventory/manage" },
    ],
  },
];

const SidebarSubItems = [
  { title: "Getting started", url: "/admin/help/gettingstarted" },
  { title: "Manual", url: "/admin/help/gettingstarted" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const toggleAccordion = (id: string) => {
    setOpenAccordions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || "My Company";

  const isActive = (url?: string) => !!url && pathname === url;
  const isSubActive = (subItems?: { url: string }[]) =>
    subItems?.some((sub) => pathname === sub.url);

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 bottom-0 z-50 w-56 bg-white dark:bg-neutral-950
          border-r border-neutral-100 dark:border-neutral-800
          transition-transform duration-300 ease-out
          lg:translate-x-0
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="px-5 py-5 border-b border-neutral-100 dark:border-neutral-800">
          <Link href="/" className="flex items-center gap-x-2.5">
            <div className="size-7 rounded bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-medium flex items-center justify-center">
              {companyName[0].toUpperCase()}
            </div>
            <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {companyName}
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-y-6 px-3 py-6 h-[calc(100%-57px)] overflow-y-auto">
          {/* Platform */}
          <div>
            <p className="px-3 mb-2 text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-600">
              Platform
            </p>
            <ul className="space-y-0.5">
              {platformItems.map((item) => {
                const Icon = item.icon;
                const hasSub = !!item.sub;
                const accordionId = `acc-${item.title.toLowerCase().replace(/\s+/g, "-")}`;
                const isOpen =
                  openAccordions[accordionId] || isSubActive(item.sub);
                const isItemActive =
                  isActive(item.url) || (hasSub && isSubActive(item.sub));

                if (!hasSub) {
                  return (
                    <li key={item.title}>
                      <Link
                        href={item.url ?? "#"}
                        className={`
                          flex items-center gap-x-3 px-3 py-2 rounded-md text-sm transition-colors
                          ${
                            isItemActive
                              ? "text-neutral-900 dark:text-neutral-100 bg-neutral-50 dark:bg-neutral-900"
                              : "text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                          }
                        `}
                      >
                        <Icon className="size-4 shrink-0" />
                        {item.title}
                      </Link>
                    </li>
                  );
                }

                return (
                  <li key={item.title}>
                    <button
                      onClick={() => toggleAccordion(accordionId)}
                      className={`
                        w-full flex items-center gap-x-3 px-3 py-2 rounded-md text-sm transition-colors
                        ${
                          isItemActive
                            ? "text-neutral-900 dark:text-neutral-100 bg-neutral-50 dark:bg-neutral-900"
                            : "text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                        }
                      `}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="flex-1 text-left">{item.title}</span>
                      <ChevronDown
                        className={`size-3.5 shrink-0 transition-transform duration-200 ${
                          isOpen ? "-rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <ul className="ml-9 mt-1 space-y-0.5">
                        {item.sub.map((sub) => {
                          const isSubActiveItem = isActive(sub.url);
                          return (
                            <li key={sub.title}>
                              <Link
                                href={sub.url}
                                className={`
                                  block px-3 py-1.5 rounded-md text-sm transition-colors
                                  ${
                                    isSubActiveItem
                                      ? "text-neutral-900 dark:text-neutral-100 font-medium"
                                      : "text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                                  }
                                `}
                              >
                                {sub.title}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Projects */}
          <div>
            <p className="px-3 mb-2 text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-600">
              Help
            </p>
            <ul className="space-y-0.5">
              {SidebarSubItems.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.url}
                    className={`
                      block px-3 py-2 rounded-md text-sm transition-colors
                      ${
                        isActive(item.url)
                          ? "text-neutral-900 dark:text-neutral-100 bg-neutral-50 dark:bg-neutral-900"
                          : "text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                      }
                    `}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <div className="mt-auto pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <div className="px-3 py-2">
              <div className="flex items-center gap-x-3">
                <div className="size-7 rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 text-xs font-medium flex items-center justify-center">
                  {companyName[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100 truncate">
                    admin@example.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </aside>

      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed bottom-5 right-5 z-30 p-3 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-md hover:opacity-80 transition-opacity"
      >
        <Menu className="size-4" />
      </button>
    </>
  );
}
