// Trust-badge data shown in the strip between products and footer.
const TRUST_BADGES = [
  { label: "Free Shipping", detail: "On orders over $35" },
  { label: "Same-Day Dispatch", detail: "Order before 2 PM" },
  { label: "Easy Returns", detail: "30-day no-hassle policy" },
];

/** One cell in the trust-badge strip (Free Shipping, Same-Day Dispatch, etc.). */
function TrustBadge(props: { label: string; detail: string }) {
  return (
    <div>
      <p
        style={{
          fontFamily: "'Georgia', 'Times New Roman', serif",
          fontSize: "1.05rem",
          color: "oklch(0.145 0 0)",
          marginBottom: "0.4rem",
        }}
      >
        {props.label}
      </p>
      <p
        style={{
          fontFamily: "var(--font-geist-sans), sans-serif",
          fontSize: "0.8rem",
          color: "oklch(0.556 0 0)",
        }}
      >
        {props.detail}
      </p>
    </div>
  );
}
/** The horizontal strip that sits between the product grid and the footer. */
export function TrustBadgeStrip() {
  return (
    <section
      style={{
        borderTop: "1px solid oklch(0.922 0 0)",
        borderBottom: "1px solid oklch(0.922 0 0)",
        background: "oklch(0.985 0 0)",
        padding: "4rem 2rem",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "2rem",
          textAlign: "center",
        }}
      >
        {TRUST_BADGES.map(function (badge) {
          return (
            <TrustBadge
              key={badge.label}
              label={badge.label}
              detail={badge.detail}
            />
          );
        })}
      </div>
    </section>
  );
}

