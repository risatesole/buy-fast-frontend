import type { CartItem } from "@/types/CartItem";


const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

export function CartDrawer({
  open,
  items,
  onClose,
  onRemove,
}: {
  open: boolean;
  items: CartItem[];
  onClose: () => void;
  onRemove: (id: number) => void;
}) {
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "oklch(0.145 0 0 / 30%)",
          zIndex: 80,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.25s",
        }}
      />

      {/* Panel */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: 380,
          background: "oklch(1 0 0)",
          zIndex: 90,
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
          display: "flex",
          flexDirection: "column",
          borderLeft: "1px solid oklch(0.922 0 0)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.75rem 1.75rem 1.25rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            borderBottom: "1px solid oklch(0.922 0 0)",
          }}
        >
          <h2
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontWeight: 400,
              fontSize: "1.2rem",
              color: "oklch(0.145 0 0)",
            }}
          >
            Your Cart
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "oklch(0.556 0 0)",
              fontSize: "1.25rem",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.75rem" }}>
          {items.length === 0 ? (
            <p
              style={{
                fontFamily: "var(--font-geist-sans), sans-serif",
                color: "oklch(0.708 0 0)",
                fontSize: "0.85rem",
                marginTop: "2rem",
                textAlign: "center",
              }}
            >
              Your cart is empty.
            </p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  padding: "1rem 0",
                  borderBottom: "1px solid oklch(0.922 0 0)",
                  gap: "0.75rem",
                }}
              >
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontFamily: "'Georgia', 'Times New Roman', serif",
                      fontSize: "0.9rem",
                      color: "oklch(0.145 0 0)",
                      lineHeight: 1.4,
                      marginBottom: "0.3rem",
                    }}
                  >
                    {item.name}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: "0.78rem",
                      color: "oklch(0.439 0 0)",
                    }}
                  >
                    {fmt(item.price)} × {item.qty}
                  </p>
                </div>
                <button
                  onClick={() => onRemove(item.id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "oklch(0.708 0 0)",
                    fontSize: "0.9rem",
                    padding: "0 4px",
                  }}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            style={{
              padding: "1.5rem 1.75rem",
              borderTop: "1px solid oklch(0.922 0 0)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1.25rem",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-geist-sans), sans-serif",
                  fontSize: "0.8rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "oklch(0.556 0 0)",
                }}
              >
                Total
              </span>
              <span
                style={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontWeight: 600,
                  fontSize: "1rem",
                  color: "oklch(0.145 0 0)",
                }}
              >
                {fmt(total)}
              </span>
            </div>
            <button
              style={{
                width: "100%",
                background: "oklch(0.145 0 0)",
                color: "oklch(0.985 0 0)",
                border: "none",
                borderRadius: 4,
                padding: "0.9rem",
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontSize: "0.82rem",
                letterSpacing: "0.06em",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Checkout
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
