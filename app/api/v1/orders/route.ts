import { NextRequest, NextResponse } from 'next/server';

type OrderStatus = 'delivered' | 'shipped' | 'processing' | 'cancelled';

type Order = {
  id: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: number;
  trackingNumber?: string;
};

type PaginatedResponse = {
  orders: Order[];
  totalPages: number;
  currentPage: number;
};

const TOTAL_ORDERS = 2000;
const LIMIT = 5;
const TOTAL_PAGES = Math.ceil(TOTAL_ORDERS / LIMIT);

async function generateMockOrders(page: number): Promise<PaginatedResponse> {
  const statuses: OrderStatus[] = ['delivered', 'shipped', 'processing', 'cancelled'];
  const mockOrders: Order[] = [];
  const offset = (page - 1) * LIMIT;

  for (let i = 0; i < LIMIT; i++) {
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

  return {
    orders: mockOrders,
    totalPages: TOTAL_PAGES,
    currentPage: page,
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const pageParam = searchParams.get('page');
    const page = pageParam ? parseInt(pageParam, 10) : 1;

    if (isNaN(page) || page < 1 || page > TOTAL_PAGES) {
      return NextResponse.json({ error: 'Invalid page parameter' }, { status: 400 });
    }

    const data = await generateMockOrders(page);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
