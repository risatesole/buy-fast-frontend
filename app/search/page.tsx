"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

// components
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/Footer";

// types
import type { Product } from "@/types/products";
import type { CartItem } from "@/types/CartItem";
import type { UserDetails } from "@/services/user/getUserDetails";

// services
import { getUserDetails } from "@/services/user/getUserDetails";
import { addProductToCart } from "@/mock/shoppingcart";

// ─── Types ────────────────────────────────────────────────────

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

// ─── Helpers ──────────────────────────────────────────────────

function normalizeProduct(p: ApiProduct): Product {
  return { ...(p as any), price: p.selling_price };
}

const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

async function searchProducts(query: string): Promise<ApiProduct[]> {
  const res = await fetch(
    `/api/v1/products?search=${encodeURIComponent(query)}`,
  );
  if (!res.ok) throw new Error("Search failed");
  const json = await res.json();
  return json.data;
}

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

// ─── ProductCard ──────────────────────────────────────────────

function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (p: Product) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    onAdd(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 900);
  }

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
      <div
        style={{
          aspectRatio: "4/3",
          background: hovered ? "oklch(0.97 0 0)" : "oklch(0.985 0 0)",
          borderRadius: 4,
          marginBottom: "1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
        <button onClick={handleAdd}>{added ? "Added ✓" : "Add to cart"}</button>
      </div>
    </article>
  );
}

// ─── Empty state ──────────────────────────────────────────────

function EmptyState({ query }: { query: string }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "6rem 2rem",
        gap: "1rem",
      }}
    >
      <p
        style={{
          fontFamily: "'Georgia', serif",
          fontSize: "1.5rem",
          fontWeight: 400,
          color: "oklch(0.145 0 0)",
        }}
      >
        No results for &ldquo;{query}&rdquo;
      </p>
      <p
        style={{
          fontSize: "0.875rem",
          color: "oklch(0.708 0 0)",
        }}
      >
        Try a different search term or browse the collection.
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";

  const [user, setUser] = useState<UserDetails | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [rawProducts, setRawProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // load user
  useEffect(() => {
    getUserDetails()
      .then(setUser)
      .catch(() => {});
  }, []);

  // load results whenever query changes
  useEffect(() => {
    if (!q) return;
    setLoading(true);
    setError(false);

    searchProducts(q)
      .then((data) => {
        setRawProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [q]);

  function handleAddToCart(product: Product) {
    setCart((prev) => addProductToCart(prev, product));
  }

  const products: Product[] = rawProducts.map(normalizeProduct);

  return (
    <div style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}>
      <Navbar user={user} />

      <main
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "4rem 2rem 6rem",
        }}
      >
        {/* Page heading */}
        <div
          style={{
            borderBottom: "1px solid oklch(0.922 0 0)",
            paddingBottom: "2rem",
            marginBottom: "3rem",
          }}
        >
          <p
            style={{
              fontSize: "0.68rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "oklch(0.708 0 0)",
              marginBottom: "0.5rem",
            }}
          >
            Search results
          </p>
          <h1
            style={{
              fontFamily: "'Georgia', serif",
              fontWeight: 400,
              fontSize: "1.65rem",
            }}
          >
            &ldquo;{q}&rdquo;
          </h1>
        </div>

        {loading ? (
          <p style={{ color: "oklch(0.708 0 0)", fontSize: "0.875rem" }}>
            Searching…
          </p>
        ) : error ? (
          <p style={{ color: "oklch(0.556 0 0)", fontSize: "0.875rem" }}>
            Something went wrong. Please try again.
          </p>
        ) : (
          <div
            style={{ display: "flex", gap: "4rem", alignItems: "flex-start" }}
          >
            {/* Results grid */}
            {products.length === 0 ? (
              <EmptyState query={q} />
            ) : (
              <div
                style={{
                  flex: 1,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: "2.5rem 2rem",
                }}
              >
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <SearchContent />
    </Suspense>
  );
}
