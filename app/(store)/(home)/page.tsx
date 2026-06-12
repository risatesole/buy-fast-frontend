import { HeroSection } from "@/components/childcomponents/home/sections/hero";
import ProductService from "@/services/products/ProductService";
import { ProductsInteractive } from "./ProductsInteractive";

export default async function Page() {
  const productService = new ProductService();
  const products = await productService.getProducts({
    tags: ["featured"],
    limit: 48,
    offset: 0,
  });

  const preheadline = "Universidad Autonoma de Santo Domingo Semestre 2026-01";
  const headline = "Todo lo que necesitas para tu vida *universitaria*";
  return (
    <main>
      <HeroSection preheadline={preheadline} headline={headline} />

      <ProductsInteractive products={products} />
    </main>
  );
}
