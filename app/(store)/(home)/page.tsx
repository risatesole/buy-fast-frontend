'use client';

import { ProductCard } from '@/components/ProductCard';

const preheadline = 'Universidad Autonoma de Santo Domingo Semestre 2026-01';
const headline = 'Todo lo que necesitas para tu vida *universitaria*';

export default function Page() {
  function handleAddToCart(productId: number, quantity: number) {
    alert(`Product ${productId} added to cart! Quantity: ${quantity}`);
  }

  return (
    <main>
      <p>Welcome to the store</p>
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '2.5rem 2rem',
        }}
      >
        <ProductCard
          id={1}
          name="No name for this product sir"
          selling_price={2000}
          categoryName="Books"
          image="https://example.com"
          onAdd={handleAddToCart}
        />
        <ProductCard
          id={2}
          name="Another product"
          selling_price={2500}
          categoryName="Notebooks"
          image="https://example.com"
          onAdd={handleAddToCart}
        />
        <ProductCard
          id={3}
          name="Yet another item"
          selling_price={500}
          categoryName="Pens"
          image="https://example.com"
          onAdd={handleAddToCart}
        />
      </div>
    </main>
  );
}
