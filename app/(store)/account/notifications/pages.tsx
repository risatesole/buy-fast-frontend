"use client";

import { useState } from "react";
import { SectionLabel } from "@/components/account/SectionLabel";
import { Toggle } from "@/components/account/Toggle";
import { SaveButton } from "@/components/account/SaveButton";

export default function NotificationsPage() {
  const [prefs, setPrefs] = useState({
    orderUpdates: true,
    promotions: false,
    newArrivals: true,
    accountAlerts: true,
    weeklyDigest: false,
  });

  const [saved, setSaved] = useState(false);
  
  function toggle(key: keyof typeof prefs) {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  }
  
  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const items: { key: keyof typeof prefs; label: string; hint: string }[] = [
    {
      key: "orderUpdates",
      label: "Order updates",
      hint: "Shipping, delivery, and return status.",
    },
    {
      key: "promotions",
      label: "Promotions & offers",
      hint: "Sales, coupons, and special events.",
    },
    {
      key: "newArrivals",
      label: "New arrivals",
      hint: "When new products join the collection.",
    },
    {
      key: "accountAlerts",
      label: "Account alerts",
      hint: "Password changes, login from new device.",
    },
    {
      key: "weeklyDigest",
      label: "Weekly digest",
      hint: "A summary of activity every Monday.",
    },
  ];

  return (
    <div>
      <SectionLabel>Notifications</SectionLabel>
      {items.map(({ key, label, hint }) => (
        <div
          key={key}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBlock: "1.25rem",
            borderBottom: "1px solid oklch(0.922 0 0)",
            gap: "1rem",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "0.875rem",
                fontWeight: 500,
                marginBottom: "0.2rem",
              }}
            >
              {label}
            </p>
            <p style={{ fontSize: "0.75rem", color: "oklch(0.708 0 0)" }}>
              {hint}
            </p>
          </div>
          <Toggle enabled={prefs[key]} onChange={() => toggle(key)} />
        </div>
      ))}
      <div style={{ paddingTop: "1.5rem" }}>
        <SaveButton onClick={handleSave} saved={saved} />
      </div>
    </div>
  );
}
