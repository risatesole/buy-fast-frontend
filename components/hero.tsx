
export function Hero() {
  return (
    <section
      style={{
        maxWidth: 1280,
        margin: "0 auto",
        padding: "5rem 2rem 4rem",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "4rem",
        alignItems: "end",
        borderBottom: "1px solid oklch(0.922 0 0)",
      }}
    >
      <div>
        <p
          style={{
            fontFamily: "var(--font-geist-sans), sans-serif",
            fontSize: "0.72rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "oklch(0.556 0 0)",
            marginBottom: "1.25rem",
          }}
        >
          Universidad Autonoma de Santo Domingo semestre 2026
        </p>
        <h1
          style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: "clamp(2.5rem, 5vw, 4.25rem)",
            fontWeight: 400,
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            color: "oklch(0.145 0 0)",
            margin: 0,
          }}
        >
          Todo lo que
          <br />
          necesitas
          <br />
          para tu vida
          <br />
          <em>universitaria.</em>
        </h1>
      </div>
    </section>
  );
}