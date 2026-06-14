"use client";

import { useState } from "react";
import { addProductToCart } from "@/services/cart";
import type { Product } from "@/types/products";
import type { CartItem } from "@/types/CartItem";

export function AddToCartButton({ product }: { product: Product }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    setCart((prev) => addProductToCart(prev, product));
    setAdded(true);
    setTimeout(() => setAdded(false), 900);
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={!product.status}
      style={{
        width: "100%",
        padding: "0.9rem 2rem",
        fontSize: "0.75rem",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        background: added
          ? "oklch(0.45 0.15 145)"
          : product.status
            ? "oklch(0.145 0 0)"
            : "oklch(0.85 0 0)",
        color: product.status ? "oklch(0.985 0 0)" : "oklch(0.556 0 0)",
        border: "none",
        borderRadius: 2,
        cursor: product.status ? "pointer" : "not-allowed",
        transition: "background 0.2s ease",
      }}
    >
      {added
        ? "Added to cart ✓"
        : product.status
          ? "Add to cart"
          : "Unavailable"}
    </button>
  );
}
