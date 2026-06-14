"use client";

import type { Product } from "@/types/products";
import { ProductCard } from "@/components/ProductCard";

export type ProductsSectionProps = {
  onAddToCart: (product: Product, quantity: number) => void;
  products: Product[];
};

export function ProductsSection({
  onAddToCart,
  products,
}: ProductsSectionProps) {
  return (
    <section
      id="products"
      style={{ maxWidth: 1280, margin: "0 auto", padding: "4rem 2rem 6rem" }}
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

      {products.length === 0 ? (
        <p style={{ color: "#888", fontSize: "1rem" }}>
          No featured products available.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "2.5rem 2rem",
          }}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={onAddToCart}
            />
          ))}
        </div>
      )}
    </section>
  );
}
