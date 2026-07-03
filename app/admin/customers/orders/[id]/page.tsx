// app/admin/orders/[id]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  Undo2,
  User,
  Mail,
  Calendar,
  DollarSign,
  Package,
  Truck,
  MapPin,
  Phone,
  AlertCircle,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

// ============================================================
// TYPES
// ============================================================

type OrderStatus = 'fullfilled' | 'pending' | 'returned';

type OrderItem = {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  image_url?: string;
  sku?: string;
};

type Address = {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

type Order = {
  id: string | number;
  profilepicture: string;
  firstname: string;
  lastname: string;
  email: string;
  created_at: string;
  total: number;
  status: OrderStatus;
  pickup_time: string;
  phone?: string;
  address?: Address;
  items?: OrderItem[];
  shipping_method?: string;
  payment_method?: string;
  notes?: string;
};

// ============================================================
// CONSTANTS
// ============================================================

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    icon: Clock,
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  fullfilled: {
    label: 'Fulfilled',
    icon: CheckCircle2,
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  returned: {
    label: 'Returned',
    icon: Undo2,
    className: 'bg-red-100 text-red-800 border-red-200',
  },
} as const;

// ============================================================
// API SERVICE
// ============================================================

/**
 * Fetches a single order by ID from the backend API
 */
async function fetchOrderById(id: string | number): Promise<Order | null> {
  if (!BACKEND_URL) {
    console.error('NEXT_PUBLIC_API_URL is not set');
    return null;
  }

  const url = `${BACKEND_URL}/api/v1/customers/orders/${id}`;

  try {
    const response = await fetch(url, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      console.error('API Error:', response.status, response.statusText);
      return null;
    }

    const json = await response.json();
    return json.data ?? null;
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
}

// ============================================================
// CUSTOM HOOK
// ============================================================

/**
 * Hook that manages order details data fetching and state
 */
function useOrderDetails() {
  const params = useParams();
  const router = useRouter();

  // Safely extract the ID from params
  const orderId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrder() {
      if (!orderId) {
        setError('Order not found');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchOrderById(orderId);

        if (data) {
          setOrder(data);
        } else {
          setError('Order not found');
        }
      } catch (err) {
        console.error('Error loading order:', err);
        setError('Order not found');
      } finally {
        setIsLoading(false);
      }
    }

    loadOrder();
  }, [orderId]);

  const goBack = () => router.back();

  return {
    order,
    isLoading,
    error,
    goBack,
    orderId,
  };
}

// ============================================================
// UI COMPONENTS
// ============================================================

/**
 * Displays an order status with appropriate icon and colors
 */
function StatusBadge({ status }: { status: OrderStatus }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${config.className}`}
    >
      <Icon className="w-4 h-4" />
      {config.label}
    </Badge>
  );
}

/**
 * Loading skeleton for the order details page
 */
function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-48" />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Displays customer information including profile, contact, and address
 */
function CustomerInfoCard({ order }: { order: Order }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="w-5 h-5" />
          Customer Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Profile */}
        <div className="flex items-center gap-4">
          <img
            src={order.profilepicture}
            alt={`${order.firstname} ${order.lastname}`}
            width={48}
            height={48}
            className="rounded-full object-cover"
          />
          <div>
            <p className="font-medium">
              {order.firstname} {order.lastname}
            </p>
            <p className="text-sm text-gray-500">Customer ID: #{order.id}</p>
          </div>
        </div>

        {/* Contact details */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-gray-400" />
            <span>{order.email}</span>
          </div>

          {order.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-gray-400" />
              <span>{order.phone}</span>
            </div>
          )}

          {order.address && (
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p>{order.address.street}</p>
                <p>
                  {order.address.city}, {order.address.state} {order.address.zipCode}
                </p>
                <p>{order.address.country}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Displays order summary with totals and key information
 */
function OrderSummaryCard({ order }: { order: Order }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Package className="w-5 h-5" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-500">Order ID</span>
          <span className="font-mono text-sm">#{order.id}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Status</span>
          <StatusBadge status={order.status} />
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Order Date</span>
          <span>{formatDate(order.created_at)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Pickup Time</span>
          <span>{order.pickup_time ? formatDate(order.pickup_time) : '—'}</span>
        </div>

        <Separator />

        <div className="flex justify-between items-center">
          <span className="font-medium">Total Amount</span>
          <span className="text-2xl font-bold">{formatCurrency(order.total)}</span>
        </div>

        {order.payment_method && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Payment Method</span>
            <span className="capitalize">{order.payment_method.replace(/_/g, ' ')}</span>
          </div>
        )}

        {order.shipping_method && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Shipping Method</span>
            <span className="capitalize">{order.shipping_method.replace(/_/g, ' ')}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Displays order timeline with status progression
 */
function OrderTimelineCard({ order }: { order: Order }) {
  const timelineSteps = [
    {
      label: 'Order Placed',
      date: order.created_at,
      status: 'completed' as const,
    },
    {
      label: 'Order Processing',
      date:
        order.status === 'pending'
          ? 'In progress'
          : order.status === 'fullfilled'
            ? 'Completed'
            : 'Not started',
      status:
        order.status === 'pending'
          ? ('in-progress' as const)
          : order.status === 'fullfilled'
            ? ('completed' as const)
            : ('pending' as const),
    },
    {
      label: order.status === 'returned' ? 'Order Returned' : 'Order Fulfilled',
      date:
        order.status === 'fullfilled'
          ? 'Ready for pickup'
          : order.status === 'returned'
            ? 'Return processed'
            : 'Pending',
      status:
        order.status === 'fullfilled'
          ? ('completed' as const)
          : order.status === 'returned'
            ? ('error' as const)
            : ('pending' as const),
    },
  ];

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 ring-green-100';
      case 'in-progress':
        return 'bg-yellow-500 ring-yellow-100';
      case 'error':
        return 'bg-red-500 ring-red-100';
      default:
        return 'bg-gray-300 ring-gray-100';
    }
  };

  const getTextColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-700';
      case 'in-progress':
        return 'text-yellow-700';
      case 'error':
        return 'text-red-700';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="w-5 h-5" />
          Order Timeline
        </CardTitle>
        <CardDescription>Track your order progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timelineSteps.map((step, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="relative">
                <div
                  className={`w-3 h-3 mt-1.5 rounded-full ring-4 ${getStepColor(step.status)}`}
                />
                {index < timelineSteps.length - 1 && (
                  <div className="absolute top-5 left-1.5 w-0.5 h-12 bg-gray-200" />
                )}
              </div>
              <div>
                <p className={`font-medium ${getTextColor(step.status)}`}>{step.label}</p>
                <p className="text-sm text-gray-500">{step.date}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Displays stats cards for the order
 */
function OrderStatsCards({ order }: { order: Order }) {
  const stats = [
    {
      label: 'Total Items',
      value: order.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0,
      icon: Package,
    },
    {
      label: 'Order Total',
      value: formatCurrency(order.total),
      icon: DollarSign,
    },
    {
      label: 'Status',
      value: STATUS_CONFIG[order.status]?.label ?? order.status,
      icon: STATUS_CONFIG[order.status]?.icon ?? Clock,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

/**
 * Displays a list of items in the order
 */
function OrderItemsTable({ items = [] }: { items: OrderItem[] }) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!items.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Package className="w-5 h-5" />
            Order Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">No items found for this order</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Package className="w-5 h-5" />
          Order Items ({items.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Items list */}
        <div className="space-y-4">
          {items.map(item => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              {/* Product image */}
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.product_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="w-8 h-8 text-gray-400" />
                )}
              </div>

              {/* Product details */}
              <div className="flex-1">
                <p className="font-medium">{item.product_name}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  {item.sku && <span>SKU: {item.sku}</span>}
                  <span>Qty: {item.quantity}</span>
                  <span>Price: {formatCurrency(item.price)}</span>
                </div>
              </div>

              {/* Subtotal */}
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                <p className="text-xs text-gray-500">Subtotal</p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Total Items</span>
            <span className="font-medium">{totalItems} items</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-500">Total Amount</span>
            <span className="text-xl font-bold">{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Displays a simple "Order not found" message
 */
function OrderNotFound({ onBack }: { onBack: () => void }) {
  return (
    <div className="container mx-auto px-4 py-10">
      <p>Order not found</p>
    </div>
  );
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Formats a date string to a readable format
 */
function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return dateString;
  }
}

/**
 * Formats a number to USD currency
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

// ============================================================
// MAIN PAGE COMPONENT
// ============================================================

export default function OrderDetailsPage() {
  const { order, isLoading, error, goBack } = useOrderDetails();

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <LoadingSkeleton />
      </div>
    );
  }

  // Show simple "Order not found" error state
  if (error || !order) {
    return <OrderNotFound onBack={goBack} />;
  }

  // Main content
  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order #{order.id}</h1>
          <p className="text-gray-500 mt-1">View detailed order information</p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={goBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button variant="default">
            <Truck className="w-4 h-4 mr-2" />
            Update Status
          </Button>
        </div>
      </div>

      {/* Stats */}
      <OrderStatsCards order={order} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Items */}
        <div className="lg:col-span-2 space-y-6">
          <OrderItemsTable items={order.items ?? []} />
        </div>

        {/* Right Column - Info Cards */}
        <div className="space-y-6">
          <CustomerInfoCard order={order} />
          <OrderSummaryCard order={order} />
          <OrderTimelineCard order={order} />
        </div>
      </div>
    </div>
  );
}
