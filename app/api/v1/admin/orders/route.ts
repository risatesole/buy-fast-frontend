import { NextRequest, NextResponse } from 'next/server';

// ============================================================================
// TIPOS
// ============================================================================

type OrderStatus = 'fullfilled' | 'pending' | 'returned';

type Order = {
  id: string;
  profilepicture: string;
  firstname: string;
  lastname: string;
  email: string;
  created_at: string;
  total: number;
  status: OrderStatus;
  pickup_time: string | null;
};

const MOCK_DB: Order[] = Array.from({ length: 34 }).map((_, i) => ({
  id: `ORD-${1000 + i}`,
  profilepicture: `https://i.pravatar.cc/150?u=${i}`,
  firstname: ['Miguel', 'Ana', 'Carlos', 'Wanda', 'Iker', 'Luis', 'María', 'José'][i % 8],
  lastname: ['Méndez', 'Pérez', 'Gómez', 'Rodríguez', 'López', 'Díaz', 'Martínez', 'García'][
    i % 8
  ],
  email: `usuario${i}@uasd.edu.do`,
  created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  total: Math.floor(Math.random() * 15000) + 500,
  status: ['fullfilled', 'pending', 'returned'][i % 3] as OrderStatus,
  pickup_time: i % 4 === 0 ? null : new Date(Date.now() + Math.random() * 86400000).toISOString(),
}));

const DEFAULT_LIMIT = 5;
const ARTIFICIAL_LATENCY_MS = 450;

// ============================================================================
// GET /api/v1/admin/orders?search=&page=&limit=
// ============================================================================

export async function GET(request: NextRequest) {
  // Simula latencia de red/DB, igual que el mock original.
  await new Promise(resolve => setTimeout(resolve, ARTIFICIAL_LATENCY_MS));

  const { searchParams } = new URL(request.url);

  const search = (searchParams.get('search') ?? '').trim().toLowerCase();
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const limit = Math.max(1, Number(searchParams.get('limit')) || DEFAULT_LIMIT);

  const filtered = MOCK_DB.filter(
    o =>
      o.firstname.toLowerCase().includes(search) ||
      o.lastname.toLowerCase().includes(search) ||
      o.id.toLowerCase().includes(search)
  );

  const startIndex = (page - 1) * limit;
  const data = filtered.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    data,
    total: filtered.length,
  });
}
