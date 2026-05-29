"use client";

import Image from "next/image";
import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { ProductCard } from "@/components/product-card";
import { Hero } from "@/components/hero";
import type { Product } from "@/types/products";
import type { CartItem } from "@/types/CartItem";
import { CartDrawer } from "@/components/CartDrawer";
import { ProductsSection } from "@/components/products-section";

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

  return (
    <div style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}>
      <Navbar />
      <main>
        <Hero />

        <ProductsSection onAddToCart={addToCart} />

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
