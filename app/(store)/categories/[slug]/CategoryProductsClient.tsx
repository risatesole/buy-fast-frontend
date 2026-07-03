'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/types/products';
import CartService from '@/features/cart/service';

// ─── Types ────────────────────────────────────────────────────

import type { ProductImageType } from '@/types/products';

type RawProduct = {
  id: number;
  name: string;
  description: string;
  brand: string;
  selling_price: string | number;
  status: boolean;
  category: {
    id: number;
    name: string;
    slug: string;
    image: string;
  };
  tags: string[];
  images: {
    url: string;
    type: ProductImageType;
  }[];
};

function mapProduct(raw: RawProduct): Product {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    brand: raw.brand,
    selling_price: parseFloat(String(raw.selling_price)),
    status: raw.status,
    tags: raw.tags,
    category: {
      id: raw.category.id,
      name: raw.category.name,
      slug: raw.category.slug,
      image: raw.category.image,
      status: true,
    },
    images: raw.images.map(img => ({
      url: img.url,
      type: img.type,
    })),
  };
}

// ─── Props ────────────────────────────────────────────────────

type Props = {
  categoryId: number;
  initialProducts: RawProduct[];
  pageLimit: number;
};

// ─── Component ────────────────────────────────────────────────

export function CategoryProductsClient({ categoryId, initialProducts, pageLimit }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts.map(mapProduct));
  const [offset, setOffset] = useState(initialProducts.length);
  const [hasMore, setHasMore] = useState(initialProducts.length === pageLimit);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLoadMore() {
    setIsLoading(true);
    try {
      const url = `/api/v1/products?category_id=${categoryId}&limit=${pageLimit}&offset=${offset}&status=true`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const json: { status: string; data: RawProduct[] } = await res.json();
      const newProducts = (json.data ?? []).map(mapProduct);
      setProducts(prev => [...prev, ...newProducts]);
      setOffset(prev => prev + newProducts.length);
      if (newProducts.length < pageLimit) setHasMore(false);
    } catch (err) {
      console.error('Error loading more products:', err);
    } finally {
      setIsLoading(false);
    }
  }

  function handleAddToCart(product: Product) {
    const service = new CartService();
    service.addProduct(product.id, 1).catch(err => {
      console.error('Failed to add to cart:', err);
    });
  }

  if (products.length === 0) {
    return (
      <p style={{ color: 'oklch(0.708 0 0)', fontSize: '1rem' }}>
        No products in this category yet.
      </p>
    );
  }

  return (
    <>
      {/* Count */}
      <p
        style={{
          fontSize: '0.78rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'oklch(0.708 0 0)',
          marginBottom: '2rem',
        }}
      >
        {products.length} product{products.length !== 1 ? 's' : ''}
        {hasMore ? '+' : ''}
      </p>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '2.5rem 2rem',
        }}
      >
        {products.map(product => (
          <ProductCard key={product.id} product={product} onAdd={handleAddToCart} />
        ))}
      </div>

      {/* Load more / end */}
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        {hasMore ? (
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            style={{
              padding: '0.75rem 2.5rem',
              background: 'none',
              border: '1px solid oklch(0.708 0 0)',
              borderRadius: 2,
              fontFamily: 'inherit',
              fontSize: '0.82rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: isLoading ? 'wait' : 'pointer',
              color: isLoading ? 'oklch(0.708 0 0)' : 'inherit',
              transition: 'border-color 0.15s, color 0.15s',
            }}
          >
            {isLoading ? 'Loading…' : 'Load more'}
          </button>
        ) : (
          <p
            style={{
              color: 'oklch(0.8 0 0)',
              fontSize: '0.82rem',
              letterSpacing: '0.05em',
            }}
          >
            — End of collection —
          </p>
        )}
      </div>
    </>
  );
}

// ─── ProductCard ──────────────────────────────────────────────

const formatPrice = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

function ProductCard({ product, onAdd }: { product: Product; onAdd: (p: Product) => void }) {
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const heroImage = product.images?.find(img => img.type === 'HERO')?.url;

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
        display: 'flex',
        flexDirection: 'column',
        borderBottom: '1px solid oklch(0.922 0 0)',
        paddingBottom: '2rem',
      }}
    >
      <Link href={`/products/${product.id}`}>
        <div
          style={{
            aspectRatio: '4/3',
            background: hovered ? 'oklch(0.97 0 0)' : 'oklch(0.985 0 0)',
            borderRadius: 4,
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            transition: 'background 0.15s',
          }}
        >
          {heroImage ? (
            <img
              src={heroImage}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <svg
              width={48}
              height={48}
              viewBox="0 0 24 24"
              fill="none"
              stroke="oklch(0.708 0 0)"
              strokeWidth={1}
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          )}
        </div>
      </Link>

      <p
        style={{
          fontSize: '0.68rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'oklch(0.708 0 0)',
          marginBottom: '0.4rem',
        }}
      >
        {product.brand}
      </p>

      <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <h3
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: '1rem',
            fontWeight: 400,
            marginBottom: '0.75rem',
          }}
        >
          {product.name}
        </h3>
      </Link>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 'auto',
        }}
      >
        <span style={{ fontFamily: 'monospace' }}>{formatPrice(product.selling_price)}</span>
        <button onClick={handleAdd}>{added ? 'Added ✓' : 'Add to cart'}</button>
      </div>
    </article>
  );
}
