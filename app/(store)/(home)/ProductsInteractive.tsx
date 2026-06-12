"use client";

import { useState, useCallback } from "react";
import { ProductsSection } from "@/components/childcomponents/home/product/products-section";
import { addProductToCart } from "@/mock/shoppingcart";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import type { Product } from "@/types/products";
import type { CartItem } from "@/types/CartItem";

const ITEMS_PER_PAGE = 48;

export function ProductsInteractive({ products: initialProducts }: { products: Product[] }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [offset, setOffset] = useState(ITEMS_PER_PAGE);

  const handleLoadMore = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/products?offset=${offset}&limit=${ITEMS_PER_PAGE}&tags=featured`
      );
      if (!response.ok) throw new Error("Failed to fetch products");

      const data = await response.json();
      if (data.data && data.data.length > 0) {
        setProducts((prev) => [...prev, ...data.data]);
        setOffset((prev) => prev + ITEMS_PER_PAGE);
      }
    } catch (error) {
      console.error("Error loading more products:", error);
    }
  }, [offset]);

  const { observerTarget, isLoading } = useInfiniteScroll({
    onLoadMore: handleLoadMore,
  });

  function handleAddToCart(product: Product) {
    setCart((prev) => addProductToCart(prev, product));
  }

  return (
    <>
      <ProductsSection products={products} onAddToCart={handleAddToCart} />
      <div
        ref={observerTarget}
        style={{
          height: "1px",
          visibility: "hidden",
        }}
        aria-label="infinite scroll trigger"
      />
      {isLoading && (
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            color: "#888",
          }}
        >
          Loading more products...
        </div>
      )}
    </>
  );
}