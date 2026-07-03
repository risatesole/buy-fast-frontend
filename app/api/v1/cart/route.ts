import { NextRequest, NextResponse } from 'next/server';
import type { AddProductToCartResponse } from '@/features/cart/types/AddProductToCartResponse';
import type { GetCartResponse } from '@/features/cart/types/GetCartResponse';

const DJANGO_BASE = process.env.BACKEND_URL ?? 'http://localhost:8000';

export async function GET(req: NextRequest) {
  const response = await fetch(`${DJANGO_BASE}/api/v1/cart/`, {
    headers: {
      cookie: req.headers.get('cookie') ?? '',
    },
  });

  const data: GetCartResponse = await response.json();

  return NextResponse.json(data, { status: response.status });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const response = await fetch(`${DJANGO_BASE}/api/v1/cart/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      cookie: req.headers.get('cookie') ?? '',
    },
    body: JSON.stringify(body),
  });

  const data: AddProductToCartResponse = await response.json();

  return NextResponse.json(data, { status: response.status });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    const { product_id, quantity } = body;

    if (!product_id) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'product_id is required',
          data: null,
        },
        { status: 400 }
      );
    }

    if (quantity === undefined || quantity === null) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'quantity is required',
          data: null,
        },
        { status: 400 }
      );
    }

    if (typeof quantity !== 'number' || !Number.isInteger(quantity)) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'quantity must be a valid integer',
          data: null,
        },
        { status: 400 }
      );
    }

    if (quantity < 1) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'quantity must be greater than 0',
          data: null,
        },
        { status: 400 }
      );
    }

    const url = `${DJANGO_BASE}/api/v1/cart/`;
    console.log('PATCH request to:', url);
    console.log('PATCH body:', { product_id, quantity });

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        cookie: req.headers.get('cookie') ?? '',
      },
      body: JSON.stringify({ product_id, quantity }),
    });

    // Log response status for debugging
    console.log('PATCH response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('PATCH error response:', errorText);
      return NextResponse.json(
        {
          status: 'error',
          message: `Django returned ${response.status}: ${errorText}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('PATCH cart error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to update cart item' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();

  const response = await fetch(`${DJANGO_BASE}/api/v1/cart/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      cookie: req.headers.get('cookie') ?? '',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}
