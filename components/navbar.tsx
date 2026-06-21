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

// ── Types ──────────────────────────────────────────────────────

type User = {
  name: string;
  profilePicture: string;
  role: string;
};

export type NavbarCartItem = {
  id: number | string;
  productId: number; 
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: string; // e.g. "Midnight / Small"
};

type NavbarProps = {
  user: User | null;
  cartItems?: NavbarCartItem[];
  onRemoveCartItem?: (id: NavbarCartItem["id"]) => void;
  onUpdateCartItemQuantity?: (id: NavbarCartItem["id"], quantity: number) => void;
  onCheckout?: () => void;
};

// ── Helpers ────────────────────────────────────────────────────

const navLinks = [
  { href: "/new", label: "New Arrivals" },
  { href: "/books", label: "Books" },
  { href: "/notebooks", label: "Notebooks" },
  { href: "/pens", label: "Pens" },
  { href: "/bundles", label: "Bundles" },
];

type DrawerType = "cart" | "account" | null;

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

function NavbarLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 41"
      width="32"
      height="32"
    >
      <g transform="translate(0, 0.5)">
        <path
          d="M40 13.4683C40.0001 10.7823 39.1891 8.1589 37.673 5.9417C36.1569 3.72451 34.0065 2.01688 31.5035 1.04252C29.0005 0.0681476 26.2615 -0.127534 23.6455 0.48109C21.0293 1.08971 18.658 2.47428 16.8421 4.45341H0V40H35.5601V23.3873C36.9557 22.139 38.0726 20.6104 38.8377 18.9012C39.6027 17.192 39.9988 15.3409 40 13.4683ZM33.1579 13.4683C33.1606 14.7553 32.7814 16.0143 32.0683 17.0858C31.3551 18.1572 30.3402 18.9931 29.1518 19.4874C27.9634 19.9819 26.6552 20.1127 25.3924 19.8631C24.1298 19.6137 22.9695 18.9953 22.0584 18.0861C21.1474 17.1769 20.5266 16.0179 20.2745 14.7557C20.0224 13.4936 20.1505 12.185 20.6424 10.9957C21.1343 9.80626 21.968 8.78957 23.0379 8.07423C24.108 7.35888 25.3661 6.97705 26.6532 6.97703C28.376 6.97703 30.0285 7.6605 31.2479 8.87745C32.4675 10.0944 33.1544 11.7455 33.1579 13.4683ZM28.7179 33.1579H6.84211V11.2955H13.5088C13.38 12.0128 13.3123 12.7397 13.3063 13.4683C13.31 17.007 14.7173 20.3997 17.2196 22.902C19.7217 25.4042 23.1144 26.8116 26.6532 26.8151C27.3451 26.8115 28.0355 26.7528 28.7179 26.6397V33.1579Z"
          fill="#394149"
        />
      </g>
    </svg>
  );
}
// ── Component ─────────────────────────────────────────────────

export function Navbar({
  user,
  cartItems = [],
  onRemoveCartItem,
  onUpdateCartItemQuantity,
  onCheckout,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState<DrawerType>(null);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const hasItems = totalItems > 0;

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
        className={`fixed top-0 right-0 z-50 h-full w-96 bg-background flex flex-col transition-transform duration-300 ease-in-out border-l ${
          activeDrawer === "cart" ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-5">
          <span className="text-base font-semibold">Cart</span>
          {hasItems && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background text-xs font-medium">
              {totalItems}
            </span>
          )}
          <button
            onClick={closeDrawer}
            aria-label="Close cart"
            className="ml-auto"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {hasItems ? (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 divide-y">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 py-5">
                  {/* Thumbnail */}
                  <div className="h-20 w-20 flex-shrink-0 bg-accent overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                    <p className="text-sm font-semibold leading-snug">
                      {item.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {fmt(item.price)} USD
                    </p>
                    {item.variant && (
                      <p className="text-xs text-muted-foreground">
                        {item.variant}
                      </p>
                    )}
                  </div>

                  {/* Quantity + Remove */}
                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val) && val > 0) {
                          onUpdateCartItemQuantity?.(item.id, val);
                        }
                      }}
                      className="w-10 border text-center text-sm py-1 bg-transparent outline-none focus:border-foreground transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      onClick={() => onRemoveCartItem?.(item.id)}
                      className="text-xs text-muted-foreground underline hover:text-foreground transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t px-6 py-5 flex flex-col gap-4">
              {/* Discount code */}
              <input
                type="text"
                placeholder="Discount code"
                className="w-full border px-4 py-2.5 text-sm bg-transparent outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground"
              />

              {/* Total */}
              <div>
                <div className="flex justify-between items-baseline">
                  <span className="text-base font-semibold">Total</span>
                  <span className="text-base font-semibold">
                    {fmt(totalPrice)} USD
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Taxes and{" "}
                  <span className="underline cursor-pointer">shipping</span>{" "}
                  calculated at checkout
                </p>
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    closeDrawer();
                    router.push("/cart");
                  }}
                  className="bg-foreground text-background text-sm font-medium py-3 hover:opacity-90 transition-opacity"
                >
                  View cart
                </button>
                <button
                  onClick={() => {
                    onCheckout?.();
                    router.push("/checkout");
                  }}
                  className="bg-foreground text-background text-sm font-medium py-3 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Checkout
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            <p className="text-sm font-medium">Your cart is empty</p>
            <button
              onClick={() => {
                closeDrawer();
                router.push("/products");
              }}
              className="w-full bg-foreground text-background text-sm font-medium py-3 hover:opacity-90 transition-opacity"
            >
              Continue shopping
            </button>
          </div>
        )}
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
          <Link
            href="/"
            className="text-xl font-bold tracking-tight mr-6 flex-shrink-0"
          >
            <NavbarLogo />
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

            {/* Cart icon — red dot when items present, count badge when empty */}
            <button
              aria-label="Cart"
              onClick={() => openDrawer("cart")}
              className="h-9 w-9 flex items-center justify-center rounded-md hover:bg-accent transition-colors relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {hasItems ? (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
              ) : (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-background text-[10px] font-medium">
                  0
                </span>
              )}
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
