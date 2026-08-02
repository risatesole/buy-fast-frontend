@AGENTS.md

# Project: UASD Económato Online Store — Frontend

This is the customer-facing storefront and admin panel for **UASD's Económato**
(a Dominican Republic university co-op store). Students browse products, pay
online, and pick the order up in person at the Económato. The backend is a
separate Django/DRF service (see the `backend` project's own `CLAUDE.md`).

**The UI is always in Spanish** (institution is in the Dominican Republic) —
**all code (identifiers, comments, commit messages) is in English.** Do not mix
the two: don't write Spanish variable/function names, and don't leave English
strings in user-facing text.

## Tech stack

- Next.js 16 (App Router only — no `pages/`), React 19, TypeScript, pnpm.
- Tailwind CSS v4 (`@theme` tokens in `app/globals.css`, no `tailwind.config.js`),
  shadcn/radix-ui primitives in `components/ui/`.
- **No state-management library** (no Redux/Zustand/Jotai), **no data-fetching
  library** (no React Query/SWR), **no axios**. Everything is native `fetch` +
  `useState`/`useEffect`, or Context for the rare local-only state
  (`components/checkout-with-cart.tsx`'s `CartContext`).
- **No charting library** — dashboards use small hand-rolled SVG bar charts
  (see `app/admin/(main)/page.tsx`). Don't add recharts/chart.js etc. without
  checking with the user first — it's a deliberate choice, not an oversight.

## Auth model

Session-cookie based, not JWT (despite some vestigial `tokens.access_token`
typing left over in signup types — that's dead, ignore it). The flow:

1. Django sets a session cookie + `csrftoken` cookie on sign-in.
2. Next.js Route Handlers under `app/api/v1/**/route.ts` act as a thin proxy:
   they forward the browser's `Cookie` header to Django, and relay Django's
   `Set-Cookie` back on the way out. See `app/api/v1/admin/orders/route.ts` for
   the canonical shape of this proxy pattern — copy it for any new endpoint.
3. Mutations need `X-CSRFToken` (read from the `csrftoken` cookie) and a
   `Referer` header set to `process.env.FRONTEND_URL`.
4. There is **no `middleware.ts`**. Route protection is ad hoc per-layout
   (e.g. `app/admin/layout.tsx` checks `getCurrentUser()` and redirects).
   Known bug: it redirects to `/login`, which doesn't exist — the real route
   is `/signin`. Don't "fix" this without being asked; it's a pre-existing bug,
   not something introduced by your change, unless the task is specifically
   about auth redirects.

## Folder structure

```
app/                 App Router pages. (store) = public storefront route group,
                      admin/ = admin panel, api/ = Route Handlers (BFF proxy layer).
components/          Shared React components; components/ui/ = shadcn primitives.
entities/            Shared domain types (product.ts, user.ts).
features/            Feature-sliced modules (cart/, admin/inventory/), each with
                      its own service/ and types/.
hooks/                useMediaQuery, useSidebar, etc.
lib/                  Server-side data helpers + shared formatting utils
                      (format.ts, order-status.ts, products.ts, users.ts, inventory.ts).
services/             Class-based API clients (services/products, services/checkout, ...).
```

There's real duplication already in the codebase (multiple "get current user"
implementations, multiple `Product`/`CartItem` type shapes, two parallel
checkout implementations, a mix of versioned `/api/v1/...` and unversioned
`/api/...` routes). **Don't add a fourth version of something that already
has three** — if you're about to write logic that already exists elsewhere,
see "Reuse before duplicating" below instead.

## Design system (admin panel)

Established in `app/admin/customers/orders/page.tsx` and
`app/admin/inventory/page.tsx` — match it for any new admin UI:

- Navy `#002d62` (primary actions/headers), background `#f7f9fb`, card border
  `#e0e3e5`, muted text `#747781`, dark text `#191c1e`.
- Cards: `bg-white rounded-lg border border-[#e0e3e5]` (or `bg-[#f8fafd]` for
  stat tiles).
- Money: always `Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' })`
  — import `formatCurrency` from `lib/format.ts`, don't re-derive it.
- Dates: `Intl.DateTimeFormat('es-DO', ...)` — import `formatDate` from
  `lib/format.ts`.
- Order status labels/colors: import `STATUS_UI` from `lib/order-status.ts`.
- Admin pages fetch client-side from the local `/api/v1/...` Route Handler on
  mount (`'use client'` + `useEffect`), with explicit loading/error states —
  see `app/admin/inventory/page.tsx` for the reference shape. Server Components
  (used in the public storefront) forward cookies manually via `cookies()`
  from `next/headers`.

## Restrictions (apply to every change, not just one task)

- **Do not refactor heavily.** A feature request is not an invitation to clean
  up unrelated code, rename variables, or restructure files beyond what's needed.
- **Do not rename existing variables/functions without explicit permission.**
- **Do not make changes that could break existing functionality** — this
  codebase has no test suite to catch regressions, so be conservative and
  verify manually (run `pnpm dev`, click through the actual flow) before
  calling a change done.
- **No new npm dependencies without checking first** — prefer a small
  hand-rolled solution (as was done for charts) unless the user says otherwise.
- **Reuse before duplicating.** If a new feature needs logic that already
  exists in another file (a formatter, a status-color map, a permission check,
  a query pattern), **extract it into one new shared file** that both the
  original file and the new code import from — don't copy-paste it a second
  time, and don't leave the original file's copy in place. Example precedent:
  `lib/format.ts` and `lib/order-status.ts` were extracted out of
  `app/admin/customers/orders/page.tsx` when the admin dashboard needed the
  same currency/date formatting and status colors — the orders page now
  imports them under the same names it used to define locally, so nothing
  else in that file changed.

## Backend contract

The Django backend's canonical URL list lives in `backend/api/urls.py` (all
routes are mounted under `/api/v1/`). When you need a new piece of backend
data, check there first — a lot of aggregation endpoints already exist
(e.g. `/admin/inventory/low-stock/`, `/admin/orders/`,
`/admin/dashboard/summary/`) before assuming you need a new one.
