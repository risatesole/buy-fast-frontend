"use client";

import { useState } from "react";

import type { Product } from "@/types/products";

/** ─────────────────────────────────────────────────────────────
 *  NOTE:
 *  API returns `selling_price`, but UI uses `price`
 *  We normalize it inside this file for simplicity.
 *  ──────────────────────────────────────────────────────────── */
type ApiProduct = {
  id: number;
  name: string;
  description: string;
  category: string;
  image: string | null;
  brand: string;
  selling_price: number;
  status: boolean;
};

/** Normalize API product → UI product */
function normalizeProduct(p: ApiProduct): Product {
  return {
    ...(p as any),
    price: p.selling_price,
  };
}

/** Renders a simple line-art icon matching the product's category. */
function ProductGlyph({ category }: { category: string }) {
  const stroke = "oklch(0.708 0 0)";
  const props = {
    width: 48,
    height: 48,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke,
    strokeWidth: 1,
  } as const;

  if (category === "Books")
    return (
      <svg {...props}>
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
      </svg>
    );

  if (category === "Notebooks")
    return (
      <svg {...props}>
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="16" y2="17" />
      </svg>
    );

  if (category === "Pens")
    return (
      <svg {...props}>
        <line x1="12" y1="19" x2="12" y2="23" />
        <path d="M6.34 17.66l-1.41-1.42 1.41-1.41" />
        <path d="M17.66 17.66l1.41-1.42-1.41-1.41" />
        <path d="M12 2L4.93 9.07a7 7 0 000 9.9L12 22l7.07-3.03a7 7 0 000-9.9L12 2z" />
      </svg>
    );

  return (
    <svg {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

// ─── Currency formatter ────────────────────────────────────────

const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);

// ─── ProductCard ───────────────────────────────────────────────

type ProductCardProps = {
  product: Product;
  onAdd: (product: Product) => void;
};

function ProductCard({ product, onAdd }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAdd(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 900);
  };

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        borderBottom: "1px solid oklch(0.922 0 0)",
        paddingBottom: "2rem",
      }}
    >
      {/* ── IMAGE AREA ── */}
      <div
        style={{
          aspectRatio: "4/3",
          background: hovered ? "oklch(0.97 0 0)" : "oklch(0.985 0 0)",
          borderRadius: 4,
          marginBottom: "1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <ProductGlyph category={product.category} />
        )}
      </div>

      <p
        style={{
          fontSize: "0.68rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "oklch(0.708 0 0)",
          marginBottom: "0.4rem",
        }}
      >
        {product.category}
      </p>

      <h3
        style={{
          fontFamily: "'Georgia', serif",
          fontSize: "1rem",
          fontWeight: 400,
          marginBottom: "0.75rem",
        }}
      >
        {product.name}
      </h3>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontFamily: "monospace" }}>
          {formatPrice(product.selling_price)}
        </span>

        <button onClick={handleAdd}>
          {added ? "Added ✓" : "Add to cart"}
        </button>
      </div>
    </article>
  );
}

// ─── ProductsSection ───────────────────────────────────────────

type ProductsSectionProps = {
  onAddToCart: (product: Product) => void;
  products: ApiProduct[];
};

export function ProductsSection({
  onAddToCart,
  products,
}: ProductsSectionProps) {
  return (
    <section
      id="products"
      style={{
        maxWidth: 1280,
        margin: "0 auto",
        padding: "4rem 2rem 6rem",
      }}
    >
      <h2
        style={{
          fontFamily: "'Georgia', serif",
          fontWeight: 400,
          fontSize: "1.65rem",
          marginBottom: "3rem",
        }}
      >
        The Collection
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "2.5rem 2rem",
        }}
      >
        {products.map((p) => {
          const product = normalizeProduct(p);

          return (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={onAddToCart}
            />
          );
        })}
      </div>
    </section>
  );
}