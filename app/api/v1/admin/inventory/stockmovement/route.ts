import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") ?? "1";

    const upstreamUrl = `${process.env.BACKEND_URL}/api/v1/inventory/stockmovement?page=${page}`;

    const response = await fetch(upstreamUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // forward auth if needed
        // Authorization: req.headers.get("authorization") ?? "",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          status: "error",
          message: "Unable to fetch stock movement",
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, {
      status: 200,
    });
  } catch {
    return NextResponse.json(
      {
        status: "error",
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
