'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, Undo2, Search, X, Eye, FileText } from 'lucide-react';

// ========== TYPES ==========

type Order = {
  id: string | number;
  profilepicture: string;
  firstname: string;
  lastname: string;
  email: string;
  created_at: string;
  total: number;
  status: 'fullfilled' | 'pending' | 'returned';
  pickup_time: string;
};

// ========== CONSTANTS ==========

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
const LIMIT = 100;
const SEARCH_DEBOUNCE_DELAY = 500;

// ========== API SERVICE ==========

type OrderQueryParams = {
  sort?: string;
  limit?: number;
  offset?: number;
  search?: string;
};

const DEFAULT_QUERY_PARAMS: OrderQueryParams = {
  sort: 'pickup_time',
  limit: LIMIT,
  offset: 0,
};

/**
 * Builds URL query string from parameters
 */
function buildQueryString(params: OrderQueryParams): string {
  const mergedParams = { ...DEFAULT_QUERY_PARAMS, ...params };

  const queryEntries = Object.entries(mergedParams)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => [key, String(value)]);

  return new URLSearchParams(queryEntries).toString();
}

/**
 * Fetches orders from the backend API
 */
async function fetchOrdersFromApi(params: OrderQueryParams = {}): Promise<Order[]> {
  if (!BACKEND_URL) {
    console.error('NEXT_PUBLIC_API_URL is not set');
    return [];
  }

  const queryString = buildQueryString(params);
  const url = `/api/v1/admin/orders?${queryString}`;

  try {
    const response = await fetch(url, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      console.error('API Error:', response.status, response.statusText);
      return [];
    }

    const json = await response.json();
    return json.data ?? [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

// ========== CUSTOM HOOKS ==========

/**
 * Manages orders state, pagination, and search functionality
 */
function useOrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [totalLoaded, setTotalLoaded] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Fetches orders with current search and pagination state
   */
  const fetchOrders = useCallback(
    async (search: string = '', shouldResetOffset: boolean = true) => {
      const currentOffset = shouldResetOffset ? 0 : offset;

      setIsLoading(shouldResetOffset);
      if (!shouldResetOffset) setIsLoadingMore(true);
      setError(null);

      try {
        const params: OrderQueryParams = {
          limit: LIMIT,
          offset: currentOffset,
          sort: 'id',
        };

        if (search.trim()) {
          params.search = search.trim();
        }

        const newOrders = await fetchOrdersFromApi(params);

        if (!newOrders || newOrders.length === 0) {
          setHasMore(false);
          if (shouldResetOffset) setOrders([]);
        } else {
          if (shouldResetOffset) {
            setOrders(newOrders);
            setOffset(LIMIT);
            setTotalLoaded(newOrders.length);
          } else {
            setOrders(prevOrders => [...prevOrders, ...newOrders]);
            setOffset(prevOffset => prevOffset + newOrders.length);
            setTotalLoaded(prevTotal => prevTotal + newOrders.length);
          }
          setHasMore(newOrders.length >= LIMIT);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders');
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
        setIsSearching(false);
      }
    },
    [offset]
  );

  /**
   * Handles search input with debouncing
   */
  const handleSearch = useCallback(
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
        fetchOrders(value, true);
      }, SEARCH_DEBOUNCE_DELAY);
    },
    [fetchOrders]
  );

  /**
   * Clears search and resets to initial state
   */
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setOffset(0);
    setHasMore(true);
    setTotalLoaded(0);
    fetchOrders('', true);
  }, [fetchOrders]);

  /**
   * Loads next page of orders
   */
  const loadMoreOrders = useCallback(async () => {
    if (isLoadingMore || !hasMore || isSearching) return;
    await fetchOrders(searchTerm, false);
  }, [isLoadingMore, hasMore, isSearching, searchTerm, fetchOrders]);

  /**
   * Retries failed request
   */
  const retryFetch = useCallback(() => {
    fetchOrders(searchTerm, true);
  }, [fetchOrders, searchTerm]);

  // Initial load
  useEffect(() => {
    fetchOrders('', true);
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  return {
    orders,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    totalLoaded,
    searchTerm,
    isSearching,
    handleSearch,
    clearSearch,
    loadMoreOrders,
    retryFetch,
  };
}

// ========== UI COMPONENTS ==========

/**
 * Animated loading dots
 */
function LoadingDots() {
  return (
    <div className="flex space-x-2">
      <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" />
      <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
      <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
    </div>
  );
}

/**
 * Search input with clear button
 */
function SearchBar({
  value,
  onChange,
  onClear,
}: {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="mb-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Search orders by customer name..."
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full px-4 py-2 pl-10 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {/* Search Icon */}
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

        {/* Clear Button */}
        {value && (
          <button
            onClick={onClear}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Error message with retry button
 */
function ErrorMessage({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <p className="text-red-700">{message}</p>
      <button
        onClick={onRetry}
        className="mt-2 bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 transition-colors"
      >
        Retry
      </button>
    </div>
  );
}

/**
 * Empty state when no orders are found
 */
function EmptyState({ searchTerm }: { searchTerm: string }) {
  return (
    <div className="text-center py-16 bg-white rounded-xl shadow-sm">
      <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
      <p className="text-gray-500 text-lg">
        {searchTerm ? 'No orders found matching your search' : 'No orders found'}
      </p>
    </div>
  );
}

/**
 * Table header with specified column order
 */
function OrdersTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>ID</TableHead>
        <TableHead>Customer Photo</TableHead>
        <TableHead>First Name</TableHead>
        <TableHead>Last Name</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Date of Order</TableHead>
        <TableHead>Total Paid</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Pickup Time</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}

/**
 * Status badge component with shadcn/ui Badge and Lucide icons
 */
function StatusBadge({ status }: { status: Order['status'] }) {
  const statusConfig = {
    pending: {
      variant: 'warning' as const,
      label: 'Pending',
      icon: Clock,
      className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200',
    },
    fullfilled: {
      variant: 'success' as const,
      label: 'Fulfilled',
      icon: CheckCircle2,
      className: 'bg-green-100 text-green-800 hover:bg-green-100 border-green-200',
    },
    returned: {
      variant: 'destructive' as const,
      label: 'Returned',
      icon: Undo2,
      className: 'bg-red-100 text-red-800 hover:bg-red-100 border-red-200',
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.className}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </Badge>
  );
}

/**
 * Single order row with all columns in specified order
 */
function OrderRow({ order }: { order: Order }) {
  return (
    <TableRow>
      <TableCell className="font-mono text-sm">{order.id}</TableCell>

      <TableCell>
        <img
          src={order.profilepicture}
          alt={`${order.firstname} ${order.lastname}`}
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
      </TableCell>

      <TableCell className="font-medium">{order.firstname}</TableCell>

      <TableCell className="font-medium">{order.lastname}</TableCell>

      <TableCell className="text-sm">{order.email}</TableCell>

      <TableCell>{formatDate(order.created_at)}</TableCell>

      <TableCell className="font-semibold">{formatCurrency(order.total)}</TableCell>

      <TableCell>
        <StatusBadge status={order.status} />
      </TableCell>

      <TableCell>{order.pickup_time ? formatDate(order.pickup_time) : '—'}</TableCell>

      <TableCell>
        <Button variant="outline" size="sm" asChild>
          <a
            href={`/admin/customers/orders/${order.id}`}
            className="inline-flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            Info
          </a>
        </Button>
      </TableCell>
    </TableRow>
  );
}

/**
 * Load more button or completion message
 */
function LoadMoreSection({
  hasMore,
  isLoadingMore,
  isSearching,
  totalLoaded,
  searchTerm,
  onLoadMore,
}: {
  hasMore: boolean;
  isLoadingMore: boolean;
  isSearching: boolean;
  totalLoaded: number;
  searchTerm: string;
  onLoadMore: () => void;
}) {
  if (isLoadingMore) {
    return (
      <div className="flex justify-center items-center py-4">
        <LoadingDots />
      </div>
    );
  }

  if (hasMore) {
    return (
      <button
        onClick={onLoadMore}
        disabled={isLoadingMore || isSearching}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
      >
        Load More Orders
      </button>
    );
  }

  return (
    <p className="text-gray-400 text-sm">
      ✨ Showing all {totalLoaded} orders
      {searchTerm && ` matching "${searchTerm}"`}
    </p>
  );
}

// ========== UTILITY FUNCTIONS ==========

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

// ========== MAIN PAGE ==========

export default function OrdersPage() {
  const {
    orders,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    totalLoaded,
    searchTerm,
    isSearching,
    handleSearch,
    clearSearch,
    loadMoreOrders,
    retryFetch,
  } = useOrdersList();

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Orders</h1>

      <SearchBar value={searchTerm} onChange={handleSearch} onClear={clearSearch} />

      {error && <ErrorMessage message={error} onRetry={retryFetch} />}

      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <LoadingDots />
        </div>
      ) : orders.length === 0 ? (
        <EmptyState searchTerm={searchTerm} />
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <Table>
              <OrdersTableHeader />
              <TableBody>
                {orders.map(order => (
                  <OrderRow key={order.id} order={order} />
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-8 text-center">
            <LoadMoreSection
              hasMore={hasMore}
              isLoadingMore={isLoadingMore}
              isSearching={isSearching}
              totalLoaded={totalLoaded}
              searchTerm={searchTerm}
              onLoadMore={loadMoreOrders}
            />
          </div>
        </>
      )}
    </div>
  );
}
