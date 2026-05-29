"use client";

import Image from "next/image";
import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { ProductCard } from "@/components/product-card";

// ─── Types ───────────────────────────────────────────────────────────────────

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  badge?: string;
};

type CartItem = Product & { qty: number };

// ─── Data ────────────────────────────────────────────────────────────────────

const CATEGORIES = ["All", "Books", "Notebooks", "Pens", "College"];

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Meditations — Marcus Aurelius",
    category: "Books",
    price: 12.99,
    badge: "Bestseller",
  },
  { id: 2, name: "Atomic Habits", category: "Books", price: 16.5 },
  { id: 3, name: "The Elements of Style", category: "Books", price: 9.99 },
  { id: 4, name: "Deep Work", category: "Books", price: 14.99 },
  {
    id: 5,
    name: "Leuchtturm1917 A5 Dotted",
    category: "Notebooks",
    price: 22.0,
    badge: "New",
  },
  {
    id: 6,
    name: "Moleskine Classic Ruled",
    category: "Notebooks",
    price: 18.95,
  },
  { id: 7, name: "Rhodia Webnotebook", category: "Notebooks", price: 19.5 },
  { id: 8, name: "Field Notes 3-Pack", category: "Notebooks", price: 13.0 },
  {
    id: 9,
    name: "Pilot G2 — 12 Pack",
    category: "Pens",
    price: 11.49,
    badge: "Bestseller",
  },
  {
    id: 10,
    name: "Staedtler Triplus Fineliner",
    category: "Pens",
    price: 14.0,
  },
  {
    id: 11,
    name: "Lamy Safari Fountain Pen",
    category: "Pens",
    price: 29.99,
    badge: "New",
  },
  { id: 12, name: "Sakura Micron Set — 6pk", category: "Pens", price: 16.75 },
  {
    id: 13,
    name: "Scientific Calculator FX-991",
    category: "College",
    price: 19.99,
  },
  { id: 14, name: "Index Card Set — 200pk", category: "College", price: 5.49 },
  { id: 15, name: "Binder Tabs — Assorted", category: "College", price: 4.99 },
  {
    id: 16,
    name: "Mechanical Pencil 0.5mm — 5pk",
    category: "College",
    price: 8.5,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

// ─── Sub-components ──────────────────────────────────────────────────────────

function Hero() {
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

function CartDrawer({
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

// ─── Icon helpers ─────────────────────────────────────────────────────────────

function CartIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Page() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing)
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i,
        );
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id: number) =>
    setCart((prev) => prev.filter((i) => i.id !== id));

  const filtered =
    activeCategory === "All"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <div style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}>
      <Navbar />
      <main>
        <Hero />

        {/* Products section */}
        <section
          id="products"
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "4rem 2rem 6rem",
          }}
        >
          {/* Section header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: "3rem",
              flexWrap: "wrap",
              gap: "1.25rem",
            }}
          >
            <h2
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontWeight: 400,
                fontSize: "1.65rem",
                letterSpacing: "-0.02em",
                color: "oklch(0.145 0 0)",
              }}
            >
              The Collection
            </h2>

            {/* Category filter */}
            <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    background:
                      activeCategory === cat ? "oklch(0.145 0 0)" : "none",
                    color:
                      activeCategory === cat
                        ? "oklch(0.985 0 0)"
                        : "oklch(0.556 0 0)",
                    border: "1px solid",
                    borderColor:
                      activeCategory === cat
                        ? "oklch(0.145 0 0)"
                        : "oklch(0.922 0 0)",
                    borderRadius: 3,
                    padding: "0.4rem 1rem",
                    cursor: "pointer",
                    fontFamily: "var(--font-geist-sans), sans-serif",
                    fontSize: "0.72rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    transition: "all 0.15s",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "2.5rem 2rem",
            }}
          >
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={addToCart}
              />
            ))}
          </div>
        </section>

        {/* Editorial band */}
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
            {[
              { label: "Free Shipping", detail: "On orders over $35" },
              { label: "Same-Day Dispatch", detail: "Order before 2 PM" },
              { label: "Easy Returns", detail: "30-day no-hassle policy" },
            ].map(({ label, detail }) => (
              <div key={label}>
                <p
                  style={{
                    fontFamily: "'Georgia', 'Times New Roman', serif",
                    fontSize: "1.05rem",
                    color: "oklch(0.145 0 0)",
                    marginBottom: "0.4rem",
                  }}
                >
                  {label}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-geist-sans), sans-serif",
                    fontSize: "0.8rem",
                    color: "oklch(0.556 0 0)",
                  }}
                >
                  {detail}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
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
          <p
            style={{
              fontFamily: "var(--font-geist-sans), sans-serif",
              fontSize: "0.72rem",
              color: "oklch(0.708 0 0)",
              letterSpacing: "0.04em",
            }}
          >
            {new Date().getFullYear()} BuyFast. All rights reserved.
          </p>
          <nav style={{ display: "flex", gap: "1.5rem" }}>
            {["Privacy", "Terms", "Contact"].map((l) => (
              <a
                key={l}
                href="#"
                style={{
                  fontFamily: "var(--font-geist-sans), sans-serif",
                  fontSize: "0.72rem",
                  letterSpacing: "0.06em",
                  color: "oklch(0.556 0 0)",
                  textDecoration: "none",
                }}
              >
                {l}
              </a>
            ))}
          </nav>
        </div>
      </footer>

      <CartDrawer
        open={cartOpen}
        items={cart}
        onClose={() => setCartOpen(false)}
        onRemove={removeFromCart}
      />
    </div>
  );
}
