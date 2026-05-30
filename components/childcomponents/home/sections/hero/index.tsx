type HeadlineProps = {
  text: string;
};

function Headline({ text }: HeadlineProps) {
  const parts = text.split(/(\*[^*]+\*)/g);

  return (
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
      {parts.map((part, index) =>
        part.startsWith("*") && part.endsWith("*") ? (
          <em key={index}>{part.slice(1, -1)}</em>
        ) : (
          part
        )
      )}
    </h1>
  );
}

type PreheadlineProps = {
  text: string;
};

function Preheadline({ text }: PreheadlineProps) {
  return (
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
      {text}
    </p>
  );
}

type HeroSectionProps = {
  headline: string;
  preheadline: string;
};

export function HeroSection({
  headline,
  preheadline,
}: HeroSectionProps) {
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
        <Preheadline text={preheadline} />
        <Headline text={headline} />
      </div>
    </section>
  );
}