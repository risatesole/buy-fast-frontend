"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Customer } from "@/types/customers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ========== SERVICE ==========

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
const LIMIT = 100;

type CustomerQueryParameters = {
  sort?: string;
  limit?: number;
  offset?: number;
  search?: string;
  role?: string;
};

const DEFAULT_QUERY_PARAMS: CustomerQueryParameters = {
  sort: "id",
  limit: LIMIT,
  offset: 0,
  role: "customer",
};

function buildQueryParams(overrides: CustomerQueryParameters): string {
  const params = { ...DEFAULT_QUERY_PARAMS, ...overrides };
  const entries = Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => [key, String(value)]);
  return new URLSearchParams(entries).toString();
}

async function getCustomers(params: CustomerQueryParameters = {}): Promise<Customer[]> {
  if (!BACKEND_URL) {
    console.error("NEXT_PUBLIC_API_URL is not set");
    return [];
  }

  const url = `${BACKEND_URL}/api/v1/customers?${buildQueryParams(params)}`;

  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      console.error("Response not OK:", res.status, res.statusText);
      return [];
    }

    const json = await res.json();
    return json.data ?? [];
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
}

// ========== HOOKS ==========

function useCustomersList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [totalLoaded, setTotalLoaded] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchCustomers = useCallback(
    async (search: string = "", resetOffset: boolean = true) => {
      const currentOffset = resetOffset ? 0 : offset;

      setLoading(resetOffset);
      if (!resetOffset) setLoadingMore(true);
      setError(null);

      try {
        const params = {
          limit: LIMIT,
          offset: currentOffset,
          sort: "id",
          role: "customer",
          ...(search.trim() && { search: search.trim() }),
        };

        const newCustomers = await getCustomers(params);

        if (!newCustomers || newCustomers.length === 0) {
          setHasMore(false);
          if (resetOffset) setCustomers([]);
        } else {
          if (resetOffset) {
            setCustomers(newCustomers);
            setOffset(LIMIT);
            setTotalLoaded(newCustomers.length);
          } else {
            setCustomers((prev) => [...prev, ...newCustomers]);
            setOffset((prev) => prev + newCustomers.length);
            setTotalLoaded((prev) => prev + newCustomers.length);
          }
          setHasMore(newCustomers.length >= LIMIT);
        }
      } catch (err) {
        console.error("Error fetching customers:", err);
        setError("Failed to load customers");
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
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = setTimeout(() => {
        setOffset(0);
        setHasMore(true);
        setTotalLoaded(0);
        fetchCustomers(value, true);
      }, 500);
    },
    [fetchCustomers],
  );

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setOffset(0);
    setHasMore(true);
    setTotalLoaded(0);
    fetchCustomers("", true);
  }, [fetchCustomers]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || isSearching) return;
    await fetchCustomers(searchTerm, false);
  }, [loadingMore, hasMore, isSearching, searchTerm, fetchCustomers]);

  const retry = useCallback(() => {
    fetchCustomers(searchTerm, true);
  }, [fetchCustomers, searchTerm]);

  useEffect(() => {
    fetchCustomers("", true);
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  return {
    customers,
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

function SearchBar({ value, onChange, onClear }: { value: string; onChange: (v: string) => void; onClear: () => void }) {
  return (
    <div className="mb-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Search customers by name or email..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2 pl-10 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {value && (
          <button onClick={onClear} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: boolean }) {
  return status ? (
    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Active</span>
  ) : (
    <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Inactive</span>
  );
}

function CustomerRow({ customer }: { customer: Customer }) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <img
            src={customer.profilepicture}
            alt={`${customer.firstname} ${customer.lastname}`}
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
          {customer.id}
        </div>
      </TableCell>
      <TableCell>{customer.firstname}</TableCell>
      <TableCell>{customer.lastname}</TableCell>
      <TableCell>{customer.email}</TableCell>
      <TableCell>{customer.role}</TableCell>
      <TableCell><StatusBadge status={customer.status} /></TableCell>
    </TableRow>
  );
}

// ========== MAIN PAGE ==========

export default function CustomersPage() {
  const {
    customers,
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
  } = useCustomersList();

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Customers</h1>
      </div>

      <SearchBar value={searchTerm} onChange={search} onClear={clearSearch} />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
          <button onClick={retry} className="mt-2 bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200">Retry</button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-16"><BouncingDots /></div>
      ) : customers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <div className="text-6xl mb-4">👤</div>
          <p className="text-gray-500 text-lg">
            {searchTerm ? "No customers found matching your search" : "No customers found"}
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Id</TableHead>
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <CustomerRow key={customer.id} customer={customer} />
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-8 text-center">
            {loadingMore ? (
              <div className="flex justify-center items-center py-4"><BouncingDots /></div>
            ) : hasMore ? (
              <button
                onClick={loadMore}
                disabled={loadingMore || isSearching}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                Load More Customers
              </button>
            ) : (
              <p className="text-gray-400 text-sm">
                ✨ Showing all {totalLoaded} customers{searchTerm && ` matching "${searchTerm}"`}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}