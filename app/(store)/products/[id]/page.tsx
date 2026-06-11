"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { addProductToCart } from "@/mock/shoppingcart";
import type { Product, ProductImage } from "@/types/products";
import type { CartItem } from "@/types/CartItem";

// ─── Helpers ──────────────────────────────────────────────────

const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

async function fetchProduct(id: string): Promise<Product> {
  const res = await fetch(`/api/v1/products/${id}`);
  if (!res.ok) throw new Error("Product not found");
  const json = await res.json();
  return json.data;
}

// ─── Glyph ────────────────────────────────────────────────────

function ProductGlyph({ category }: { category: string }) {
  const stroke = "oklch(0.708 0 0)";
  const props = {
    width: 80,
    height: 80,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke,
    strokeWidth: 0.75,
  } as const;

  if (category === "Books")
    return (
      <svg {...props}>
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
      </svg>
    );

  if (category === "Notebooks")
    return (
      <svg {...props}>
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="16" y2="17" />
      </svg>
    );

  if (category === "Pens")
    return (
      <svg {...props}>
        <line x1="12" y1="19" x2="12" y2="23" />
        <path d="M6.34 17.66l-1.41-1.42 1.41-1.41" />
        <path d="M17.66 17.66l1.41-1.42-1.41-1.41" />
        <path d="M12 2L4.93 9.07a7 7 0 000 9.9L12 22l7.07-3.03a7 7 0 000-9.9L12 2z" />
      </svg>
    );

  return (
    <svg {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────

function Skeleton({ style }: { style?: React.CSSProperties }) {
  return (
    <div
      style={{
        background: "oklch(0.94 0 0)",
        borderRadius: 2,
        animation: "pulse 1.5s ease-in-out infinite",
        ...style,
      }}
    />
  );
}

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

// ─── Image gallery ────────────────────────────────────────────

function ImageGallery({
  images,
  productName,
  category,
}: {
  images: ProductImage[];
  productName: string;
  category: string;
}) {
  const hero = images.find((img) => img.type === "HERO");
  const [selected, setSelected] = useState<ProductImage>(hero ?? images[0]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {/* Main image */}
      <div
        style={{
          aspectRatio: "1/1",
          background: "oklch(0.985 0 0)",
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          border: "1px solid oklch(0.922 0 0)",
        }}
      >
        {selected ? (
          <img
            src={selected.url}
            alt={productName}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <ProductGlyph category={category} />
        )}
      </div>

      {/* Thumbnails — only show if more than one image */}
      {images.length > 1 && (
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {images.map((img) => (
            <button
              key={img.type}
              onClick={() => setSelected(img)}
              style={{
                width: 72,
                height: 72,
                padding: 0,
                border: selected.type === img.type
                  ? "2px solid oklch(0.145 0 0)"
                  : "2px solid oklch(0.922 0 0)",
                borderRadius: 4,
                overflow: "hidden",
                cursor: "pointer",
                background: "oklch(0.985 0 0)",
                flexShrink: 0,
                transition: "border-color 0.15s ease",
              }}
            >
              <img
                src={img.url}
                alt={img.type}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(false);
    fetchProduct(id)
      .then((p) => {
        setProduct(p);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [id]);

  function handleAddToCart() {
    if (!product) return;
    setCart((prev) => addProductToCart(prev, product));
    setAdded(true);
    setTimeout(() => setAdded(false), 900);
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
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "4rem 2rem 6rem",
        }}
      >
        {/* ── Breadcrumb ── */}
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
          <button
            onClick={() => router.push("/")}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              color: "oklch(0.708 0 0)",
              fontSize: "inherit",
              letterSpacing: "inherit",
              textTransform: "inherit",
            }}
          >
            Home
          </button>
          <span>/</span>
          {loading ? (
            <Skeleton style={{ width: 80, height: 12 }} />
          ) : (
            <>
              <button
                onClick={() => router.push(`/?category=${product?.category.id}`)}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  color: "oklch(0.708 0 0)",
                  fontSize: "inherit",
                  letterSpacing: "inherit",
                  textTransform: "inherit",
                }}
              >
                {product?.category.name}
              </button>
              <span>/</span>
              <span style={{ color: "oklch(0.35 0 0)" }}>{product?.name}</span>
            </>
          )}
        </nav>

        {/* ── Error state ── */}
        {error && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "6rem 2rem",
              gap: "1rem",
            }}
          >
            <p
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: "1.5rem",
                fontWeight: 400,
                color: "oklch(0.145 0 0)",
              }}
            >
              Product not found
            </p>
            <p style={{ fontSize: "0.875rem", color: "oklch(0.708 0 0)" }}>
              It may have been removed or the link is incorrect.
            </p>
            <button
              onClick={() => router.push("/")}
              style={{
                marginTop: "1rem",
                padding: "0.6rem 1.5rem",
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                background: "oklch(0.145 0 0)",
                color: "oklch(0.985 0 0)",
                border: "none",
                cursor: "pointer",
                borderRadius: 2,
              }}
            >
              Back to collection
            </button>
          </div>
        )}

        {/* ── Product layout ── */}
        {!error && (
          <div className="product-layout">
            {/* LEFT — Images */}
            <div className="product-image-col">
              {loading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <Skeleton style={{ aspectRatio: "1/1", width: "100%", borderRadius: 4 }} />
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {[0, 1].map((i) => (
                      <Skeleton key={i} style={{ width: 72, height: 72, borderRadius: 4 }} />
                    ))}
                  </div>
                </div>
              ) : (
                <ImageGallery
                  images={product?.images ?? []}
                  productName={product?.name ?? ""}
                  category={product?.category.name ?? ""}
                />
              )}
            </div>

            {/* RIGHT — Details */}
            <div className="product-details-col" style={{ paddingTop: "1rem" }}>
              {loading ? (
                <Skeleton style={{ width: 80, height: 11, marginBottom: "0.75rem" }} />
              ) : (
                <p
                  style={{
                    fontSize: "0.68rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "oklch(0.708 0 0)",
                    marginBottom: "0.75rem",
                  }}
                >
                  {product?.category.name}
                </p>
              )}

              {loading ? (
                <Skeleton style={{ width: "70%", height: 32, marginBottom: "1.5rem" }} />
              ) : (
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
                  {product?.name}
                </h1>
              )}

              {loading ? (
                <Skeleton style={{ width: 100, height: 28, marginBottom: "2rem" }} />
              ) : (
                <p
                  style={{
                    fontFamily: "monospace",
                    fontSize: "1.5rem",
                    color: "oklch(0.145 0 0)",
                    marginBottom: "2rem",
                  }}
                >
                  {formatPrice(product?.selling_price ?? 0)}
                </p>
              )}

              <div style={{ borderTop: "1px solid oklch(0.922 0 0)", marginBottom: "2rem" }} />

              {loading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "2rem" }}>
                  <Skeleton style={{ width: "100%", height: 14 }} />
                  <Skeleton style={{ width: "90%", height: 14 }} />
                  <Skeleton style={{ width: "75%", height: 14 }} />
                </div>
              ) : (
                <p
                  style={{
                    fontSize: "0.9rem",
                    lineHeight: 1.7,
                    color: "oklch(0.45 0 0)",
                    marginBottom: "2rem",
                  }}
                >
                  {product?.description || "No description available."}
                </p>
              )}

              {!loading && product?.brand && (
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

              {!loading && product?.tags && product.tags.length > 0 && (
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
                  {product.tags.map((tag) => (
                    <Tag key={tag} label={tag} />
                  ))}
                </div>
              )}

              {!loading && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "2.5rem",
                    fontSize: "0.75rem",
                    color: product?.status ? "oklch(0.45 0.15 145)" : "oklch(0.55 0 0)",
                  }}
                >
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: product?.status ? "oklch(0.65 0.2 145)" : "oklch(0.708 0 0)",
                    }}
                  />
                  {product?.status ? "In stock" : "Unavailable"}
                </div>
              )}

              {loading ? (
                <Skeleton style={{ width: "100%", height: 48 }} />
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={!product?.status}
                  style={{
                    width: "100%",
                    padding: "0.9rem 2rem",
                    fontSize: "0.75rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    background: added
                      ? "oklch(0.45 0.15 145)"
                      : product?.status
                        ? "oklch(0.145 0 0)"
                        : "oklch(0.85 0 0)",
                    color: product?.status ? "oklch(0.985 0 0)" : "oklch(0.556 0 0)",
                    border: "none",
                    borderRadius: 2,
                    cursor: product?.status ? "pointer" : "not-allowed",
                    transition: "background 0.2s ease",
                  }}
                >
                  {added ? "Added to cart ✓" : product?.status ? "Add to cart" : "Unavailable"}
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
