"use client";

import { useState } from "react";
import { SectionLabel } from "@/components/account/SectionLabel";
import { FieldRow } from "@/components/account/FieldRow";
import { SaveButton } from "@/components/account/SaveButton";

export default function AppearancePage() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [saved, setSaved] = useState(false);
  
  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const options: {
    value: "light" | "dark" | "system";
    label: string;
    desc: string;
  }[] = [
    { value: "light", label: "Light", desc: "Clean white background." },
    { value: "dark", label: "Dark", desc: "Easy on the eyes at night." },
    { value: "system", label: "System", desc: "Follows your OS preference." },
  ];

  return (
    <div>
      <SectionLabel>Appearance</SectionLabel>
      <FieldRow label="Theme" hint="Choose how BuyFast looks for you.">
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          {options.map((opt) => (
            <label
              key={opt.value}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem",
                border: `1px solid ${theme === opt.value ? "oklch(0.556 0 0)" : "oklch(0.922 0 0)"}`,
                borderRadius: 4,
                cursor: "pointer",
                background: theme === opt.value ? "oklch(0.97 0 0)" : "white",
                transition: "all 0.15s",
              }}
            >
              <input
                type="radio"
                name="theme"
                value={opt.value}
                checked={theme === opt.value}
                onChange={() => setTheme(opt.value)}
                style={{ accentColor: "oklch(0.145 0 0)" }}
              />
              <div>
                <p style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                  {opt.label}
                </p>
                <p style={{ fontSize: "0.72rem", color: "oklch(0.708 0 0)" }}>
                  {opt.desc}
                </p>
              </div>
            </label>
          ))}
        </div>
      </FieldRow>
      <div style={{ paddingTop: "1.5rem" }}>
        <SaveButton onClick={handleSave} saved={saved} />
      </div>
    </div>
  );
}