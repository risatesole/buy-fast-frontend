'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import InventoryService from '@/features/admin/inventory/service/index';
import type { StockMovement } from '@/features/admin/inventory/types/stockMovement';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const LIMIT = 100;

// ========== UTILS ==========
function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getMovementTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    initial_inventory: 'Initial Stock',
    purchase_entry: 'Purchase Entry',
    customer_sell: 'Customer Sale',
  };
  return labels[type] || type;
}

function getMovementTypeColor(type: string): string {
  const colors: Record<string, string> = {
    initial_inventory: 'bg-blue-100 text-blue-800',
    purchase_entry: 'bg-green-100 text-green-800',
    customer_sell: 'bg-orange-100 text-orange-800',
  };
  return colors[type] || 'bg-gray-100 text-gray-800';
}

// ========== HOOKS ==========

function useStockMovementList() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [totalLoaded, setTotalLoaded] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchMovements = useCallback(
    async (search: string = '', resetOffset: boolean = true) => {
      const currentOffset = resetOffset ? 0 : offset;

      setLoading(resetOffset);
      if (!resetOffset) setLoadingMore(true);
      setError(null);

      try {
        const params: {
          limit: number;
          offset: number;
          sort: string;
          search?: string;
        } = {
          limit: LIMIT,
          offset: currentOffset,
          sort: 'date_time',
        };

        if (search.trim()) {
          params.search = search.trim();
        }
        const inventoryService = new InventoryService();
        const newMovements = await inventoryService.getStockMovements(params);

        if (!newMovements || newMovements.length === 0) {
          setHasMore(false);
          if (resetOffset) {
            setMovements([]);
          }
        } else {
          if (resetOffset) {
            setMovements(newMovements);
            setOffset(LIMIT);
            setTotalLoaded(newMovements.length);
          } else {
            setMovements(prev => [...prev, ...newMovements]);
            setOffset(prev => prev + newMovements.length);
            setTotalLoaded(prev => prev + newMovements.length);
          }

          if (newMovements.length < LIMIT) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
        }
      } catch (err) {
        console.error('Error fetching stock movements:', err);
        setError('Failed to load stock movements');
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setIsSearching(false);
      }
    },
    [offset]
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
        fetchMovements(value, true);
      }, 500);
    },
    [fetchMovements]
  );

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setOffset(0);
    setHasMore(true);
    setTotalLoaded(0);
    fetchMovements('', true);
  }, [fetchMovements]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || isSearching) return;
    await fetchMovements(searchTerm, false);
  }, [loadingMore, hasMore, isSearching, searchTerm, fetchMovements]);

  const retry = useCallback(() => {
    fetchMovements(searchTerm, true);
  }, [fetchMovements, searchTerm]);

  const initialLoadRef = useRef(false);

  useEffect(() => {
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      fetchMovements('', true);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [fetchMovements]);

  return {
    movements,
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

// ========== TYPES ==========

type PageHeaderProps = {
  title: string;
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

type MovementTypeBadgeProps = {
  type: string;
};

type StockMovementRowProps = {
  movement: StockMovement;
};

type StockMovementsTableProps = {
  movements: StockMovement[];
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

function PageHeader({ title }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
      </div>
    </div>
  );
}

function SearchBar({ value, onChange, onClear }: SearchBarProps) {
  return (
    <div className="mb-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Search by product name, document reference, or brand..."
          value={value}
          onChange={e => onChange(e.target.value)}
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
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <div className="text-6xl mb-4">📊</div>
      <p className="text-gray-500 text-lg">
        {searchTerm ? 'No stock movements found matching your search' : 'No stock movements found'}
      </p>
      {searchTerm && <p className="text-gray-400 text-sm mt-2">Try adjusting your search terms</p>}
    </div>
  );
}

function MovementTypeBadge({ type }: MovementTypeBadgeProps) {
  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getMovementTypeColor(type)}`}>
      {getMovementTypeLabel(type)}
    </span>
  );
}

function StockMovementRow({ movement }: StockMovementRowProps) {
  return (
    <TableRow>
      <TableCell className="font-mono text-sm">{movement.id}</TableCell>
      <TableCell>{formatDateTime(movement.date_time)}</TableCell>
      <TableCell>
        <div>
          <div className="font-medium text-gray-900">{movement.product.name}</div>
          <div className="text-sm text-gray-500">{movement.product.slug}</div>
        </div>
      </TableCell>
      <TableCell>{movement.product.category || '-'}</TableCell>
      <TableCell>
        <MovementTypeBadge type={movement.movement.type} />
      </TableCell>
      <TableCell className="text-center font-semibold">{movement.quantity}</TableCell>
      <TableCell className="text-center font-semibold">{movement.balance}</TableCell>
      <TableCell className="font-mono text-sm">{movement.document_reference || '-'}</TableCell>
    </TableRow>
  );
}

function StockMovementsTable({ movements }: StockMovementsTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Movement Type</TableHead>
            <TableHead className="text-center">Quantity</TableHead>
            <TableHead className="text-center">Balance</TableHead>
            <TableHead>Document Ref</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movements.map(movement => (
            <StockMovementRow key={movement.id} movement={movement} />
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
          Load More Movements
        </button>
      ) : (
        <p className="text-gray-400 text-sm">
          ✨ Showing all {totalLoaded} movements
          {searchTerm && ` matching "${searchTerm}"`}
        </p>
      )}
    </div>
  );
}

// ========== MAIN PAGE ==========

export default function StockMovementPage() {
  const {
    movements,
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
  } = useStockMovementList();

  return (
    <div>
      <div className="container mx-auto px-4 py-0">
        <PageHeader title="Stock Movements" />

        <SearchBar value={searchTerm} onChange={search} onClear={clearSearch} />

        {error && <ErrorBanner message={error} onRetry={retry} />}

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <BouncingDots />
          </div>
        ) : movements.length === 0 ? (
          <EmptyState searchTerm={searchTerm} />
        ) : (
          <>
            <StockMovementsTable movements={movements} />
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
