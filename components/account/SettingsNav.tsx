"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SECTIONS = [
  { id: "account", label: "Account", href: "/account/account" },
  { id: "orders", label: "Orders", href: "/account/orders" },
];

export function SettingsNav({ 
  mobile = false,
  onItemClick = () => {}
}: { 
  mobile?: boolean;
  onItemClick?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav
      style={{
        display: "flex",
        flexDirection: mobile ? "column" : "column",
        gap: "0.25rem",
        width: "100%",
      }}
    >
      {SECTIONS.map((s) => {
        const isActive = pathname === s.href;
        return (
          <Link
            key={s.id}
            href={s.href}
            onClick={onItemClick}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              padding: mobile ? "0.75rem 1rem" : "0.5rem 0.75rem",
              fontSize: mobile ? "0.875rem" : "0.875rem",
              fontWeight: isActive ? 500 : 400,
              color: isActive ? "oklch(0.145 0 0)" : "oklch(0.556 0 0)",
              background: isActive ? "oklch(0.97 0 0)" : "transparent",
              border: "none",
              borderLeft: isActive ? "3px solid oklch(0.145 0 0)" : "3px solid transparent",
              borderRadius: 4,
              cursor: "pointer",
              fontFamily: "var(--font-geist-sans), sans-serif",
              transition: "all 0.15s",
              textDecoration: "none",
              // Fix the border/borderColor conflict
              borderTop: "none",
              borderRight: "none",
              borderBottom: "none",
            }}
          >
            {s.label}
          </Link>
        );
      })}
    </nav>
  );
}
