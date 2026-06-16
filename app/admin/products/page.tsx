"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ProductService, { type ProductQueryParameters } from "@/services/products/ProductService";
import type { Product } from "@/types/products";

// ============================================================================
// Types
// ============================================================================

type SortField = "name" | "category" | "price" | "status";
type SortDirection = "asc" | "desc";

interface ApiResponse {
  next: string | null;
  previous: string | null;
  results: Product[];
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_LIMIT = 10;

// Map UI sort fields to API sort field names
const SORT_FIELD_MAP: Record<SortField, string> = {
  name: "name",
  category: "category",
  price: "selling_price",
  status: "status",
};

// ============================================================================
// Utility Functions
// ============================================================================

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

const getHeroImage = (images: Product["images"]) => {
  const heroImage = images.find((img) => img.type === "HERO");
  return heroImage ? heroImage.url : images[0]?.url || null;
};

const getStatusColor = (status: boolean) => {
  return status ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";
};

const getSortIcon = (field: SortField, currentField: SortField, currentDirection: SortDirection): string => {
  if (currentField !== field) return "↕";
  return currentDirection === "asc" ? "↑" : "↓";
};

// ============================================================================
// Main Component
// ============================================================================

export default function ProductsAdminPage() {
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  
  // Sort state
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const productService = new ProductService();

  // Helper function to fetch products directly from API
  const fetchProducts = async (url: string): Promise<ApiResponse> => {
    const response = await fetch(url);
    return response.json();
  };

  // Load products
  const loadProducts = async (loadMore: boolean = false) => {
    if (loadMore) {
      setLoading(true);
    } else {
      setInitialLoading(true);
    }

    let results: Product[];
    let next: string | null = null;

    if (loadMore && nextUrl) {
      // Use the nextUrl for pagination
      const data = await fetchProducts(nextUrl);
      results = data.results;
      next = data.next;
    } else {
      // Build sort string
      const sortString = sortDirection === "asc" 
        ? SORT_FIELD_MAP[sortField] 
        : `-${SORT_FIELD_MAP[sortField]}`;

      // Initial load using cursor pagination with sort
      const baseUrl = process.env.BACKEND_URL || "http://localhost:8000";
      const url = `${baseUrl}/api/v1/products/?paginate=cursor&limit=${DEFAULT_LIMIT}&sort=${sortString}`;
      const data = await fetchProducts(url);
      results = data.results;
      next = data.next;
    }

    if (loadMore) {
      setProducts((prev) => [...prev, ...results]);
    } else {
      setProducts(results);
    }

    setNextUrl(next);
    setHasMore(!!next);
    setTotal((prevTotal) =>
      loadMore ? prevTotal + results.length : results.length
    );

    setInitialLoading(false);
    setLoading(false);
  };

  // Load initial products
  useEffect(() => {
    loadProducts();
  }, []);

  // Reload when sort changes
  useEffect(() => {
    setProducts([]);
    setNextUrl(null);
    loadProducts();
  }, [sortField, sortDirection]);

  const handleLoadMore = () => {
    if (!loading && hasMore && nextUrl) {
      loadProducts(true);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Render sortable header
  const renderSortableHeader = (field: SortField, label: string) => (
    <th
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 transition-colors select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        <span>{label}</span>
        <span className="text-blue-500 text-sm">
          {getSortIcon(field, sortField, sortDirection)}
        </span>
      </div>
    </th>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          {!initialLoading && (
            <p className="text-sm text-gray-500 mt-1">
              Showing {products.length} of {total} products
              {sortField !== "name" && ` • Sorted by ${sortField}`}
            </p>
          )}
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          + Add Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                {renderSortableHeader("name", "Product Name")}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                {renderSortableHeader("category", "Category")}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tags
                </th>
                {renderSortableHeader("price", "Price")}
                {renderSortableHeader("status", "Status")}
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {initialLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-3 text-gray-600">
                        Loading products...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const heroImage = getHeroImage(product.images);
                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {heroImage ? (
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={heroImage}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                            <span className="text-xs text-gray-500">No image</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <span className="font-medium text-gray-900">
                            {product.name}
                          </span>
                          <span className="block text-xs text-gray-500">
                            {product.brand}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600 line-clamp-2">
                          {product.description}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {product.category.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {product.tags.slice(0, 3).map((tag: string, index: number) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {product.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              +{product.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {formatPrice(product.selling_price)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            product.status
                          )}`}
                        >
                          {product.status ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <a
                          href={`https://example.com/edit/product/${product.id}`}
                          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition"
                        >
                          Edit
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Load More */}
      <div className="mt-6 flex flex-col items-center gap-4">
        {!initialLoading && products.length > 0 && (
          <>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Showing {products.length} of {total} products</span>
              {hasMore && (
                <span className="text-blue-600">(Load more available)</span>
              )}
            </div>

            {hasMore ? (
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-medium transition flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Loading...
                  </>
                ) : (
                  "Load More Products"
                )}
              </button>
            ) : (
              <div className="text-sm text-gray-500 py-2">
                ✓ All {total} products loaded
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}