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

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/products/?variantslug=${slug}`
  ).then(res => res.json() as Promise<ApiResponse>);

  const product = response.data[0];
  const variant = product?.variants.find(v => v.slug === slug);

  if (!variant) {
    return <div>Variant not found</div>;
  }

  return (
    <div>
      <pre>{JSON.stringify(response, null, 2)}</pre>
      <h1>{variant.name}</h1>
      <p>{variant.description}</p>
      <img src={variant.thumbnail} alt={variant.name} />
      {variant.image_hero && <img src={variant.image_hero} alt="hero" />}
      {variant.image_thumbnail && <img src={variant.image_thumbnail} alt="thumbnail" />}
      {variant.image_gallery && <img src={variant.image_gallery} alt="gallery" />}
      {variant.image_lifestyle && <img src={variant.image_lifestyle} alt="lifestyle" />}
    </div>
  );
}
