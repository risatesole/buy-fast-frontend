"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import ProductService from "@/services/products/ProductService";
import type { Category } from "@/services/products/ProductService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const productService = new ProductService();

// ========== HOOKS ==========

function useCategoriesList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchCategories = useCallback(async (search: string = "") => {
    setLoading(true);
    setError(null);

    try {
      const allCategories = await productService.getCategories();

      // Filter categories if search term exists
      let filteredCategories = allCategories;
      if (search.trim()) {
        const searchLower = search.toLowerCase().trim();
        filteredCategories = allCategories.filter(
          (category) =>
            category.name.toLowerCase().includes(searchLower) ||
            category.slug.toLowerCase().includes(searchLower) ||
            (category.description &&
              category.description.toLowerCase().includes(searchLower)),
        );
      }

      setCategories(filteredCategories);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories");
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, []);

  const search = useCallback(
    (value: string) => {
      setSearchTerm(value);
      setIsSearching(true);

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        fetchCategories(value);
      }, 500);
    },
    [fetchCategories],
  );

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    fetchCategories("");
  }, [fetchCategories]);

  const retry = useCallback(() => {
    fetchCategories(searchTerm);
  }, [fetchCategories, searchTerm]);

  useEffect(() => {
    fetchCategories("");

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    searchTerm,
    isSearching,
    search,
    clearSearch,
    retry,
  };
}

function useCategoryNavigation() {
  const router = useRouter();

  const goToCreateCategory = useCallback(() => {
    router.push("/admin/products/categories/create");
  }, [router]);

  const goToEditCategory = useCallback(
    (categoryId: number) => {
      router.push(`/admin/products/categories/edit/${categoryId}`);
    },
    [router],
  );

  return { goToCreateCategory, goToEditCategory };
}

// ========== TYPES ==========

type PageHeaderProps = {
  onAddCategory: () => void;
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

type CategoryRowProps = {
  category: Category;
  onEdit: (categoryId: number) => void;
};

type CategoriesTableProps = {
  categories: Category[];
  onEdit: (categoryId: number) => void;
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

function PageHeader({ onAddCategory }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Categories
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your product categories
        </p>
      </div>
      <button
        onClick={onAddCategory}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
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
        Add Category
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
          placeholder="Search categories by name, slug, or description..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2 pl-10 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
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
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 dark:bg-red-900/20 dark:border-red-800">
      <p className="text-red-700 dark:text-red-400">{message}</p>
      <button
        onClick={onRetry}
        className="mt-2 bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
      >
        Retry
      </button>
    </div>
  );
}

function EmptyState({ searchTerm }: EmptyStateProps) {
  return (
    <div className="text-center py-16 bg-white rounded-xl shadow-sm dark:bg-gray-800">
      <div className="text-6xl mb-4">🏷️</div>
      <p className="text-gray-500 dark:text-gray-400 text-lg">
        {searchTerm
          ? "No categories found matching your search"
          : "No categories found"}
      </p>
      {searchTerm ? (
        <p className="text-gray-400 text-sm mt-2">
          Try adjusting your search terms
        </p>
      ) : (
        <p className="text-gray-400 text-sm mt-2">
          Start by adding your first category
        </p>
      )}
    </div>
  );
}

function StatusBadge({ status }: StatusBadgeProps) {
  return status ? (
    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
      Active
    </span>
  ) : (
    <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
      Inactive
    </span>
  );
}

function CategoryRow({ category, onEdit }: CategoryRowProps) {
  return (
    <TableRow>
      <TableCell>{category.id}</TableCell>
      <TableCell>
        <div className="flex items-center">
          {category.image && (
            <div className="flex-shrink-0 h-10 w-10 mr-3">
              <img
                className="h-10 w-10 rounded-lg object-cover"
                src={category.image}
                alt={category.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {category.name}
            </div>
            {category.slug && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                /{category.slug}
              </div>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell>
        {category.description ? (
          <div className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-xs">
            {category.description}
          </div>
        ) : (
          <span className="text-sm text-gray-400 dark:text-gray-500">-</span>
        )}
      </TableCell>
      <TableCell>
        <StatusBadge status={category.status ?? false} />
      </TableCell>
      <TableCell>
        {category.created_at && (
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {new Date(category.created_at).toLocaleDateString()}
          </div>
        )}
      </TableCell>
      <TableCell>
        <button
          onClick={() => onEdit(category.id!)}
          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors text-sm font-medium"
        >
          Edit
        </button>
      </TableCell>
    </TableRow>
  );
}

function CategoriesTable({ categories, onEdit }: CategoriesTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden dark:bg-gray-800">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <CategoryRow
              key={category.id}
              category={category}
              onEdit={onEdit}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ========== MAIN PAGE ==========

export default function CategoriesPage() {
  const {
    categories,
    loading,
    error,
    searchTerm,
    isSearching,
    search,
    clearSearch,
    retry,
  } = useCategoriesList();

  const { goToCreateCategory, goToEditCategory } = useCategoryNavigation();

  return (
    <div className="container mx-auto px-4 py-0">
      <PageHeader onAddCategory={goToCreateCategory} />

      <SearchBar value={searchTerm} onChange={search} onClear={clearSearch} />

      {error && <ErrorBanner message={error} onRetry={retry} />}

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <BouncingDots />
        </div>
      ) : categories.length === 0 ? (
        <EmptyState searchTerm={searchTerm} />
      ) : (
        <CategoriesTable categories={categories} onEdit={goToEditCategory} />
      )}

      {!loading && categories.length > 0 && (
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            ✨ Showing {categories.length} categories
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>
      )}
    </div>
  );
}
