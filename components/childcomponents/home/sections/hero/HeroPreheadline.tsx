type HeroPreheadlineProps = {
  text: string;
};

export function HeroPreheadline({ text }: HeroPreheadlineProps) {
  return (
    <p
      style={{
        fontFamily: 'var(--font-geist-sans), sans-serif',
        fontSize: '0.72rem',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'oklch(0.556 0 0)',
        marginBottom: '1.25rem',
      }}
    >
      {text}
    </p>
  );
}
