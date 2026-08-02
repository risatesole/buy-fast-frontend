import Link from 'next/link';
import { PackageSearch, Search as SearchIcon } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import type { Product } from '@/entities/product';

const PAGE_SIZE = 4;

interface MappedProduct {
  id: string | number;
  name: string;
  slug: string;
  category: string;
  sellingPrice: number;
  thumbnail?: string;
}

interface PaginatedResponse {
  data: Product[];
  total: number;
  hasMoreResults: boolean;
}

function buildBackendUrl(searchQuery: string, offset: number, limit: number) {
  const baseUrl = process.env.BACKEND_URL ?? 'http://localhost:8000';
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });

  if (searchQuery.trim()) {
    params.set('search', searchQuery.trim());
  }

  return `${baseUrl}/api/v1/products/?${params.toString()}`;
}

async function getProducts(searchQuery: string, offset: number): Promise<PaginatedResponse> {
  const response = await fetch(buildBackendUrl(searchQuery, offset, PAGE_SIZE), {
    next: { revalidate: 300, tags: ['products', 'catalog'] },
  });

  if (!response.ok) {
    throw new Error(`No se pudieron cargar los productos (${response.status})`);
  }

  const json = await response.json();
  const products = Array.isArray(json?.results)
    ? json.results
    : Array.isArray(json?.data)
      ? json.data
      : [];

  const total =
    typeof json?.count === 'number'
      ? json.count
      : products.length > 0
        ? offset + products.length + (products.length === PAGE_SIZE ? 1 : 0)
        : 0;

  return {
    data: products,
    total,
    hasMoreResults: products.length === PAGE_SIZE,
  };
}

function mapProductsToView(products: Product[]): MappedProduct[] {
  return products.map(product => {
    const primaryVariant = product.variants?.[0];

    return {
      id: primaryVariant?.id ?? product.id,
      name: product.name,
      slug: primaryVariant?.slug || product.slug || '',
      category: product.category,
      sellingPrice: primaryVariant?.selling_price ?? 0,
      thumbnail: primaryVariant?.thumbnail || product.thumbnail || '',
    };
  });
}

function Pagination({
  currentPage,
  hasMoreResults,
  searchQuery,
}: {
  currentPage: number;
  hasMoreResults: boolean;
  searchQuery: string;
}) {
  const buildHref = (page: number) => {
    const params = new URLSearchParams();

    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    }

    params.set('page', String(page));
    return `/catalog?${params.toString()}`;
  };

  const baseClasses =
    'border border-[#e2e8f0] bg-white px-4 py-2 text-sm font-semibold text-[#43474f] transition-colors hover:bg-[#f7f9fb]';

  return (
    <nav
      className="mt-12 flex flex-wrap items-center justify-center gap-2"
      aria-label="Paginación del catálogo"
    >
      {currentPage > 1 && (
        <Link href={buildHref(currentPage - 1)} className={baseClasses}>
          Anterior
        </Link>
      )}

      <span className="px-3 py-2 text-sm font-semibold text-[#43474f]">Página {currentPage}</span>

      {hasMoreResults && (
        <Link href={buildHref(currentPage + 1)} className={baseClasses}>
          Siguiente
        </Link>
      )}
    </nav>
  );
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const searchQuery = resolvedSearchParams.search ?? '';
  const currentPage = Math.max(1, Number.parseInt(resolvedSearchParams.page ?? '1', 10) || 1);
  const offset = (currentPage - 1) * PAGE_SIZE;

  const { data: products, total, hasMoreResults } = await getProducts(searchQuery, offset);
  const mappedProducts = mapProductsToView(products);

  return (
    <main className="min-h-screen bg-[#f7f9fb]">
      <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <header className="rounded-none border border-[#e2e8f0] bg-white p-6 shadow-sm sm:p-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#747781]">
            Catálogo del Económato
          </p>
          <h1 className="font-serif text-3xl font-bold tracking-[-0.02em] text-[#002d62] sm:text-4xl">
            Explora todo nuestro inventario
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#43474f] sm:text-base">
            Busca productos por nombre y navega por todas las opciones disponibles con una
            experiencia sencilla y rápida.
          </p>

          <form action="/catalog" method="get" className="mt-6 flex flex-col gap-3 sm:flex-row">
            <label htmlFor="catalog-search" className="sr-only">
              Buscar productos
            </label>
            <div className="flex flex-1 items-center gap-3 rounded-none border border-[#e2e8f0] bg-[#f7f9fb] px-4 py-3">
              <SearchIcon className="size-5 text-[#747781]" />
              <input
                id="catalog-search"
                name="search"
                defaultValue={searchQuery}
                type="search"
                placeholder="Busca por nombre de producto"
                className="w-full border-none bg-transparent text-sm text-[#191c1e] outline-none placeholder:text-[#747781]"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-none bg-[#002d62] px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#115cb9]"
            >
              Buscar
            </button>
          </form>
        </header>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#43474f]">
            {total > 0
              ? `${total} producto${total === 1 ? '' : 's'} disponibles`
              : 'No hay productos para mostrar'}
          </p>
          {searchQuery ? (
            <p className="text-sm font-medium text-[#002d62]">
              Mostrando resultados para “{searchQuery}”
            </p>
          ) : null}
        </div>

        {mappedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-none border border-[#e2e8f0] bg-white px-6 py-20 text-center shadow-sm">
            <PackageSearch className="mb-4 size-12 text-[#c4c6d1]" strokeWidth={1.5} />
            <h2 className="font-serif text-2xl font-semibold text-[#002d62]">
              No encontramos productos
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-[#43474f]">
              Prueba con otro término de búsqueda o vuelve más tarde para ver nuevas incorporaciones
              al catálogo.
            </p>
          </div>
        ) : (
          <>
            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {mappedProducts.map(product => (
                <ProductCard
                  key={`${product.id}-${product.slug}`}
                  id={product.id}
                  name={product.name}
                  selling_price={product.sellingPrice}
                  categoryName={product.category}
                  image={product.thumbnail}
                  slug={product.slug}
                  actionLabel="Ver producto"
                />
              ))}
            </section>

            <Pagination
              currentPage={currentPage}
              hasMoreResults={hasMoreResults}
              searchQuery={searchQuery}
            />
          </>
        )}
      </section>
    </main>
  );
}
