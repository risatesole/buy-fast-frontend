// components/ProductsInteractive.tsx
"use client";

import { useState, useCallback } from "react";
import { ProductsSection } from "@/components/childcomponents/home/product/products-section";
import { addProductToCart } from "@/mock/shoppingcart";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import type { Product } from "@/types/products";
import type { CartItem } from "@/types/CartItem";

// Shape of the Django cursor-paginated response
type DjangoPaginatedResponse = {
  next: string | null;
  previous: string | null;
  results: RawDjangoProduct[];
};

// Raw product shape coming from Django (images use `image` key, not `url`)
type RawDjangoProduct = {
  id: number;
  name: string;
  description: string;
  brand: string;
  metric_unit: string;
  selling_price: string;
  status: boolean;
  category: {
    id: number;
    name: string;
    slug: string;
    image: string;
  };
  tags: string[];
  images: {
    id: number;
    image: string;
    image_type: "HERO" | "SCALE" | "PACKING" | "FLATLAY" | "FREEZE_FRAME";
  }[];
};

/** Map Django's raw product to the frontend Product type */
function mapProduct(raw: RawDjangoProduct): Product {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    brand: raw.brand,
    selling_price: parseFloat(raw.selling_price),
    status: raw.status,
    tags: raw.tags,
    category: {
      id: raw.category.id,
      name: raw.category.name,
      slug: raw.category.slug,
      image: raw.category.image,
      status: true,
    },
    images: raw.images.map((img) => ({
      url: img.image,
      type: img.image_type,
    })),
  };
}

// Direct Django base URL — only used server-side or via Next.js route handler
const DJANGO_BASE = process.env.NEXT_PUBLIC_DJANGO_API_URL ?? "http://localhost:8000";
const TAG_URL = `${DJANGO_BASE}/api/v1/products/tag/featured/`;

type Props = {
  /** First page of products, pre-fetched on the server */
  products: Product[];
  /** The `next` cursor URL returned by Django for the first page */
  initialNextCursor: string | null;
};

export function ProductsInteractive({ products: initialProducts, initialNextCursor }: Props) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  // Store the full `next` URL Django returns — ready to use directly
  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor);

  const handleLoadMore = useCallback(async () => {
    if (!nextCursor) return;

    try {
      // Hit our Next.js proxy route so we don't expose Django directly to the browser
      const proxyUrl = `/api/products/cursor?url=${encodeURIComponent(nextCursor)}`;
      const response = await fetch(proxyUrl);

      if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);

      const data: DjangoPaginatedResponse = await response.json();

      if (data.results.length > 0) {
        setProducts((prev) => [...prev, ...data.results.map(mapProduct)]);
      }
      // Update cursor — null means we've reached the last page
      setNextCursor(data.next);
    } catch (error) {
      console.error("Error loading more products:", error);
    }
  }, [nextCursor]);

  const { observerTarget, isLoading } = useInfiniteScroll({
    onLoadMore: handleLoadMore,
    hasMore: nextCursor !== null,
  });

  function handleAddToCart(product: Product) {
    setCart((prev) => addProductToCart(prev, product));
  }

  return (
    <>
      <ProductsSection products={products} onAddToCart={handleAddToCart} />

      {/* Sentinel — the IntersectionObserver watches this element */}
      <div
        ref={observerTarget}
        style={{ height: "1px", visibility: "hidden" }}
        aria-hidden="true"
      />

      {isLoading && (
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            color: "#888",
            fontSize: "0.9rem",
          }}
        >
          Cargando más productos…
        </div>
      )}

      {!isLoading && nextCursor === null && products.length > 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            color: "#bbb",
            fontSize: "0.85rem",
          }}
        >
          — Fin del catálogo —
        </div>
      )}
    </>
  );
}