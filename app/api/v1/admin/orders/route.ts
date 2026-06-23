// app/api/v1/admin/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
  try {
    // Get the query parameters from the incoming request
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    
    // Build the backend URL
    const backendUrl = `${BACKEND_URL}/api/v1/admin/orders${queryString ? `?${queryString}` : ''}`;
    
    // Get cookies from the incoming request
    const cookieHeader = request.headers.get('cookie') || '';
    
    // Forward the request to the backend
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
        // Forward other relevant headers if needed
        ...(request.headers.get('authorization') && {
          'Authorization': request.headers.get('authorization') || '',
        }),
      },
      cache: 'no-store',
    });
    
    // Get the response data
    const data = await response.json();
    
    // Create a new response with the same status
    const nextResponse = NextResponse.json(data, {
      status: response.status,
      statusText: response.statusText,
    });
    
    // Forward cookies from the backend response to the client
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      // Forward all cookies from the backend
      nextResponse.headers.set('Set-Cookie', setCookieHeader);
    }
    
    // Forward other headers if needed (like CORS, etc.)
    // You can forward specific headers like:
    // nextResponse.headers.set('Access-Control-Allow-Origin', '*');
    
    return nextResponse;
    
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders from backend' },
      { status: 500 }
    );
  }
}

// Optional: Add OPTIONS method for CORS if needed
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie',
    },
  });
}
