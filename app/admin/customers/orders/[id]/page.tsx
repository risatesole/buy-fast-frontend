// app/admin/customers/orders/[id]/page.tsx
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Image from 'next/image';

interface ProductImage {
  id: number;
  url: string;
  type: string;
  alt_text: string;
  order: number;
}

interface Product {
  id: number;
  name: string;
  variant_id: number;
  variant_name: string;
  sku: string;
  selling_price: number;
  tax_rate: number;
  images: ProductImage[];
}

interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  price_per_item: number;
  tax_amount: number;
  subtotal: number;
}

interface OrderData {
  id: number;
  customer_email: string;
  status: string;
  pickup_time: string;
  created_at: string;
  items: OrderItem[];
  total_items: number;
}

interface OrderResponse {
  status: string;
  data: OrderData;
}

async function getOrderDetails(orderId: string): Promise<OrderData | null> {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    const cookieString = allCookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    const response = await fetch(`${apiUrl}/api/v1/admin/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieString && { Cookie: cookieString }),
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`Failed to fetch order: ${response.status} ${response.statusText}`);
      return null;
    }

    const data: OrderResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching order details:', error);
    return null;
  }
}

function getStatusBadgeColor(status: string): string {
  const statusMap: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
  };
  return statusMap[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Invalid date';
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default async function AdminOrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await getOrderDetails(id);

  if (!order) {
    notFound();
  }

  const totalOrderAmount = order.items.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
            <p className="text-gray-600 mt-1">Order #{order.id}</p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(
                order.status
              )}`}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Order Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Customer</h3>
            <p className="text-lg font-semibold text-gray-900 break-all">{order.customer_email}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Order Date</h3>
            <p className="text-lg font-semibold text-gray-900">{formatDate(order.created_at)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Pickup Time</h3>
            <p className="text-lg font-semibold text-gray-900">
              {order.pickup_time ? formatDate(order.pickup_time) : 'Not set'}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Order Items ({order.total_items} items)
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tax
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {order.items.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {item.product.images && item.product.images.length > 0 && (
                          <div className="relative w-12 h-12 flex-shrink-0">
                            <Image
                              src={item.product.images[0].url}
                              alt={item.product.images[0].alt_text || item.product.name}
                              fill
                              className="object-cover rounded"
                              sizes="48px"
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{item.product.name}</p>
                          <p className="text-sm text-gray-500">{item.product.variant_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.product.sku}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatCurrency(item.price_per_item)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.quantity}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatCurrency(item.tax_amount)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {formatCurrency(item.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-right font-medium text-gray-900">
                    Total
                  </td>
                  <td className="px-6 py-4 text-lg font-bold text-gray-900">
                    {formatCurrency(totalOrderAmount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Product Images Gallery - Grouped by Product */}
        {order.items.some(item => item.product.images && item.product.images.length > 0) && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h3>
            <div className="space-y-6">
              {order.items.map(item => {
                if (!item.product.images || item.product.images.length === 0) {
                  return null;
                }
                return (
                  <div
                    key={item.id}
                    className="border-b border-gray-200 last:border-0 pb-4 last:pb-0"
                  >
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <span>{item.product.name}</span>
                      <span className="text-sm font-normal text-gray-500">
                        ({item.product.variant_name})
                      </span>
                      <span className="text-sm font-normal text-gray-400">× {item.quantity}</span>
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {item.product.images.map(image => (
                        <div key={image.id} className="relative aspect-square">
                          <Image
                            src={image.url}
                            alt={image.alt_text || item.product.name}
                            fill
                            className="object-cover rounded-lg hover:scale-105 transition-transform duration-200"
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                          />
                          {image.type && (
                            <div className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                              {image.type.toLowerCase()}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
