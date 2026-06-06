import { HeroSection } from "@/components/childcomponents/home/sections/hero";
import { TrustBadgeStrip } from "@/components/childcomponents/home/sections/TrustBadgeStrip";
import { Datamock } from "@/mock/mock";
import ProductService from "@/services/products/ProductService";
import { ProductsInteractive } from "./ProductsInteractive";

// WARNING: ducktape code
// this number refers to the id of featured products in dbms so if featured is other number this fails
const featuredproductcategoryid = 1; // WARNING: this could change in the dbms so this has to change so it autodetects featured tag this is a temporary fix if error check here related to products in home screen 


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
