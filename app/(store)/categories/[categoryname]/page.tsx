import ProductList from './productList';
import type { Product } from '@/entities/product';

async function getProducts(categoryname: string): Promise<Product[]> {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/products/?category=${categoryname}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  const json = await response.json();
  return json.data;
}

export default async function Page({ params }: { params: Promise<{ categoryname: string }> }) {
  const categoryname = await (await params).categoryname;
  const products = await getProducts(categoryname);

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
    </main>
  );
}
