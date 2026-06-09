"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

// components
import { Navbar } from "@/components/navbar";
import { ProductCard } from "@/components/ProductCard";
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

type NormalizedUser = {
  firstname: string;
  lastname: string;
  profilepicture?: string | null;
  role?: string | null;
  is_authenticated: boolean;
};

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";

  const [user, setUser] = useState<NormalizedUser | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [rawProducts, setRawProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // load user
  useEffect(() => {
    getUserDetails()
      .then((details) => {
        const raw = details?.data?.user;
        setUser(raw?.is_authenticated ? raw : null);
      })
      .catch(() => {});
  }, []);

  // load results whenever query changes
  useEffect(() => {
    if (!q) {
      setLoading(false);
      return;
    }
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
      <Navbar
        user={
          user
            ? {
                name: `${user.firstname} ${user.lastname}`,
                profilePicture: user.profilepicture ?? "",
                role: user.role ?? "",
              }
            : null
        }
      />

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
