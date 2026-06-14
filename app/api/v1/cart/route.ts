import { NextRequest, NextResponse } from "next/server";
import type { AddProductToCartResponse } from "@/types/cart/AddProductToCartResponse";

const DJANGO_BASE = process.env.BACKEND_URL ?? "http://localhost:8000";

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