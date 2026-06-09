import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

import { cookies } from "next/headers";

import { NavbarWithCart } from "@/components/navbar-with-cart";
import { Footer } from "@/components/Footer";
import type { CartItem } from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UASD | Buyfast",
  description: "The easy way to buy in the UASD",
};

type MeResponse = {
  status: string;
  message?: string;
  data: {
    user: {
      id: number;
      firstname: string;
      lastname: string;
      email: string;
      role: string;
      profilepicture: string | null;
      is_authenticated: boolean;
    } | null;
  };
};

async function getUserDetails(): Promise<MeResponse | null> {
  try {
    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) return null;

    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const res = await fetch(`${backendUrl}/api/v1/me`, {
      headers: { Cookie: cookieHeader },
      cache: "no-store",
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userData = await getUserDetails();

  const rawUser = userData?.data?.user;
  const user = rawUser?.is_authenticated ? rawUser : null;

  const mockCartItems: CartItem[] = [
    { id: 1, name: "Leuchtturm1917 Notebook A5", price: 24.5, quantity: 2, image: "https://example.com/image.jpg" },
    { id: 2, name: "Pilot G2 Pen Set", price: 12.99, quantity: 1 },

  ];

  return (
    <div
      style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <NavbarWithCart
        user={
          user
            ? {
                name: `${user.firstname} ${user.lastname}`,
                profilePicture: user.profilepicture ?? "",
                role: user.role ?? "",
              }
            : null
        }
        initialCartItems={mockCartItems}
      />
      {children}
      <Footer />
    </div>
  );
}