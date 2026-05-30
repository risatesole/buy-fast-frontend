"use client";

import Link from "next/link";
import { useState } from "react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { Menu, Search } from "lucide-react";

// --- Mock cart products ---
const mockCartItems = [
  {
    id: 1,
    name: "Auriculares Bluetooth Pro",
    price: 89.99,
    quantity: 1,
    image: "https://placehold.co/64x64?text=🎧",
  },
  {
    id: 2,
    name: "Teclado Mecánico RGB",
    price: 124.5,
    quantity: 2,
    image: "https://placehold.co/64x64?text=⌨️",
  },
  {
    id: 3,
    name: "Mouse Inalámbrico Ergonómico",
    price: 45.0,
    quantity: 1,
    image: "https://placehold.co/64x64?text=🖱️",
  },
  {
    id: 4,
    name: "Webcam Full HD 1080p",
    price: 67.99,
    quantity: 1,
    image: "https://placehold.co/64x64?text=📷",
  },
];

// --- Cart Icon SVG ---
function CartIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className ?? "size-6"}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
      />
    </svg>
  );
}

// --- Cart Sidebar ---
function CartSidebar() {
  const [cartItems, setCartItems] = useState(mockCartItems);
  const [open, setOpen] = useState(false);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  function removeItem(id: number) {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <CartIcon className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px]">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="flex w-[340px] flex-col px-6 sm:w-[400px]">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center gap-2 text-lg font-semibold">
            <CartIcon className="h-5 w-5" />
            Carrito de Compras
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            {totalItems} {totalItems === 1 ? "producto" : "productos"} en tu carrito
          </SheetDescription>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto py-4">
          {cartItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-muted-foreground">
              <CartIcon className="h-12 w-12 opacity-30" />
              <p className="text-sm">Tu carrito está vacío</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {cartItems.map((item) => (
                <li key={item.id} className="flex items-start gap-3">
                  {/* Product image */}
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted text-2xl">
                    <span>{decodeURIComponent(item.image.split("text=")[1])}</span>
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col gap-1">
                    <span className="text-sm font-medium leading-tight">{item.name}</span>
                    <span className="text-sm font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    {item.quantity > 1 && (
                      <span className="text-xs text-muted-foreground">
                        Cant: {item.quantity}
                      </span>
                    )}
                  </div>

                  {/* Remove button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground hover:text-destructive"
                    onClick={() => removeItem(item.id)}
                  >
                    Eliminar
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t pt-4">
            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">${totalPrice.toFixed(2)}</span>
            </div>

            <Separator className="mb-4" />

            <div className="flex flex-col gap-2">
              <Button className="w-full" onClick={() => setOpen(false)}>
                Proceder al Pago
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                Seguir Comprando
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

// --- Navbar ---
export function Navbar() {
  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          BuyFast
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-6 md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/" className="px-4 py-2 text-sm font-medium">
                    Home
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/about" className="px-4 py-2 text-sm font-medium">
                    About
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/contact" className="px-4 py-2 text-sm font-medium">
                    Contact
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Search */}
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar productos"
              className="pl-9"
            />
          </div>

          {/* Cart + Auth */}
          <div className="flex items-center gap-2">
            <CartSidebar />
            <Button variant="ghost">Sign In</Button>
            <Button>Sign Up</Button>
          </div>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-1 md:hidden">
          <CartSidebar />

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[280px] px-6">
              <SheetHeader className="border-b pb-4">
                <SheetTitle className="text-left text-lg font-semibold">
                  BuyFast
                </SheetTitle>
                <SheetDescription className="text-left text-xs">
                  Universidad Autonoma de Santo Domingo
                </SheetDescription>
              </SheetHeader>

              {/* Mobile Search */}
              <div className="relative mt-6">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar productos"
                  className="pl-9"
                />
              </div>

              {/* Links */}
              <div className="mt-6 flex flex-col gap-1">
                <Link
                  href="/"
                  className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
                >
                  Contact
                </Link>
              </div>

              {/* Auth buttons */}
              <div className="mt-8 flex flex-col gap-3">
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
                <Button className="w-full">Sign Up</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}