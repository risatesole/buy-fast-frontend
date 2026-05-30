"use client";

import { useState } from "react";

import { ProductCard } from "@/components/childcomponents/home/product/product-card";

import type { Product } from "@/types/products";
import type { CartItem } from "@/types/CartItem";

type ProductsSectionProps = {
  onAddToCart: (product: Product) => void;
};

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
  {
    id: 12,
    name: "Sakura Micron Set — 6pk",
    category: "Pens",
    price: 16.75,
  },

  {
    id: 13,
    name: "Scientific Calculator FX-991",
    category: "College",
    price: 19.99,
  },
  {
    id: 14,
    name: "Index Card Set — 200pk",
    category: "College",
    price: 5.49,
  },
  {
    id: 15,
    name: "Binder Tabs — Assorted",
    category: "College",
    price: 4.99,
  },
  {
    id: 16,
    name: "Mechanical Pencil 0.5mm — 5pk",
    category: "College",
    price: 8.5,
  },
];

export function ProductsSection({
  onAddToCart,
}: ProductsSectionProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

  return (
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
        <div
          style={{
            display: "flex",
            gap: "0.35rem",
            flexWrap: "wrap",
          }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background:
                  activeCategory === cat
                    ? "oklch(0.145 0 0)"
                    : "none",

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

                fontFamily:
                  "var(--font-geist-sans), sans-serif",

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
          gridTemplateColumns:
            "repeat(auto-fill, minmax(220px, 1fr))",

          gap: "2.5rem 2rem",
        }}
      >
        {filtered.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAdd={onAddToCart}
          />
        ))}
      </div>
    </section>
  );
}