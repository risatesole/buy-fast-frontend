import { formatPrice } from "@/utils/FormatPrice";
import { TagBadge } from "@/components/TagBadge";
import { AddToCartButton } from "@/components/Buttons/AddToCartButton";
import type { Product } from "@/types/products";

export function ProductDetails({ product }: { product: Product }) {
  return (
    <div style={{ paddingTop: "1rem" }}>
      <p
        style={{
          fontSize: "0.68rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "oklch(0.708 0 0)",
          marginBottom: "0.75rem",
        }}
      >
        {product.category.name}
      </p>

      <h1
        style={{
          fontFamily: "'Georgia', serif",
          fontWeight: 400,
          fontSize: "2rem",
          lineHeight: 1.2,
          marginBottom: "1.5rem",
          color: "oklch(0.145 0 0)",
        }}
      >
        {product.name}
      </h1>

      <p
        style={{
          fontFamily: "monospace",
          fontSize: "1.5rem",
          color: "oklch(0.145 0 0)",
          marginBottom: "2rem",
        }}
      >
        {formatPrice(product.selling_price)}
      </p>

      <div
        style={{
          borderTop: "1px solid oklch(0.922 0 0)",
          marginBottom: "2rem",
        }}
      />

      <p
        style={{
          fontSize: "0.9rem",
          lineHeight: 1.7,
          color: "oklch(0.45 0 0)",
          marginBottom: "2rem",
        }}
      >
        {product.description || "No description available."}
      </p>

      {product.brand && (
        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            marginBottom: "1.5rem",
            fontSize: "0.8rem",
            color: "oklch(0.556 0 0)",
          }}
        >
          <span
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "oklch(0.708 0 0)",
              minWidth: 60,
            }}
          >
            Brand
          </span>
          <span>{product.brand}</span>
        </div>
      )}

      {product.tags && product.tags.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            marginBottom: "2.5rem",
          }}
        >
          {product.tags.map((tag) => (
            <TagBadge key={tag} label={tag} />
          ))}
        </div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "2.5rem",
          fontSize: "0.75rem",
          color: product.status ? "oklch(0.45 0.15 145)" : "oklch(0.55 0 0)",
        }}
      >
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: product.status
              ? "oklch(0.65 0.2 145)"
              : "oklch(0.708 0 0)",
          }}
        />
        {product.status ? "In stock" : "Unavailable"}
      </div>

      <AddToCartButton product={product} />
    </div>
  );
}
