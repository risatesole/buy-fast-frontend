'use client';

import { ProductCard } from '@/components/ProductCard';
import type { ProductImage } from '@/types/products';

const preheadline = 'Universidad Autonoma de Santo Domingo Semestre 2026-01';
const headline = 'Todo lo que necesitas para tu vida *universitaria*';

const mockImages = {
  books: [
    {
      url: 'https://zdnhvnvrngxvxedrvuon.supabase.co/storage/v1/object/public/bucket1/uploads/1782667031_61HdqFs9wbL._AC_SX575_.jpg',
      type: 'HERO' as const,
    },
  ] as ProductImage[],
  notebooks: [
    {
      url: 'https://zdnhvnvrngxvxedrvuon.supabase.co/storage/v1/object/public/bucket1/uploads/1782667031_61HdqFs9wbL._AC_SX575_.jpg',
      type: 'HERO' as const,
    },
  ] as ProductImage[],
  pens: [
    {
      url: 'https://zdnhvnvrngxvxedrvuon.supabase.co/storage/v1/object/public/bucket1/uploads/1782667031_61HdqFs9wbL._AC_SX575_.jpg',
      type: 'HERO' as const,
    },
  ] as ProductImage[],
};

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
          images={mockImages.books}
          onAdd={handleAddToCart}
        />
        <ProductCard
          id={2}
          name="Another product"
          selling_price={2500}
          categoryName="Notebooks"
          images={mockImages.notebooks}
          onAdd={handleAddToCart}
        />
        <ProductCard
          id={3}
          name="Yet another item"
          selling_price={500}
          categoryName="Pens"
          images={mockImages.pens}
          onAdd={handleAddToCart}
        />
      </div>
    </main>
  );
}
