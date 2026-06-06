import { HeroSection } from "@/components/childcomponents/home/sections/hero";
import { TrustBadgeStrip } from "@/components/childcomponents/home/sections/TrustBadgeStrip";
import { Datamock } from "@/mock/mock";
import ProductService from "@/services/products/ProductService";
import { ProductsInteractive } from "./ProductsInteractive";

export default async function Page() {
  const productService = new ProductService();
  const products = await productService.getProducts({
    tags: ["featured"],
    limit: 20,
    offset: 0,
  });
  return (
    <main>
      <HeroSection
        preheadline={Datamock.homepage.herosection.preheadline}
        headline={Datamock.homepage.herosection.headline}
      />

      <ProductsInteractive products={products} />

      <TrustBadgeStrip />
    </main>
  );
}
