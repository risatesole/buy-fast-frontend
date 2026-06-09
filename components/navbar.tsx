"use client";

import Link from "next/link";
import {
  Search,
  User,
  Heart,
  ShoppingCart,
  Menu,
  X,
  Settings,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  name: string;
  profilePicture: string;
  role: string;
};

type NavbarProps = {
  user: User | null;
};

const navLinks = [
  { href: "/new", label: "New Arrivals" },
  { href: "/books", label: "Books" },
  { href: "/notebooks", label: "Notebooks" },
  { href: "/pens", label: "Pens" },
  { href: "/bundles", label: "Bundles" },
];

type DrawerType = "cart" | "account" | null;

export function Navbar({ user }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState<DrawerType>(null);
  const [query, setQuery] = useState("");
  const router = useRouter();

  function openDrawer(drawer: DrawerType) {
    setActiveDrawer(drawer);
    setMobileOpen(false);
  }

  function closeDrawer() {
    setActiveDrawer(null);
  }

  function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;
    const trimmed = query.trim();
    if (!trimmed) return;
    setSearchOpen(false);
    setMobileOpen(false);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  async function handleLogout() {
    try {
      await fetch("/api/v1/signout/", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      closeDrawer();
      setMobileOpen(false);
      router.push("/signin");
    }
  }

  return (
    <>
      {/* ── Overlay ── */}
      {activeDrawer && (
        <div className="fixed inset-0 z-40 bg-black/30" onClick={closeDrawer} />
      )}

      {/* ── Cart drawer ── */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-80 bg-background shadow-xl flex flex-col transition-transform duration-300 ease-in-out ${
          activeDrawer === "cart" ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b px-5 py-4">
          <span className="text-sm font-medium">Your cart</span>
          <button onClick={closeDrawer} aria-label="Close cart">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Empty state — replace with real cart items */}
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
          <div className="relative">
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            <span className="absolute -top-1 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background text-xs font-medium">
              0
            </span>
          </div>
          <p className="text-sm font-medium">Your cart is empty</p>
          <button
            onClick={() => {
              closeDrawer();
              router.push("/products");
            }}
            className="w-full bg-foreground text-background text-sm font-medium py-3 rounded-sm hover:opacity-90 transition-opacity"
          >
            Continue shopping
          </button>
        </div>
      </div>

      {/* ── Account drawer ── */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-80 bg-background shadow-xl flex flex-col transition-transform duration-300 ease-in-out ${
          activeDrawer === "account" ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b px-5 py-4">
          <span className="text-sm font-medium">
            {user ? `Hi, ${user.name.split(" ")[0]}` : "My account"}
          </span>
          <button onClick={closeDrawer} aria-label="Close account menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col p-4 gap-1">
          {user ? (
            <>
              <Link
                href="/account"
                onClick={closeDrawer}
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-accent transition-colors"
              >
                <User className="h-4 w-4 text-muted-foreground" />
                My account
              </Link>
              <Link
                href="/settings"
                onClick={closeDrawer}
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-accent transition-colors"
              >
                <Settings className="h-4 w-4 text-muted-foreground" />
                Settings
              </Link>
              {user.role === "employee" && (
                <Link
                  href="/admin"
                  onClick={closeDrawer}
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-accent transition-colors"
                >
                  <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                  Admin panel
                </Link>
              )}
              <div className="my-2 border-t" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-destructive hover:bg-accent transition-colors w-full text-left"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-3 pt-2">
              <Link
                href="/signin"
                onClick={closeDrawer}
                className="w-full bg-foreground text-background text-sm font-medium py-3 text-center rounded-sm hover:opacity-90 transition-opacity"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                onClick={closeDrawer}
                className="w-full border text-sm font-medium py-3 text-center rounded-sm hover:bg-accent transition-colors"
              >
                Create account
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Navbar ── */}
      <nav className="border-b bg-background relative z-30">
        {searchOpen && (
          <div className="border-b bg-background px-4 py-3 flex items-center gap-3">
            <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <input
              autoFocus
              type="search"
              placeholder="Search products..."
              className="flex-1 bg-transparent text-sm outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
            <button onClick={() => setSearchOpen(false)}>
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        )}

        <div className="container mx-auto flex h-14 items-center px-4">
          {/* here */}
          <Link
            href="/"
            className="text-xl font-bold tracking-tight mr-6 flex-shrink-0"
          >
            BuyFast
          </Link>

          <div className="hidden md:flex items-center flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="h-14 flex items-center px-4 text-sm border-b-2 border-transparent hover:border-foreground transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-1 ml-auto">
            <button
              aria-label="Search"
              onClick={() => setSearchOpen((o) => !o)}
              className="h-9 w-9 flex items-center justify-center rounded-md hover:bg-accent transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              aria-label="Account"
              onClick={() => openDrawer("account")}
              className="h-9 w-9 flex items-center justify-center rounded-md hover:bg-accent transition-colors"
            >
              <User className="h-5 w-5" />
            </button>

            <button
              aria-label="Wishlist"
              onClick={() => router.push("/wishlist")}
              className="h-9 w-9 flex items-center justify-center rounded-md hover:bg-accent transition-colors"
            >
              <Heart className="h-5 w-5" />
            </button>

            <button
              aria-label="Cart"
              onClick={() => openDrawer("cart")}
              className="h-9 w-9 flex items-center justify-center rounded-md hover:bg-accent transition-colors relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {/* Cart count badge — wire up to real count */}
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-background text-[10px] font-medium">
                0
              </span>
            </button>

            <button
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((o) => !o)}
              className="md:hidden h-9 w-9 flex items-center justify-center rounded-md hover:bg-accent transition-colors"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="border-t md:hidden">
            <div className="container mx-auto flex flex-col py-2 px-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 text-sm font-medium rounded-md hover:bg-accent transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
