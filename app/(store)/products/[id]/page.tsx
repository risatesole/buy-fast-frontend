import { notFound } from "next/navigation";
import type { Product } from "@/types/products";
import { ImageGallery } from "@/components/ImageGallery";
import { ProductDetails } from "./components/ProductDetails";
import ProductService from "@/services/products/ProductService";
import { ProductPageBreadcrumb } from "@/components/breadcrums/productpage";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  let product: Product;
  const productService = new ProductService();

  const { id } = await params;

  try {
    product = await productService.getProductDetails(id);
  } catch {
    return <h1>Product not found</h1>;
  }

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .product-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: start;
        }
        @media (max-width: 768px) {
          .product-layout {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .product-image-col {
            max-width: 480px;
            width: 100%;
            margin: 0 auto;
          }
          .product-details-col {
            padding-top: 0 !important;
          }
        }
      `}</style>

      <main
        style={{ maxWidth: 1280, margin: "0 auto", padding: "4rem 2rem 6rem" }}
      >
        <ProductPageBreadcrumb product={product!} />

        <div className="product-layout">
          <div className="product-image-col">
            <ImageGallery
              images={product!.images ?? []}
              productName={product!.name}
              category={product!.category.name}
            />
          </div>
          <div className="product-details-col">
            <ProductDetails product={product!} />
          </div>
        </div>
      </main>
    </>
  );
}
