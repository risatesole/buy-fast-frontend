export function FieldRow({
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