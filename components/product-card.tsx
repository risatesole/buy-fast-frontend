"use client";

import { useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  badge?: string;
};


function ProductGlyph({ category }: { category: string }) {
  const color = "oklch(0.708 0 0)";
  if (category === "Books")
    return (
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1"
      >
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
      </svg>
    );
  if (category === "Notebooks")
    return (
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1"
      >
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="16" y2="17" />
      </svg>
    );
  if (category === "Pens")
    return (
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1"
      >
        <line x1="12" y1="19" x2="12" y2="23" />
        <path d="M6.34 17.66l-1.41-1.42 1.41-1.41" />
        <path d="M17.66 17.66l1.41-1.42-1.41-1.41" />
        <path d="M12 2L4.93 9.07a7 7 0 000 9.9L12 22l7.07-3.03a7 7 0 000-9.9L12 2z" />
      </svg>
    );
  // College
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}


const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);

export function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (p: Product) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAdd(product);

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 900);
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
        transition: "opacity 0.15s",
      }}
    >
      {/* Placeholder visual */}
      <div
        style={{
          aspectRatio: "4/3",
          background: hovered ? "oklch(0.97 0 0)" : "oklch(0.985 0 0)",
          borderRadius: 4,
          marginBottom: "1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.2s",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <ProductGlyph category={product.category} />
        {product.badge && (
          <span
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              background: "oklch(0.145 0 0)",
              color: "oklch(0.985 0 0)",
              fontSize: "0.6rem",
              fontFamily: "var(--font-geist-sans), sans-serif",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "3px 8px",
              borderRadius: 2,
            }}
          >
            {product.badge}
          </span>
        )}
      </div>

      {/* Info */}
      <p
        style={{
          fontFamily: "var(--font-geist-sans), sans-serif",
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
          fontFamily: "'Georgia', 'Times New Roman', serif",
          fontSize: "1rem",
          fontWeight: 400,
          lineHeight: 1.35,
          color: "oklch(0.145 0 0)",
          marginBottom: "0.75rem",
          flexGrow: 1,
        }}
      >
        {product.name}
      </h3>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "auto",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: "0.92rem",
            color: "oklch(0.205 0 0)",
            fontWeight: 500,
          }}
        >
          {fmt(product.price)}
        </span>
        <button
          onClick={handleAdd}
          style={{
            background: added ? "oklch(0.439 0 0)" : "oklch(0.145 0 0)",
            color: "oklch(0.985 0 0)",
            border: "none",
            borderRadius: 3,
            padding: "0.45rem 1rem",
            cursor: "pointer",
            fontFamily: "var(--font-geist-sans), sans-serif",
            fontSize: "0.72rem",
            letterSpacing: "0.06em",
            transition: "background 0.2s",
          }}
        >
          {added ? "Added" : "Add to cart"}
        </button>
      </div>
    </article>
  );
}