import { notFound } from "next/navigation";
import { ImageGallery } from "@/components/ImageGallery";
import { AddToCartButton } from "@/components/AddToCartButton";
import type { Product } from "@/types/products";
import ProductService from "@/services/products/ProductService";

const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

// ─── Tag pill ─────────────────────────────────────────────────

function Tag({ label }: { label: string }) {
  return (
    <span
      style={{
        fontSize: "0.65rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        border: "1px solid oklch(0.85 0 0)",
        borderRadius: 2,
        padding: "0.2rem 0.6rem",
        color: "oklch(0.556 0 0)",
      }}
    >
      {label}
    </span>
  );
}

function Breadcrumb({ product }: { product: Product }) {
  return (
    <nav
      style={{
        fontSize: "0.68rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "oklch(0.708 0 0)",
        marginBottom: "3rem",
        display: "flex",
        gap: "0.5rem",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <a href="/" style={{ color: "oklch(0.708 0 0)", textDecoration: "none" }}>
        Home
      </a>
      <span>/</span>
      <a
        href={`/?category=${product.category.id}`}
        style={{ color: "oklch(0.708 0 0)", textDecoration: "none" }}
      >
        {product.category.name}
      </a>
      <span>/</span>
      <span style={{ color: "oklch(0.35 0 0)" }}>{product.name}</span>
    </nav>
  );
}

function ProductDetails({ product }: { product: Product }) {
  return (
    <div style={{ paddingTop: "1rem" }}>
      <p
        style={{
          fontSize: "0.68rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "oklch(0.708 0 0)",
          marginBottom: "0.75rem",
        }}
      >
        {product.category.name}
      </p>

      <h1
        style={{
          fontFamily: "'Georgia', serif",
          fontWeight: 400,
          fontSize: "2rem",
          lineHeight: 1.2,
          marginBottom: "1.5rem",
          color: "oklch(0.145 0 0)",
        }}
      >
        {product.name}
      </h1>

      <p
        style={{
          fontFamily: "monospace",
          fontSize: "1.5rem",
          color: "oklch(0.145 0 0)",
          marginBottom: "2rem",
        }}
      >
        {formatPrice(product.selling_price)}
      </p>

      <div
        style={{
          borderTop: "1px solid oklch(0.922 0 0)",
          marginBottom: "2rem",
        }}
      />

      <p
        style={{
          fontSize: "0.9rem",
          lineHeight: 1.7,
          color: "oklch(0.45 0 0)",
          marginBottom: "2rem",
        }}
      >
        {product.description || "No description available."}
      </p>

      {product.brand && (
        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            marginBottom: "1.5rem",
            fontSize: "0.8rem",
            color: "oklch(0.556 0 0)",
          }}
        >
          <span
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "oklch(0.708 0 0)",
              minWidth: 60,
            }}
          >
            Brand
          </span>
          <span>{product.brand}</span>
        </div>
      )}

      {product.tags && product.tags.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            marginBottom: "2.5rem",
          }}
        >
          {product.tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "2.5rem",
          fontSize: "0.75rem",
          color: product.status ? "oklch(0.45 0.15 145)" : "oklch(0.55 0 0)",
        }}
      >
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: product.status
              ? "oklch(0.65 0.2 145)"
              : "oklch(0.708 0 0)",
          }}
        />
        {product.status ? "In stock" : "Unavailable"}
      </div>

      <AddToCartButton product={product} />
    </div>
  );
}

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
    notFound();
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
        <Breadcrumb product={product!} />

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
