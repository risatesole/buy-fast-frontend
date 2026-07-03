'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// components
import { ProductCard } from '@/components/ProductCard';

// types
import type { Product } from '@/types/products';

// services
import CartService from '@/features/cart/service';

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

async function searchProducts(query: string): Promise<ApiProduct[]> {
  const res = await fetch(`/api/v1/products?search=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Search failed');
  const json = await res.json();
  return json.data;
}

// ─── Empty state ──────────────────────────────────────────────

function EmptyState({ query }: { query: string }) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6rem 2rem',
        gap: '1rem',
      }}
    >
      <p
        style={{
          fontFamily: "'Georgia', serif",
          fontSize: '1.5rem',
          fontWeight: 400,
          color: 'oklch(0.145 0 0)',
        }}
      >
        No results for &ldquo;{query}&rdquo;
      </p>
      <p
        style={{
          fontSize: '0.875rem',
          color: 'oklch(0.708 0 0)',
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
  const q = searchParams.get('q') ?? '';

  const [rawProducts, setRawProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!q) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(false);

    searchProducts(q)
      .then(data => {
        setRawProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [q]);

  function handleAddToCart(product: Product, quantity: number) {
    const service = new CartService();
    service.addProduct(product.id, quantity).catch(err => {
      console.error('Failed to add product to cart:', err);
    });
  }

  const products: Product[] = rawProducts.map(normalizeProduct);

  return (
    <div style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
      <main
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '4rem 2rem 6rem',
        }}
      >
        <div
          style={{
            borderBottom: '1px solid oklch(0.922 0 0)',
            paddingBottom: '2rem',
            marginBottom: '3rem',
          }}
        >
          <p
            style={{
              fontSize: '0.68rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'oklch(0.708 0 0)',
              marginBottom: '0.5rem',
            }}
          >
            Search results
          </p>
          <h1
            style={{
              fontFamily: "'Georgia', serif",
              fontWeight: 400,
              fontSize: '1.65rem',
            }}
          >
            &ldquo;{q}&rdquo;
          </h1>
        </div>

        {loading ? (
          <p style={{ color: 'oklch(0.708 0 0)', fontSize: '0.875rem' }}>Searching…</p>
        ) : error ? (
          <p style={{ color: 'oklch(0.556 0 0)', fontSize: '0.875rem' }}>
            Something went wrong. Please try again.
          </p>
        ) : (
          <div style={{ display: 'flex', gap: '4rem', alignItems: 'flex-start' }}>
            {products.length === 0 ? (
              <EmptyState query={q} />
            ) : (
              <div
                style={{
                  flex: 1,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: '2.5rem 2rem',
                }}
              >
                {products.map(product => (
                  <ProductCard key={product.id} product={product} onAdd={handleAddToCart} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
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
