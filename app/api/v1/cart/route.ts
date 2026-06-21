import { NextRequest, NextResponse } from "next/server";
import type { AddProductToCartResponse } from "@/types/cart/AddProductToCartResponse";
import type { GetCartResponse } from "@/types/cart/GetCartResponse";

const DJANGO_BASE = process.env.BACKEND_URL ?? "http://localhost:8000";

export async function GET(req: NextRequest) {
  const response = await fetch(`${DJANGO_BASE}/api/v1/cart/`, {
    headers: {
      cookie: req.headers.get("cookie") ?? "",
    },
  });

  const data: GetCartResponse = await response.json();

  return NextResponse.json(data, { status: response.status });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const response = await fetch(`${DJANGO_BASE}/api/v1/cart/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie: req.headers.get("cookie") ?? "",
    },
    body: JSON.stringify(body),
  });

  const data: AddProductToCartResponse = await response.json();

  return NextResponse.json(data, { status: response.status });
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();

  const response = await fetch(`http://localhost:8000/api/v1/cart/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      cookie: req.headers.get("cookie") ?? "",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}
