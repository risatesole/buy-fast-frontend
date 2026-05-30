const FOOTER_LINKS = ["Privacy", "Terms", "Contact"];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        borderTop: "1px solid oklch(0.922 0 0)",
        padding: "2.5rem 2rem",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        {/* Brand name */}
        <span
          style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: "0.95rem",
            color: "oklch(0.145 0 0)",
            letterSpacing: "-0.02em",
          }}
        >
          buyfast
        </span>

        {/* Copyright */}
        <p
          style={{
            fontFamily: "var(--font-geist-sans), sans-serif",
            fontSize: "0.72rem",
            color: "oklch(0.708 0 0)",
            letterSpacing: "0.04em",
          }}
        >
          {currentYear} BuyFast. All rights reserved.
        </p>

        {/* Legal links */}
        <nav style={{ display: "flex", gap: "1.5rem" }}>
          {FOOTER_LINKS.map(function (linkLabel) {
            return (
              <a
                key={linkLabel}
                href="#"
                style={{
                  fontFamily: "var(--font-geist-sans), sans-serif",
                  fontSize: "0.72rem",
                  letterSpacing: "0.06em",
                  color: "oklch(0.556 0 0)",
                  textDecoration: "none",
                }}
              >
                {linkLabel}
              </a>
            );
          })}
        </nav>
      </div>
    </footer>
  );
}

