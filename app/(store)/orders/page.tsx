"use client";

import { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Eye,
  Loader2,
  RefreshCw,
} from "lucide-react";

// shadcn imports
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Import your types
import { User } from "@/types/user";
import { Product } from "@/types/products";

// ============================================================
// TYPES
// ============================================================

// Order status type - matches your backend
type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

// Order item from your backend
interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  price: number;
  subtotal: number;
}

// Main Order type matching your backend
interface Order {
  id: number;
  orderNumber: string;
  user: User;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  subtotal: number;
  tax: number;
  shippingCost: number;
  createdAt: string;
  updatedAt: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  paymentMethod: string;
  paymentStatus: "PAID" | "UNPAID" | "REFUNDED";
}

// API Response type
interface OrdersResponse {
  data: Order[];
  total: number;
  limit: number;
  offset: number;
}

// ============================================================
// API CONFIGURATION
// ============================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const API_ENDPOINTS = {
  orders: `${API_BASE_URL}/api/v1/orders`,
};

// ============================================================
// STATUS CONFIGURATION
// ============================================================

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; icon: any; color: string }
> = {
  PENDING: {
    label: "Pending",
    icon: Clock,
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  PROCESSING: {
    label: "Processing",
    icon: Package,
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  SHIPPED: {
    label: "Shipped",
    icon: Truck,
    color: "bg-purple-50 text-purple-700 border-purple-200",
  },
  DELIVERED: {
    label: "Delivered",
    icon: CheckCircle,
    color: "bg-green-50 text-green-700 border-green-200",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    color: "bg-red-50 text-red-700 border-red-200",
  },
};

const PAYMENT_STATUS_CONFIG = {
  PAID: { label: "Paid", color: "bg-green-50 text-green-700" },
  UNPAID: { label: "Unpaid", color: "bg-yellow-50 text-yellow-700" },
  REFUNDED: { label: "Refunded", color: "bg-gray-50 text-gray-700" },
};

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function OrdersPage() {
  // State
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  // Fetch orders on mount and when filters change
  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter]);

  // Fetch orders from API with filters
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams({
        limit: String(limit),
        offset: String((currentPage - 1) * limit),
      });

      if (statusFilter !== "ALL") {
        params.append("status", statusFilter);
      }

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      const response = await fetch(
        `${API_ENDPOINTS.orders}?${params.toString()}`,
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }

      const data: OrdersResponse = await response.json();
      setOrders(data.data);
      setTotalOrders(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle search with debounce
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    // Reset to first page when searching
    setCurrentPage(1);
    // Fetch with new search term
    fetchOrders();
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Get total pages for pagination
  const totalPages = Math.ceil(totalOrders / limit);

  // ============================================================
  // RENDER STATES
  // ============================================================

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
            <p className="font-medium">Error loading orders</p>
            <p className="text-sm mt-1">{error}</p>
            <Button
              variant="outline"
              className="mt-3 border-red-200 hover:bg-red-50"
              onClick={fetchOrders}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // MAIN RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* ===== HEADER ===== */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
            <p className="text-sm text-gray-500 mt-1">
              {totalOrders} order{totalOrders !== 1 ? "s" : ""} total
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchOrders}
            className="border-gray-200"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* ===== FILTERS ===== */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by order number, customer name, or email..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 border-gray-200 focus:border-gray-400"
            />
          </div>

          {/* Status Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="border-gray-200 min-w-[140px] justify-between"
              >
                {statusFilter === "ALL"
                  ? "All Status"
                  : STATUS_CONFIG[statusFilter as OrderStatus]?.label ||
                    "All Status"}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuItem onClick={() => setStatusFilter("ALL")}>
                All Status
              </DropdownMenuItem>
              {Object.entries(STATUS_CONFIG).map(([key, { label }]) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => {
                    setStatusFilter(key);
                    setCurrentPage(1);
                  }}
                >
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* ===== ORDERS TABLE ===== */}
        <Card className="border-0 shadow-none">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-100">
                  <TableHead className="text-gray-500 font-medium">
                    Order
                  </TableHead>
                  <TableHead className="text-gray-500 font-medium">
                    Customer
                  </TableHead>
                  <TableHead className="text-gray-500 font-medium">
                    Date
                  </TableHead>
                  <TableHead className="text-gray-500 font-medium">
                    Status
                  </TableHead>
                  <TableHead className="text-gray-500 font-medium">
                    Payment
                  </TableHead>
                  <TableHead className="text-right text-gray-500 font-medium">
                    Total
                  </TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  // Empty State
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-12 text-gray-500"
                    >
                      {searchTerm || statusFilter !== "ALL"
                        ? "No orders match your filters"
                        : "No orders found"}
                    </TableCell>
                  </TableRow>
                ) : (
                  // Orders List
                  orders.map((order) => {
                    const StatusIcon =
                      STATUS_CONFIG[order.status]?.icon || Package;
                    const paymentConfig =
                      PAYMENT_STATUS_CONFIG[order.paymentStatus];

                    return (
                      <TableRow
                        key={order.id}
                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                      >
                        {/* Order Number */}
                        <TableCell>
                          <div className="font-medium text-gray-900">
                            {order.orderNumber}
                          </div>
                          <div className="text-xs text-gray-400">
                            #{order.id}
                          </div>
                        </TableCell>

                        {/* Customer Info */}
                        <TableCell>
                          <div className="text-gray-900">
                            {order.user.firstname} {order.user.lastname}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.user.email}
                          </div>
                        </TableCell>

                        {/* Date */}
                        <TableCell className="text-gray-600 text-sm">
                          {formatDate(order.createdAt)}
                        </TableCell>

                        {/* Order Status */}
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${STATUS_CONFIG[order.status]?.color || ""} border-0 font-medium px-3 py-1`}
                          >
                            <StatusIcon className="h-3 w-3 mr-1.5" />
                            {STATUS_CONFIG[order.status]?.label || order.status}
                          </Badge>
                        </TableCell>

                        {/* Payment Status */}
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${paymentConfig?.color || ""} border-0 font-medium px-3 py-1`}
                          >
                            {paymentConfig?.label || order.paymentStatus}
                          </Badge>
                        </TableCell>

                        {/* Total */}
                        <TableCell className="text-right font-medium text-gray-900">
                          ${order.totalAmount.toFixed(2)}
                        </TableCell>

                        {/* View Button */}
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-gray-600"
                            onClick={() =>
                              (window.location.href = `/orders/${order.id}`)
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>

            {/* ===== PAGINATION ===== */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-4 border-t border-gray-100">
                <div className="text-sm text-gray-500">
                  Showing {(currentPage - 1) * limit + 1} to{" "}
                  {Math.min(currentPage * limit, totalOrders)} of {totalOrders}{" "}
                  orders
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="border-gray-200"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="border-gray-200"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
