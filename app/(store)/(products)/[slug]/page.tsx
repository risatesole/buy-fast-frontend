import ProductPage from './product-page-client';

interface Variant {
  name: string;
  description: string;
  variantnumber: number;
  thumbnail: string;
  selling_price: number;
  tax_rate: number;
  sku: string;
  slug: string;
  image_hero: null | string;
  image_thumbnail: null | string;
  image_gallery: null | string;
  image_lifestyle: null | string;
}

interface Product {
  id: number;
  name: string;
  category: string;
  product_type: string;
  thumbnail: string;
  slug: string;
  type: string;
  variants: Variant[];
}

interface ApiResponse {
  data: Product[];
  meta: {
    timestamp: string;
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/v1/products/?variantslug=${slug}`
    ).then(res => res.json() as Promise<ApiResponse>);

    const product = response.data[0];
    const variant = product?.variants.find(v => v.slug === slug);

    if (!product || !variant) {
      return <div style={{ padding: '2rem' }}>Product not found</div>;
    }

    return <ProductPage initialProduct={product} initialVariant={variant} />;
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return <div style={{ padding: '2rem' }}>Failed to load product</div>;
  }
}
