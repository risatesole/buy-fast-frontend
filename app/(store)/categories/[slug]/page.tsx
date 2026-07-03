// app/(store)/categories/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { CategoryProductsClient } from './CategoryProductsClient';
import type { ProductImageType } from '@/types/products';

export const dynamic = 'force-dynamic';

const DJANGO_BASE = process.env.BACKEND_URL ?? 'http://localhost:8000';
const PAGE_LIMIT = 24;

type RawCategory = {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  status: boolean;
};

type RawProduct = {
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
    url: string;
    type: ProductImageType;
  }[];
};

async function getAllActiveCategories(): Promise<RawCategory[]> {
  const res = await fetch(`${DJANGO_BASE}/api/v1/products/categories?status=true`, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  const json: { status: string; data: RawCategory[] } = await res.json();
  return json.data ?? [];
}

async function getProductsByCategory(
  categoryId: number,
  offset: number
): Promise<{ products: RawProduct[]; total: number }> {
  const url = `${DJANGO_BASE}/api/v1/products/?category_id=${categoryId}&limit=${PAGE_LIMIT}&offset=${offset}&status=true`;
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 60 },
  });

  if (!res.ok) return { products: [], total: 0 };

  // The existing handler returns { status, data: Product[] }
  const json: { status: string; data: RawProduct[] } = await res.json();
  return { products: json.data ?? [], total: 0 };
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryDetailPage({ params }: Props) {
  const { slug } = await params;

  // Find the matching category from the active list
  const categories = await getAllActiveCategories();
  const category = categories.find(c => c.slug === slug);

  if (!category) notFound();

  const { products } = await getProductsByCategory(category.id, 0);

  return (
    <main style={{ maxWidth: 1280, margin: '0 auto', padding: '4rem 2rem 6rem' }}>
      {/* Breadcrumb */}
      <nav
        style={{
          fontSize: '0.75rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'oklch(0.708 0 0)',
          marginBottom: '2rem',
        }}
      >
        <a href="/categories" style={{ color: 'inherit', textDecoration: 'none' }}>
          Categories
        </a>
        <span style={{ margin: '0 0.5rem' }}>›</span>
        <span>{category.name}</span>
      </nav>

      {/* Category header */}
      <header
        style={{
          marginBottom: '3rem',
          borderBottom: '1px solid oklch(0.922 0 0)',
          paddingBottom: '1.5rem',
        }}
      >
        <h1
          style={{
            fontFamily: "'Georgia', serif",
            fontWeight: 400,
            fontSize: '2rem',
            margin: '0 0 0.5rem',
          }}
        >
          {category.name}
        </h1>
        {category.description && (
          <p
            style={{
              fontSize: '0.9rem',
              color: 'oklch(0.708 0 0)',
              margin: 0,
              maxWidth: 560,
            }}
          >
            {category.description}
          </p>
        )}
      </header>

      {/* Products — client component handles load more */}
      <CategoryProductsClient
        categoryId={category.id}
        initialProducts={products}
        pageLimit={PAGE_LIMIT}
      />
    </main>
  );
}
