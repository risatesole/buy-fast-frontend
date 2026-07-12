import ProductList from './productList';
import type { Product } from '@/entities/product';

async function getProducts(
  categoryname: string,
  offset: number = 0
): Promise<{ data: Product[]; total: number }> {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/products/?category=${categoryname}&limit=30&offset=${offset}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  const json = await response.json();
  return {
    data: json.data || json.results || [],
    total: 2000,
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ categoryname: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const categoryname = await (await params).categoryname;
  const page = parseInt((await searchParams).page || '1', 10);
  const offset = (page - 1) * 5;

  const { data: products, total } = await getProducts(categoryname, offset);
  const totalPages = Math.ceil(total / 5);

  const pageButtons = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);

  for (let i = start; i <= end; i++) {
    pageButtons.push(i);
  }

  return (
    <main>
      <h1>{categoryname}</h1>

      <ProductList
        products={products.map(product => ({
          id: product.id,
          name: product.name,
          slug: product.variants?.[0]?.slug,
          type: product.variants?.[0]?.thumbnail,
          category: product.category,
          selling_price: product.variants?.[0]?.selling_price ?? 0,
          thumbnail: product.variants?.[0]?.thumbnail,
        }))}
      />

      <div style={{ marginTop: '40px', padding: '20px' }}>
        {page > 1 && (
          <a href={`?page=${page - 1}`} className="underline mr-2">
            Previous
          </a>
        )}
        {pageButtons.map(p => (
          <a
            key={p}
            href={`?page=${p}`}
            className="underline mr-2"
            style={{ fontWeight: p === page ? 'bold' : 'normal' }}
          >
            {p}
          </a>
        ))}
        {page < totalPages && (
          <a href={`?page=${page + 1}`} className="underline">
            Next
          </a>
        )}
      </div>
    </main>
  );
}
