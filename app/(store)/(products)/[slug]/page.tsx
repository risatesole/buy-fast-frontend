interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  slug?: string;
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  
  const product = await fetch(`${process.env.BACKEND_URL}/api/v1/products/?slug=${slug}`).then(res => res.json());

  return (
    <div>
      <pre>{JSON.stringify(product, null, 2)}</pre>
      <h1>{product.name}</h1>

    </div>
  );
}