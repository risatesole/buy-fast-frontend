"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SECTIONS = [
  { id: "profile", label: "Profile", href: "/account/profile" },
  { id: "account", label: "Account", href: "/account/account" },
  { id: "notifications", label: "Notifications", href: "/account/notifications" },
  { id: "appearance", label: "Appearance", href: "/account/appearance" },
];

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
      {SECTIONS.map((s) => {
        const isActive = pathname === s.href;
        return (
          <Link
            key={s.id}
            href={s.href}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              padding: "0.5rem 0.75rem",
              fontSize: "0.875rem",
              fontWeight: isActive ? 500 : 400,
              color: isActive ? "oklch(0.145 0 0)" : "oklch(0.556 0 0)",
              background: isActive ? "oklch(0.97 0 0)" : "transparent",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontFamily: "var(--font-geist-sans), sans-serif",
              transition: "all 0.15s",
              textDecoration: "none",
            }}
          >
            {s.label}
          </Link>
        );
      })}
    </nav>
  );
}