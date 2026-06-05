"use client";

import { useEffect, useState } from "react";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";

import type { UserDetails } from "@/services/user/getUserDetails";
import { getUserDetails } from "@/services/user/getUserDetails";

// ─── Helpers ──────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: "0.68rem",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "oklch(0.708 0 0)",
        marginBottom: "1.5rem",
      }}
    >
      {children}
    </p>
  );
}

function FieldRow({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1rem",
        paddingBlock: "1.25rem",
        borderBottom: "1px solid oklch(0.922 0 0)",
        alignItems: "start",
      }}
    >
      <div>
        <p
          style={{
            fontSize: "0.875rem",
            fontWeight: 500,
            marginBottom: hint ? "0.25rem" : 0,
          }}
        >
          {label}
        </p>
        {hint && (
          <p
            style={{
              fontSize: "0.75rem",
              color: "oklch(0.708 0 0)",
              lineHeight: 1.5,
            }}
          >
            {hint}
          </p>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}

function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      style={{
        width: 40,
        height: 22,
        borderRadius: 11,
        border: "none",
        background: enabled ? "oklch(0.145 0 0)" : "oklch(0.922 0 0)",
        cursor: "pointer",
        position: "relative",
        transition: "background 0.2s",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: enabled ? 21 : 3,
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "white",
          transition: "left 0.2s",
          display: "block",
        }}
      />
    </button>
  );
}

function SaveButton({
  onClick,
  saved,
}: {
  onClick: () => void;
  saved: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "0.5rem 1.5rem",
        fontSize: "0.8rem",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        background: saved ? "oklch(0.922 0 0)" : "oklch(0.145 0 0)",
        color: saved ? "oklch(0.556 0 0)" : "white",
        border: "none",
        borderRadius: 4,
        cursor: "pointer",
        transition: "all 0.2s",
        fontFamily: "var(--font-geist-sans), sans-serif",
      }}
    >
      {saved ? "Saved ✓" : "Save changes"}
    </button>
  );
}

function NavItem({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        padding: "0.5rem 0.75rem",
        fontSize: "0.875rem",
        fontWeight: active ? 500 : 400,
        color: active ? "oklch(0.145 0 0)" : "oklch(0.556 0 0)",
        background: active ? "oklch(0.97 0 0)" : "transparent",
        border: "none",
        borderRadius: 4,
        cursor: "pointer",
        fontFamily: "var(--font-geist-sans), sans-serif",
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );
}

// ─── Sections ─────────────────────────────────────────────────

function ProfileSection({ user }: { user: UserDetails }) {
  const [firstName, setFirstName] = useState(user.firstName ?? "");
  const [lastName, setLastName] = useState(user.lastName ?? "");
  const [email, setEmail] = useState(user.email ?? "");
  const [bio, setBio] = useState(user.bio ?? "");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    // TODO: wire to your API
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <SectionLabel>Profile</SectionLabel>
      <FieldRow label="First name">
        <Input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First name"
        />
      </FieldRow>
      <FieldRow label="Last name">
        <Input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}

          placeholder="Last name"
        />
      </FieldRow>
      <FieldRow label="Email" hint="Address associated with your account.">
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="you@example.com"
        />
      </FieldRow>
      <FieldRow
        label="Bio"
        hint="A short description shown on your public profile."
      >
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us a little about yourself…"
          rows={3}
          style={{
            width: "100%",
            padding: "0.5rem 0.75rem",
            fontSize: "0.875rem",
            border: "1px solid oklch(0.922 0 0)",
            borderRadius: 4,
            background: "oklch(0.985 0 0)",
            color: "oklch(0.145 0 0)",
            outline: "none",
            resize: "vertical",
            boxSizing: "border-box",
            fontFamily: "var(--font-geist-sans), sans-serif",
            lineHeight: 1.6,
          }}
          onFocus={(e) =>
            (e.currentTarget.style.borderColor = "oklch(0.556 0 0)")
          }
          onBlur={(e) =>
            (e.currentTarget.style.borderColor = "oklch(0.922 0 0)")
          }
        />
      </FieldRow>
      <div style={{ paddingTop: "1.5rem" }}>
        <SaveButton onClick={handleSave} saved={saved} />
      </div>
    </div>
  );
}

function AccountSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saved, setSaved] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  function handleSave() {
    // TODO: wire to your API
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <SectionLabel>Account</SectionLabel>
      <FieldRow label="Current password">
        <Input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="••••••••"
        />
      </FieldRow>
      <FieldRow label="New password" hint="Minimum 8 characters.">
        <Input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="••••••••"
        />
      </FieldRow>
      <FieldRow label="Confirm new password">
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
        />
      </FieldRow>
      <div style={{ paddingTop: "1.5rem" }}>
        <SaveButton onClick={handleSave} saved={saved} />
      </div>

      <div
        style={{
          marginTop: "3rem",
          paddingTop: "2rem",
          borderTop: "1px solid oklch(0.922 0 0)",
        }}
      >
        <p
          style={{
            fontSize: "0.68rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "oklch(0.637 0.237 25.331)",
            marginBottom: "1rem",
          }}
        >
          Danger zone
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem",
            border: "1px solid oklch(0.922 0 0)",
            borderRadius: 4,
          }}
        >
          <div>
            <p
              style={{
                fontSize: "0.875rem",
                fontWeight: 500,
                marginBottom: "0.25rem",
              }}
            >
              Delete account
            </p>
            <p style={{ fontSize: "0.75rem", color: "oklch(0.708 0 0)" }}>
              Permanently remove your account and all data.
            </p>
          </div>
          {deleteConfirm ? (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => setDeleteConfirm(false)}
                style={{
                  padding: "0.4rem 0.9rem",
                  fontSize: "0.75rem",
                  border: "1px solid oklch(0.922 0 0)",
                  borderRadius: 4,
                  background: "white",
                  cursor: "pointer",
                  fontFamily: "var(--font-geist-sans), sans-serif",
                }}
              >
                Cancel
              </button>
              <button
                style={{
                  padding: "0.4rem 0.9rem",
                  fontSize: "0.75rem",
                  border: "none",
                  borderRadius: 4,
                  background: "oklch(0.637 0.237 25.331)",
                  color: "white",
                  cursor: "pointer",
                  fontFamily: "var(--font-geist-sans), sans-serif",
                }}
              >
                Confirm delete
              </button>
            </div>
          ) : (
            <button
              onClick={() => setDeleteConfirm(true)}
              style={{
                padding: "0.4rem 0.9rem",
                fontSize: "0.75rem",
                border: "1px solid oklch(0.922 0 0)",
                borderRadius: 4,
                background: "white",
                color: "oklch(0.637 0.237 25.331)",
                cursor: "pointer",
                fontFamily: "var(--font-geist-sans), sans-serif",
              }}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function NotificationsSection() {
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

function AppearanceSection() {
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

// ─── Page ─────────────────────────────────────────────────────

type Section = "profile" | "account" | "notifications" | "appearance";

const SECTIONS: { id: Section; label: string }[] = [
  { id: "profile", label: "Profile" },
  { id: "account", label: "Account" },
  { id: "notifications", label: "Notifications" },
  { id: "appearance", label: "Appearance" },
];

export default function SettingsPage() {
  const [active, setActive] = useState<Section>("profile");
  const [user, setUser] = useState<UserDetails | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await getUserDetails();
        setUser(userData);
      } catch (err) {
        console.error("Failed to load user", err);
      }
    }
    loadUser();
  }, []);

  return (
    <div style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}>
      <Navbar user={user} />

      <main
        style={{ maxWidth: 1280, margin: "0 auto", padding: "4rem 2rem 6rem" }}
      >
        <h1
          style={{
            fontFamily: "'Georgia', serif",
            fontWeight: 400,
            fontSize: "1.65rem",
            marginBottom: "0.5rem",
          }}
        >
          Settings
        </h1>
        <p
          style={{
            fontSize: "0.875rem",
            color: "oklch(0.708 0 0)",
            marginBottom: "3rem",
          }}
        >
          Manage your profile, security, and preferences.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "180px 1fr",
            gap: "3rem",
            alignItems: "start",
          }}
        >
          <nav
            style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
          >
            {SECTIONS.map((s) => (
              <NavItem
                key={s.id}
                label={s.label}
                active={active === s.id}
                onClick={() => setActive(s.id)}
              />
            ))}
          </nav>

          <div
            style={{
              borderTop: "1px solid oklch(0.922 0 0)",
              paddingTop: "1.5rem",
              minHeight: 400,
            }}
          >
            {active === "profile" && user && <ProfileSection user={user} />}
            {active === "profile" && !user && (
              <p style={{ fontSize: "0.875rem", color: "oklch(0.708 0 0)" }}>
                Loading…
              </p>
            )}
            {active === "account" && <AccountSection />}
            {active === "notifications" && <NotificationsSection />}
            {active === "appearance" && <AppearanceSection />}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
