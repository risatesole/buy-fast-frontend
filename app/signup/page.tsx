"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Sign up submitted:", formData);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      {/* Decorative background grid */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="w-full max-w-sm relative">
        {/* Accent line */}
        <div className="absolute -top-px left-8 right-8 h-px bg-foreground/20" />

        <Card className="border border-border shadow-xl shadow-foreground/5 rounded-2xl overflow-hidden">
          <CardHeader className="pb-0 pt-8 px-8">
            {/* Logo mark */}
            <div className="mb-6 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-foreground flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-sm bg-background" />
              </div>
              <span
                className="text-sm font-semibold tracking-tight text-foreground"
                style={{ fontFamily: "var(--font-geist-mono)" }}
              >
                acme
              </span>
            </div>

            <h1
              className="text-2xl font-semibold tracking-tight text-foreground leading-tight"
            >
              Create an account
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Start your journey today. No credit card required.
            </p>
          </CardHeader>

          <CardContent className="px-8 pt-7 pb-8 space-y-5">
            {/* Name field */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-medium text-foreground/70 uppercase tracking-widest">
                First Name
              </Label>
              <Input
                id="firstname"
                type="text"
                placeholder="Jane"
                value={formData.firstname}
                onChange={handleChange}
                className="h-10 text-sm bg-muted/40 border-border/60 focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-foreground/30 transition-colors placeholder:text-muted-foreground/50"
              />
            </div>


            {/* lastname field */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-medium text-foreground/70 uppercase tracking-widest">
                Last Name
              </Label>
              <Input
                id="lastname"
                type="text"
                placeholder="Smith"
                value={formData.lastname}
                onChange={handleChange}
                className="h-10 text-sm bg-muted/40 border-border/60 focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-foreground/30 transition-colors placeholder:text-muted-foreground/50"
              />
            </div>


            {/* Email field */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium text-foreground/70 uppercase tracking-widest">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="jane@example.com"
                value={formData.email}
                onChange={handleChange}
                className="h-10 text-sm bg-muted/40 border-border/60 focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-foreground/30 transition-colors placeholder:text-muted-foreground/50"
              />
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-medium text-foreground/70 uppercase tracking-widest">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Min. 8 characters"
                value={formData.password}
                onChange={handleChange}
                className="h-10 text-sm bg-muted/40 border-border/60 focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-foreground/30 transition-colors placeholder:text-muted-foreground/50"
              />
            </div>

            {/* Submit button */}
            <Button
              onClick={handleSubmit}
              className="w-full h-10 text-sm font-medium mt-1 rounded-lg transition-all active:scale-[0.98]"
            >
              Create account
            </Button>

            {/* Divider */}
            <div className="relative flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* OAuth button */}
            <Button
              variant="outline"
              className="w-full h-10 text-sm font-medium rounded-lg gap-2.5 border-border/80 hover:bg-muted/60 transition-all active:scale-[0.98]"
            >
              Continue with UASD
            </Button>
            <p className="text-center text-xs text-muted-foreground pt-1">
              Already have an account?{" "}
              <a
                href="#"
                className="text-foreground font-medium underline underline-offset-2 hover:text-foreground/80 transition-colors"
              >
                Sign in
              </a>
            </p>
          </CardContent>
        </Card>

        {/* Bottom legal note */}
        <p className="mt-5 text-center text-[11px] text-muted-foreground/60 leading-relaxed px-4">
          By creating an account, you agree to our{" "}
          <a href="#" className="underline underline-offset-2 hover:text-muted-foreground transition-colors">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="underline underline-offset-2 hover:text-muted-foreground transition-colors">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </main>
  );
}