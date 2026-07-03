'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/v1/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message ?? 'Signin failed');
        return;
      }

      window.location.href = '/';
    } catch (error) {
      console.error(error);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="w-full max-w-sm relative">
        <div className="absolute -top-px left-8 right-8 h-px bg-foreground/20" />

        <Card className="border border-border shadow-xl shadow-foreground/5 rounded-2xl overflow-hidden">
          <CardHeader className="pb-0 pt-8 px-8">
            <div className="mb-6 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-foreground flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-sm bg-background" />
              </div>

              <span
                className="text-sm font-semibold tracking-tight text-foreground"
                style={{ fontFamily: 'var(--font-geist-mono)' }}
              >
                acme
              </span>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-foreground leading-tight">
              Sign In
            </h1>

            <p className="mt-1.5 text-sm text-muted-foreground">Sign in to your account</p>
          </CardHeader>

          <CardContent className="px-8 pt-7 pb-8 space-y-5">
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-xs font-medium text-foreground/70 uppercase tracking-widest"
              >
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

            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-xs font-medium text-foreground/70 uppercase tracking-widest"
              >
                Password
              </Label>

              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="h-10 text-sm bg-muted/40 border-border/60 focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-foreground/30 transition-colors placeholder:text-muted-foreground/50"
              />
            </div>

            {error && (
              <div className="rounded-md border border-red-500/20 bg-red-500/10 p-3">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full h-10 text-sm font-medium mt-1 rounded-lg transition-all active:scale-[0.98]"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="relative flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <Button
              variant="outline"
              className="w-full h-10 text-sm font-medium rounded-lg gap-2.5 border-border/80 hover:bg-muted/60 transition-all active:scale-[0.98]"
            >
              Continue with UASD
            </Button>

            <p className="text-center text-xs text-muted-foreground pt-1">
              Don't have an account?{' '}
              <a
                href="/signup"
                className="text-foreground font-medium underline underline-offset-2 hover:text-foreground/80 transition-colors"
              >
                Sign up
              </a>
            </p>
          </CardContent>
        </Card>

        <p className="mt-5 text-center text-[11px] text-muted-foreground/60 leading-relaxed px-4">
          By signing in, you agree to our{' '}
          <a
            href="#"
            className="underline underline-offset-2 hover:text-muted-foreground transition-colors"
          >
            Terms
          </a>{' '}
          and{' '}
          <a
            href="#"
            className="underline underline-offset-2 hover:text-muted-foreground transition-colors"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </main>
  );
}
