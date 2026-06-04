"use client";

import Link from "next/link";
import { Search, Menu, X, ShoppingCart, Settings, LogOut } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type User = {
  name: string;
  profilePicture: string;
};

type NavbarProps = {
  user: User | null;
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar({ user }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;
    const trimmed = query.trim();
    if (!trimmed) return;
    setMobileOpen(false);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  function handleLogout() {
    console.log("User logged out");
    setMobileOpen(false);
  }

  return (
    <nav className="border-b bg-background">
      {/* Main bar */}
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          BuyFast
        </Link>

        {/* Desktop layout */}
        <div className="hidden md:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList>
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={link.href}
                      className="px-4 py-2 text-sm font-medium"
                    >
                      {link.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="overflow-hidden rounded-full transition-opacity hover:opacity-80">
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="h-10 w-10 object-cover"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/cart">Shopping Cart</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/signin">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile: search icon + hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="rounded-md p-2 text-foreground transition-colors hover:bg-accent"
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
          <div className="container mx-auto flex flex-col gap-1 px-4 py-4">
            {/* Search */}
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-9 w-full"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>

            {/* Nav links */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
              >
                {link.label}
              </Link>
            ))}

            <div className="my-2 border-t" />

            {/* User section */}
            {user ? (
              <>
                {/* User identity */}
                <div className="flex items-center gap-3 px-3 py-2">
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium">{user.name}</span>
                </div>

                <Link
                  href="/settings"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
                >
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  Settings
                </Link>

                <Link
                  href="/cart"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
                >
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  Shopping Cart
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-accent w-full text-left"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link href="/signin" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
