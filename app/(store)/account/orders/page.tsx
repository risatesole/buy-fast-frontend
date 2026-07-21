'use client';

import { useState, useEffect, useCallback } from 'react';
import { SectionLabel } from '@/components/account/SectionLabel';
import { Button } from '@/components/ui/button';

type OrderStatus = 'delivered' | 'shipped' | 'processing' | 'cancelled';

type Order = {
  id: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: number;
  trackingNumber?: string;
};

// Mock data generator - simulates paginated API responses
const generateMockOrders = (offset: number, limit: number): Order[] => {
  const statuses: OrderStatus[] = ['delivered', 'shipped', 'processing', 'cancelled'];
  const mockOrders: Order[] = [];

  for (let i = 0; i < limit; i++) {
    const id = offset + i + 1;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    mockOrders.push({
      id: `ORD-${String(12345 - id).padStart(5, '0')}`,
      date: new Date(Date.now() - id * 86400000 * 2).toISOString().split('T')[0],
      total: Math.round((Math.random() * 200 + 10) * 100) / 100,
      status,
      items: Math.floor(Math.random() * 5) + 1,
      trackingNumber:
        status !== 'cancelled' && Math.random() > 0.3 ? `1Z999AA101234567${84 - id}` : undefined,
    });
  }
  return mockOrders;
};

const statusStyles: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  delivered: {
    label: 'Delivered',
    color: 'oklch(0.446 0.162 145.188)',
    bg: 'oklch(0.932 0.058 160.425)',
  },
  shipped: {
    label: 'Shipped',
    color: 'oklch(0.556 0.185 248.425)',
    bg: 'oklch(0.928 0.046 242.384)',
  },
  processing: {
    label: 'Processing',
    color: 'oklch(0.613 0.174 54.215)',
    bg: 'oklch(0.956 0.073 77.302)',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'oklch(0.637 0.237 25.331)',
    bg: 'oklch(0.956 0.067 18.472)',
  },
};

function StatusBadge({ status }: { status: OrderStatus }) {
  const style = statusStyles[status];
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '0.2rem 0.6rem',
        fontSize: '0.65rem',
        fontWeight: 500,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        borderRadius: 4,
        color: style.color,
        background: style.bg,
      }}
    >
      {style.label}
    </span>
  );
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

// ========== HOOKS ==========

function useOrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [totalLoaded, setTotalLoaded] = useState(0);
  const LIMIT = 5; // Small limit for demo purposes

  const fetchOrders = useCallback(
    async (resetOffset: boolean = true) => {
      const currentOffset = resetOffset ? 0 : offset;

      setLoading(resetOffset);
      if (!resetOffset) setLoadingMore(true);
      setError(null);

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        const newOrders = generateMockOrders(currentOffset, LIMIT);

        if (newOrders.length === 0) {
          setHasMore(false);
          if (resetOffset) {
            setOrders([]);
          }
        } else {
          if (resetOffset) {
            setOrders(newOrders);
            setOffset(LIMIT);
            setTotalLoaded(newOrders.length);
          } else {
            setOrders(prev => [...prev, ...newOrders]);
            setOffset(prev => prev + newOrders.length);
            setTotalLoaded(prev => prev + newOrders.length);
          }

          // Simulate no more data after 3 loads (15 items total)
          if (newOrders.length < LIMIT || currentOffset >= 10) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [offset]
  );

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    await fetchOrders(false);
  }, [loadingMore, hasMore, fetchOrders]);

  const retry = useCallback(() => {
    fetchOrders(true);
  }, [fetchOrders]);

  useEffect(() => {
    fetchOrders(true);
  }, []);

  return {
    orders,
    loading,
    loadingMore,
    hasMore,
    error,
    totalLoaded,
    loadMore,
    retry,
  };
}

// ========== COMPONENTS ==========

function BouncingDots() {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: 'oklch(0.556 0 0)',
          animation: 'bounce 1s ease-in-out infinite',
        }}
      />
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: 'oklch(0.556 0 0)',
          animation: 'bounce 1s ease-in-out infinite 0.2s',
        }}
      />
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: 'oklch(0.556 0 0)',
          animation: 'bounce 1s ease-in-out infinite 0.4s',
        }}
      />
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '4rem 1rem',
        color: 'oklch(0.708 0 0)',
      }}
    >
      <p style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No orders yet</p>
      <p style={{ fontSize: '0.875rem' }}>When you make a purchase, it will appear here.</p>
    </div>
  );
}

function ErrorBanner({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div
      style={{
        padding: '1rem',
        border: '1px solid oklch(0.637 0.237 25.331)',
        borderRadius: 4,
        background: 'oklch(0.956 0.067 18.472)',
        marginBottom: '1rem',
      }}
    >
      <p style={{ color: 'oklch(0.637 0.237 25.331)', marginBottom: '0.5rem' }}>{message}</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
}

function LoadMoreSection({
  loadingMore,
  hasMore,
  totalLoaded,
  onLoadMore,
}: {
  loadingMore: boolean;
  hasMore: boolean;
  totalLoaded: number;
  onLoadMore: () => void;
}) {
  return (
    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
      {loadingMore ? (
        <div style={{ padding: '1rem' }}>
          <BouncingDots />
        </div>
      ) : hasMore ? (
        <Button
          onClick={onLoadMore}
          disabled={loadingMore}
          variant="outline"
          size="lg"
          style={{
            padding: '0.75rem 2rem',
            fontSize: '0.875rem',
          }}
        >
          Load more orders
        </Button>
      ) : (
        <p style={{ fontSize: '0.75rem', color: 'oklch(0.708 0 0)' }}>
          Showing all {totalLoaded} orders
        </p>
      )}
    </div>
  );
}

// ========== MAIN PAGE ==========

export default function OrdersPage() {
  const { orders, loading, loadingMore, hasMore, error, totalLoaded, loadMore, retry } =
    useOrdersList();

  return (
    <div>
      <SectionLabel>Orders</SectionLabel>

      {error && <ErrorBanner message={error} onRetry={retry} />}

      {loading ? (
        <div style={{ padding: '3rem' }}>
          <BouncingDots />
        </div>
      ) : orders.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map(order => (
              <div
                key={order.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '1.5rem',
                  padding: '1.25rem',
                  border: '1px solid oklch(0.922 0 0)',
                  borderRadius: 4,
                  alignItems: 'start',
                  transition: 'border-color 0.15s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'oklch(0.556 0 0)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'oklch(0.922 0 0)';
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '0.5rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}
                    >
                      {order.id}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      gap: '1.5rem',
                      fontSize: '0.75rem',
                      color: 'oklch(0.708 0 0)',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span>{formatDate(order.date)}</span>
                    <span>
                      {order.items} {order.items === 1 ? 'item' : 'items'}
                    </span>
                    <span style={{ fontWeight: 500, color: 'oklch(0.145 0 0)' }}>
                      {formatCurrency(order.total)}
                    </span>
                    {order.trackingNumber && (
                      <span
                        style={{
                          color: 'oklch(0.556 0 0)',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                        }}
                      >
                        Track order
                      </span>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: 'oklch(0.556 0 0)',
                    fontSize: '0.75rem',
                  }}
                >
                  <span>View details →</span>
                </div>
              </div>
            ))}
          </div>

          <LoadMoreSection
            loadingMore={loadingMore}
            hasMore={hasMore}
            totalLoaded={totalLoaded}
            onLoadMore={loadMore}
          />
        </>
      )}
    </div>
  );
}
