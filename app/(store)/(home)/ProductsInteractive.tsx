'use client';

import { useState, useCallback } from 'react';
import { ProductsSection } from '@/components/childcomponents/home/product/products-section';
import CartService from '@/features/cart/service';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import type { Product } from '@/types/products';

// Shape of the Django cursor-paginated response
type DjangoPaginatedResponse = {
  next: string | null;
  previous: string | null;
  data: RawDjangoProduct[];
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
    image_type: 'HERO' | 'SCALE' | 'PACKING' | 'FLATLAY' | 'FREEZE_FRAME';
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
    images: raw.images.map(img => ({
      url: img.image,
      type: img.image_type,
    })),
  };
}

type Props = {
  /** First page of products, pre-fetched on the server */
  products: Product[];
  /** The `next` cursor URL returned by Django for the first page */
  initialNextCursor: string | null;
};

export function ProductsInteractive({ products: initialProducts, initialNextCursor }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor);

  const handleLoadMore = useCallback(async () => {
    if (!nextCursor) return;

    try {
      const proxyUrl = `/api/products/cursor?url=${encodeURIComponent(nextCursor)}`;
      const response = await fetch(proxyUrl);

      if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
      console.log(response);

      const data: DjangoPaginatedResponse = await response.json();

      if (data.data.length > 0) {
        setProducts(prev => [...prev, ...data.data.map(mapProduct)]);
      }
      setNextCursor(data.next);
    } catch (error) {
      console.error('Error loading more products:', error);
    }
  }, [nextCursor]);

  const { observerTarget, isLoading } = useInfiniteScroll({
    onLoadMore: handleLoadMore,
    hasMore: nextCursor !== null,
  });

  function handleAddToCart(product: Product, quantity: number) {
    const service = new CartService();
    service.addProduct(product.id, quantity).catch(err => {
      console.error('Failed to add product to cart:', err);
    });
  }

  return (
    <>
      <ProductsSection products={products} onAddToCart={handleAddToCart} />

      <div
        ref={observerTarget}
        style={{ height: '1px', visibility: 'hidden' }}
        aria-hidden="true"
      />

      {isLoading && (
        <div
          style={{
            textAlign: 'center',
            padding: '2rem',
            color: '#888',
            fontSize: '0.9rem',
          }}
        >
          Cargando más productos…
        </div>
      )}

      {!isLoading && nextCursor === null && products.length > 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '2rem',
            color: '#bbb',
            fontSize: '0.85rem',
          }}
        >
          — Fin del catálogo —
        </div>
      )}
    </>
  );
}
