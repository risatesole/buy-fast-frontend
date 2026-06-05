import { HeroSection } from "@/components/childcomponents/home/sections/hero";
import { TrustBadgeStrip } from "@/components/childcomponents/home/sections/TrustBadgeStrip";
import { Datamock } from "@/mock/mock";
import { getProducts } from "./layout";
import { ProductsInteractive } from "./ProductsInteractive";

export default async function Page() {
  const products = await getProducts();

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