type HeroHeadlineProps = {
  text: string;
};

export function HeroHeadline({ text }: HeroHeadlineProps) {
  const parts = text.split(/(\*[^*]+\*)/g);

  return (
    <h1
      style={{
        fontFamily: "'Georgia', 'Times New Roman', serif",
        fontSize: 'clamp(2.5rem, 5vw, 4.25rem)',
        fontWeight: 400,
        lineHeight: 1.08,
        letterSpacing: '-0.03em',
        color: 'oklch(0.145 0 0)',
        margin: 0,
      }}
    >
      {parts.map((part, index) =>
        part.startsWith('*') && part.endsWith('*') ? <em key={index}>{part.slice(1, -1)}</em> : part
      )}
    </h1>
  );
}
