"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import ProductService from "@/services/products/ProductService";
import type { Product } from "@/types/products";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const productService = new ProductService();
const LIMIT = 100;

// ========== UTILS ==========

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

// ========== HOOKS ==========

function useProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [totalLoaded, setTotalLoaded] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchProducts = useCallback(
    async (search: string = "", resetOffset: boolean = true) => {
      const currentOffset = resetOffset ? 0 : offset;

      setLoading(resetOffset);
      if (!resetOffset) setLoadingMore(true);
      setError(null);

      try {
        const params: any = {
          limit: LIMIT,
          offset: currentOffset,
          sort: "id",
        };

        if (search.trim()) {
          params.search = search.trim();
        }

        const newProducts = await productService.getProducts(params);

        if (!newProducts || newProducts.length === 0) {
          setHasMore(false);
          if (resetOffset) {
            setProducts([]);
          }
        } else {
          if (resetOffset) {
            setProducts(newProducts);
            setOffset(LIMIT);
            setTotalLoaded(newProducts.length);
          } else {
            setProducts((prev) => [...prev, ...newProducts]);
            setOffset((prev) => prev + newProducts.length);
            setTotalLoaded((prev) => prev + newProducts.length);
          }

          if (newProducts.length < LIMIT) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setIsSearching(false);
      }
    },
    [offset],
  );

  const search = useCallback(
    (value: string) => {
      setSearchTerm(value);
      setIsSearching(true);

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        setOffset(0);
        setHasMore(true);
        setTotalLoaded(0);
        fetchProducts(value, true);
      }, 500);
    },
    [fetchProducts],
  );

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setOffset(0);
    setHasMore(true);
    setTotalLoaded(0);
    fetchProducts("", true);
  }, [fetchProducts]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || isSearching) return;
    await fetchProducts(searchTerm, false);
  }, [loadingMore, hasMore, isSearching, searchTerm, fetchProducts]);

  const retry = useCallback(() => {
    fetchProducts(searchTerm, true);
  }, [fetchProducts, searchTerm]);

  useEffect(() => {
    fetchProducts("", true);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return {
    products,
    loading,
    loadingMore,
    hasMore,
    error,
    totalLoaded,
    searchTerm,
    isSearching,
    search,
    clearSearch,
    loadMore,
    retry,
  };
}

function useProductNavigation() {
  const router = useRouter();

  const goToCreateProduct = useCallback(() => {
    router.push("/admin/products/create");
  }, [router]);

  const goToEditProduct = useCallback(
    (productId: number) => {
      router.push(`/admin/products/edit/${productId}`);
    },
    [router],
  );

  return { goToCreateProduct, goToEditProduct };
}

// ========== TYPES ==========

type PageHeaderProps = {
  onAddProduct: () => void;
};

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
};

type ErrorBannerProps = {
  message: string;
  onRetry: () => void;
};

type EmptyStateProps = {
  searchTerm: string;
};

type StatusBadgeProps = {
  status: boolean;
};

type TagsListProps = {
  tags?: string[];
};

type ProductImageCellProps = {
  product: Product;
};

type ProductRowProps = {
  product: Product;
  onEdit: (productId: number) => void;
};

type ProductsTableProps = {
  products: Product[];
  onEdit: (productId: number) => void;
};

type LoadMoreSectionProps = {
  loadingMore: boolean;
  hasMore: boolean;
  isSearching: boolean;
  totalLoaded: number;
  searchTerm: string;
  onLoadMore: () => void;
};

// ========== COMPONENTS ==========

function BouncingDots() {
  return (
    <div className="flex space-x-2">
      <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" />
      <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
      <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
    </div>
  );
}

function PageHeader({ onAddProduct }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Products
        </h1>
      </div>
      <button
        onClick={onAddProduct}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add Product
      </button>
    </div>
  );
}

function SearchBar({ value, onChange, onClear }: SearchBarProps) {
  return (
    <div className="mb-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Search products by name, brand, category, or tags..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2 pl-10 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <svg
          className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {value && (
          <button
            onClick={onClear}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <p className="text-red-700">{message}</p>
      <button
        onClick={onRetry}
        className="mt-2 bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200"
      >
        Retry
      </button>
    </div>
  );
}

function EmptyState({ searchTerm }: EmptyStateProps) {
  return (
    <div className="text-center py-16 bg-white rounded-xl shadow-sm">
      <div className="text-6xl mb-4">📦</div>
      <p className="text-gray-500 text-lg">
        {searchTerm
          ? "No products found matching your search"
          : "No products found"}
      </p>
      {searchTerm ? (
        <p className="text-gray-400 text-sm mt-2">
          Try adjusting your search terms
        </p>
      ) : (
        <p className="text-gray-400 text-sm mt-2">
          Start by adding your first product
        </p>
      )}
    </div>
  );
}

function StatusBadge({ status }: StatusBadgeProps) {
  return status ? (
    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
      Active
    </span>
  ) : (
    <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
      Inactive
    </span>
  );
}

function TagsList({ tags }: TagsListProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {tags.slice(0, 3).map((tag, index) => (
        <span
          key={index}
          className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600"
        >
          {tag}
        </span>
      ))}
      {tags.length > 3 && (
        <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-400">
          +{tags.length - 3}
        </span>
      )}
    </div>
  );
}

function ProductImageCell({ product }: ProductImageCellProps) {
  return (
    <div className="flex items-center">
      {product.images && product.images.length > 0 && (
        <div className="flex-shrink-0 h-10 w-10">
          <img
            className="h-10 w-10 rounded-lg object-cover"
            src={
              product.images.find((img) => img.type === "HERO")?.url ||
              product.images[0].url
            }
            alt={product.name}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}
      <div className="ml-4">
        <div className="text-sm font-medium text-gray-900">
          {product.name}
        </div>
        {product.description && (
          <div className="text-sm text-gray-500 truncate max-w-xs">
            {product.description}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductRow({ product, onEdit }: ProductRowProps) {
  return (
    <TableRow>
      <TableCell>{product.id}</TableCell>
      <TableCell>
        <ProductImageCell product={product} />
      </TableCell>
      <TableCell>{product.category?.name || "-"}</TableCell>
      <TableCell>{product.brand || "-"}</TableCell>
      <TableCell className="font-medium">
        {formatPrice(product.selling_price)}
      </TableCell>
      <TableCell>x avialable</TableCell>
      <TableCell>
        <StatusBadge status={product.status} />
      </TableCell>
      <TableCell>
        <TagsList tags={product.tags} />
      </TableCell>
      <TableCell>
        <button
          onClick={() => onEdit(product.id)}
          className="text-blue-600 hover:text-blue-900 transition-colors text-sm font-medium"
        >
          Edit
        </button>
      </TableCell>
    </TableRow>
  );
}

function ProductsTable({ products, onEdit }: ProductsTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Inventory</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <ProductRow key={product.id} product={product} onEdit={onEdit} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function LoadMoreSection({
  loadingMore,
  hasMore,
  isSearching,
  totalLoaded,
  searchTerm,
  onLoadMore,
}: LoadMoreSectionProps) {
  return (
    <div className="mt-8 text-center">
      {loadingMore ? (
        <div className="flex justify-center items-center py-4">
          <BouncingDots />
        </div>
      ) : hasMore ? (
        <button
          onClick={onLoadMore}
          disabled={loadingMore || isSearching}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
        >
          Load More Products
        </button>
      ) : (
        <p className="text-gray-400 text-sm">
          ✨ Showing all {totalLoaded} products
          {searchTerm && ` matching "${searchTerm}"`}
        </p>
      )}
    </div>
  );
}

// ========== MAIN PAGE ==========

export default function ProductsPage() {
  const {
    products,
    loading,
    loadingMore,
    hasMore,
    error,
    totalLoaded,
    searchTerm,
    isSearching,
    search,
    clearSearch,
    loadMore,
    retry,
  } = useProductsList();

  const { goToCreateProduct, goToEditProduct } = useProductNavigation();

  return (
    <div>
      <div className="container mx-auto px-4 py-0">
        <PageHeader onAddProduct={goToCreateProduct} />

        <SearchBar value={searchTerm} onChange={search} onClear={clearSearch} />

        {error && <ErrorBanner message={error} onRetry={retry} />}

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <BouncingDots />
          </div>
        ) : products.length === 0 ? (
          <EmptyState searchTerm={searchTerm} />
        ) : (
          <>
            <ProductsTable products={products} onEdit={goToEditProduct} />
            <LoadMoreSection
              loadingMore={loadingMore}
              hasMore={hasMore}
              isSearching={isSearching}
              totalLoaded={totalLoaded}
              searchTerm={searchTerm}
              onLoadMore={loadMore}
            />
          </>
        )}
      </div>
    </div>
  );
}
