import { NextRequest } from "next/server";

const DJANGO_BASE = process.env.BACKEND_URL ?? "http://localhost:8000";

export async function GET(req: NextRequest) {
  const response = await fetch(`${DJANGO_BASE}/api/v1/checkout/`, {
    method: req.method,
    headers: req.headers,
  });
  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });
}

export async function POST(req: NextRequest) {
  const response = await fetch(`${DJANGO_BASE}/api/v1/checkout/`, {
    method: "POST",
    headers: req.headers,
    body: req.body,
    duplex: "half",
  } as RequestInit);
  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });
}
