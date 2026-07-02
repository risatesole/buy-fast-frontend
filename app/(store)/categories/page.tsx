// app/(store)/categories/page.tsx
import Link from "next/link";

export const dynamic = "force-dynamic";

type RawCategory = {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  status: boolean;
};

const DJANGO_BASE = process.env.BACKEND_URL ?? "http://localhost:8000";

async function getActiveCategories(): Promise<RawCategory[]> {
  const res = await fetch(
    `${DJANGO_BASE}/api/v1/products/categories?status=true`,
    {
      headers: { Accept: "application/json" },
      cache: 'no-store',  
    }
  );

  if (!res.ok) {
    console.error("Failed to fetch categories:", res.status);
    return [];
  }

  const json: { status: string; data: RawCategory[] } = await res.json();
  return json.data ?? [];
}

export default async function CategoriesPage() {
  const categories = await getActiveCategories();

  return (
    <main style={{ maxWidth: 1280, margin: "0 auto", padding: "4rem 2rem 6rem" }}>
      {/* Page header */}
      <header style={{ marginBottom: "3rem", borderBottom: "1px solid oklch(0.922 0 0)", paddingBottom: "1.5rem" }}>
        <p
          style={{
            fontSize: "0.68rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "oklch(0.708 0 0)",
            marginBottom: "0.5rem",
          }}
        >
          Shop by
        </p>
        <h1
          style={{
            fontFamily: "'Georgia', serif",
            fontWeight: 400,
            fontSize: "2rem",
            margin: 0,
          }}
        >
          Categories
        </h1>
      </header>

      {categories.length === 0 ? (
        <p style={{ color: "oklch(0.708 0 0)", fontSize: "1rem" }}>
          No categories available right now.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "2rem",
          }}
        >
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      )}
    </main>
  );
}

function CategoryCard({ category }: { category: RawCategory }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <article
        style={{
          display: "flex",
          flexDirection: "column",
          borderBottom: "1px solid oklch(0.922 0 0)",
          paddingBottom: "1.5rem",
          cursor: "pointer",
        }}
      >
        {/* Image area */}
        <div
          style={{
            aspectRatio: "4/3",
            background: "oklch(0.985 0 0)",
            borderRadius: 4,
            marginBottom: "1.25rem",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {category.image ? (
            <img
              src={category.image}
              alt={category.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <CategoryGlyph name={category.name} />
          )}
        </div>

        {/* Name */}
        <h2
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "1rem",
            fontWeight: 400,
            margin: "0 0 0.4rem",
          }}
        >
          {category.name}
        </h2>

        {/* Description (truncated) */}
        {category.description && (
          <p
            style={{
              fontSize: "0.82rem",
              color: "oklch(0.708 0 0)",
              margin: 0,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {category.description}
          </p>
        )}
      </article>
    </Link>
  );
}

function CategoryGlyph({ name }: { name: string }) {
  const stroke = "oklch(0.708 0 0)";
  const props = {
    width: 48,
    height: 48,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke,
    strokeWidth: 1,
  };

  return (
    <svg {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  );
}
