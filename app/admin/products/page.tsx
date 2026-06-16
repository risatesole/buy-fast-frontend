"use client";

import { useState, useEffect } from "react";

// Simulated API function - returns a slice of products with pagination info
const fetchProducts = async (page: number, limit: number) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Full product list (20 products)
  const allProducts = [
    {
      id: 1,
      name: "Wireless Bluetooth Headphones",
      description: "Premium noise-cancelling headphones with 40hr battery life",
      category: "Electronics",
      tags: ["wireless", "audio", "premium"],
      status: "Published",
    },
    {
      id: 2,
      name: "Organic Cotton T-Shirt",
      description:
        "100% organic cotton, sustainably sourced and ethically made",
      category: "Apparel",
      tags: ["organic", "sustainable", "casual"],
      status: "Draft",
    },
    {
      id: 3,
      name: "Stainless Steel Water Bottle",
      description: "Vacuum insulated, keeps drinks cold for 24 hours",
      category: "Home & Kitchen",
      tags: ["eco-friendly", "insulated", "reusable"],
      status: "Archived",
    },
    {
      id: 4,
      name: "USB-C Charging Cable 2m",
      description: "Fast charging and data transfer for all USB-C devices",
      category: "Electronics",
      tags: ["fast-charge", "durable", "universal"],
      status: "Published",
    },
    {
      id: 5,
      name: "Non-Slip Yoga Mat",
      description: "Eco-friendly mat with excellent grip and cushioning",
      category: "Sports & Fitness",
      tags: ["eco-friendly", "non-slip", "durable"],
      status: "Draft",
    },
    {
      id: 6,
      name: "Smartphone Tripod Stand",
      description: "Adjustable tripod with Bluetooth remote for vlogging",
      category: "Electronics",
      tags: ["vlogging", "portable", "bluetooth"],
      status: "Published",
    },
    {
      id: 7,
      name: "Ceramic Coffee Mug Set",
      description: "Set of 4 handmade ceramic mugs with minimalist design",
      category: "Home & Kitchen",
      tags: ["ceramic", "handmade", "minimalist"],
      status: "Published",
    },
    {
      id: 8,
      name: "Running Sneakers",
      description: "Lightweight sneakers with responsive cushioning",
      category: "Apparel",
      tags: ["running", "athletic", "breathable"],
      status: "Draft",
    },
    {
      id: 9,
      name: "LED Desk Lamp",
      description: "Eye-caring desk lamp with 5 brightness levels",
      category: "Home & Kitchen",
      tags: ["led", "adjustable", "energy-saving"],
      status: "Archived",
    },
    {
      id: 10,
      name: "Phone Case - Clear",
      description: "Shockproof clear case with anti-yellowing technology",
      category: "Electronics",
      tags: ["protective", "clear", "shockproof"],
      status: "Published",
    },
    {
      id: 11,
      name: "Resistance Bands Set",
      description: "5-piece resistance band set for home workouts",
      category: "Sports & Fitness",
      tags: ["workout", "portable", "versatile"],
      status: "Published",
    },
    {
      id: 12,
      name: "Leather Wallet",
      description: "Genuine leather wallet with RFID protection",
      category: "Apparel",
      tags: ["leather", "rfid", "slim"],
      status: "Draft",
    },
    {
      id: 13,
      name: "Air Purifier",
      description: "HEPA air purifier for allergies and dust removal",
      category: "Home & Kitchen",
      tags: ["hepa", "air-quality", "quiet"],
      status: "Published",
    },
    {
      id: 14,
      name: "Wireless Mouse",
      description: "Ergonomic wireless mouse with adjustable DPI",
      category: "Electronics",
      tags: ["wireless", "ergonomic", "quiet-click"],
      status: "Archived",
    },
    {
      id: 15,
      name: "Cotton Bedsheet Set",
      description: "100% cotton bedsheet set, 400 thread count",
      category: "Home & Kitchen",
      tags: ["cotton", "breathable", "luxury"],
      status: "Published",
    },
    {
      id: 16,
      name: "Dumbbell Set",
      description: "Adjustable dumbbell set with weight plates",
      category: "Sports & Fitness",
      tags: ["adjustable", "strength", "home-gym"],
      status: "Published",
    },
    {
      id: 17,
      name: "Sunglasses - Classic",
      description: "UV protection sunglasses with polarized lenses",
      category: "Apparel",
      tags: ["uv-protection", "polarized", "classic"],
      status: "Draft",
    },
    {
      id: 18,
      name: "Electric Kettle",
      description: "Stainless steel kettle with auto shut-off",
      category: "Home & Kitchen",
      tags: ["stainless", "fast-boil", "safe"],
      status: "Archived",
    },
    {
      id: 19,
      name: "Fitness Tracker Band",
      description: "Smart fitness band with heart rate monitor",
      category: "Electronics",
      tags: ["fitness", "heart-rate", "waterproof"],
      status: "Published",
    },
    {
      id: 20,
      name: "Yoga Blocks Set",
      description: "Set of 2 eco-friendly foam yoga blocks",
      category: "Sports & Fitness",
      tags: ["yoga", "foam", "support"],
      status: "Published",
    },
  ];

  // Calculate pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedItems = allProducts.slice(startIndex, endIndex);

  return {
    products: paginatedItems,
    total: allProducts.length,
    page,
    limit,
    hasMore: endIndex < allProducts.length,
  };
};

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Load initial products
  useEffect(() => {
    loadProducts(1);
  }, []);

  const loadProducts = async (pageNum: number) => {
    if (pageNum === 1) {
      setInitialLoading(true);
    } else {
      setLoading(true);
    }

    try {
      const result = await fetchProducts(pageNum, limit);

      if (pageNum === 1) {
        setProducts(result.products);
      } else {
        setProducts((prev) => [...prev, ...result.products]);
      }

      setHasMore(result.hasMore);
      setTotal(result.total);
      setPage(pageNum);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setInitialLoading(false);
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadProducts(page + 1);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published":
        return "bg-green-100 text-green-800";
      case "Draft":
        return "bg-yellow-100 text-yellow-800";
      case "Archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          {!initialLoading && (
            <p className="text-sm text-gray-500 mt-1">
              Showing {products.length} of {total} products
            </p>
          )}
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          + Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tags
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {initialLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
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
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-900">
                        {product.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 line-clamp-2">
                        {product.description}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {product.tags.map((tag: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          product.status,
                        )}`}
                      >
                        {product.status}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Load More Section */}
      <div className="mt-6 flex flex-col items-center gap-4">
        {!initialLoading && products.length > 0 && (
          <>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>
                Showing {products.length} of {total} products
              </span>
              {hasMore && (
                <span className="text-blue-600">
                  ({total - products.length} more available)
                </span>
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
