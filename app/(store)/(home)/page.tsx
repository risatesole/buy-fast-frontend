// app/page.tsx
import { HeroSection } from "@/components/childcomponents/home/sections/hero";
import { ProductsInteractive } from "./ProductsInteractive";
export const dynamic = "force-dynamic"; 

type DjangoFirstPage = {
  next: string | null;
  previous: string | null;
  results: RawDjangoProduct[];
};

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
    image_type: "HERO" | "SCALE" | "PACKING" | "FLATLAY" | "FREEZE_FRAME";
  }[];
};

function mapProduct(raw: RawDjangoProduct) {
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
    images: raw.images.map((img) => ({
      url: img.image,
      type: img.image_type,
    })),
  };
}

const DJANGO_BASE = process.env.DJANGO_API_URL ?? "http://localhost:8000";

async function getFeaturedProductsFirstPage(): Promise<{
  products: ReturnType<typeof mapProduct>[];
  nextCursor: string | null;
}> {
  const res = await fetch(`${DJANGO_BASE}/api/v1/products/tag/featured/`, {
    headers: { Accept: "application/json" },
    // ISR: revalidate every 60 s
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    console.error("Failed to fetch featured products:", res.status);
    return { products: [], nextCursor: null };
  }

  const data: DjangoFirstPage = await res.json();

  return {
    products: data.results.map(mapProduct),
    nextCursor: data.next,
  };
}

const preheadline = "Universidad Autonoma de Santo Domingo Semestre 2026-01";
const headline = "Todo lo que necesitas para tu vida *universitaria*";

export default async function Page() {
  const { products, nextCursor } = await getFeaturedProductsFirstPage();

  return (
    <main>
      <HeroSection preheadline={preheadline} headline={headline} />
      <ProductsInteractive
        products={products}
        initialNextCursor={nextCursor}
      />
    </main>
  );
}
