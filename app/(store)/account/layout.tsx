import { SettingsNav } from "@/components/account/SettingsNav";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}>
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "4rem 2rem 6rem" }}>
        <h1
          style={{
            fontFamily: "'Georgia', serif",
            fontWeight: 400,
            fontSize: "1.65rem",
            marginBottom: "0.5rem",
          }}
        >
          account
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
          <SettingsNav />
          
          <div
            style={{
              borderTop: "1px solid oklch(0.922 0 0)",
              paddingTop: "1.5rem",
              minHeight: 400,
            }}
          >
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}