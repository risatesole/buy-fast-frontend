import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

import { cookies } from "next/headers";

import { Navbar } from "@/components/navbar";

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
  } catch (err) {
    return null;
  }
}
export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getUserDetails();

  const user = data?.data?.user;

  return (
    <main className={`${geistSans.variable} ${geistMono.variable}`}>
      <Navbar
        user={
          user
            ? {
                name: `${user.firstname} ${user.lastname}`,
                profilePicture: user.profilepicture ?? "",
              }
            : null
        }
      />
      {children}
    </main>
  );
}