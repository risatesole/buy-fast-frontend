"use client";

import Link from "next/link";

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

import { Menu, Search } from "lucide-react";

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
                  <Link
                    href="/contact"
                    className="px-4 py-2 text-sm font-medium"
                  >
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

          {/* Auth buttons */}
          <div className="flex items-center gap-2">
            <Button variant="ghost">Sign In</Button>

            <Button>Sign Up</Button>
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden">
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
