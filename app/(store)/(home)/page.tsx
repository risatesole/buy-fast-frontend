import ProductList from './productList';
import type { Product } from '@/entities/product';

async function getProducts(): Promise<Product[]> {
  const response = await fetch('http://localhost:8000/api/v1/products/');

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  const json = await response.json();
  return json.data;
}

export default async function Page() {
  const products = await getProducts();

  return (
    <main>
      <p>Welcome to the store</p>

      <ProductList
        products={products.map(product => ({
          id: product.id,
          name: product.name,
          slug: product.slug,
          type: product.product_type,
          category: product.category,
          selling_price: product.variants?.[0]?.selling_price ?? 0,
          thumbnail: product.thumbnail,
        }))}
      />
    </main>
  );
}
