Repository: UASD Económato — Frontend

Source of truth
- The canonical, authoritative repository guidance is in [CLAUDE.md](CLAUDE.md).
- Do NOT modify `CLAUDE.md`. Keep these Copilot instructions synchronized with it.

High-level intent
- This repository implements the customer-facing storefront and admin panel for UASD's Económato. The UI is always Spanish for end users; all code, identifiers, comments, and commits are in English.

What to follow (key rules)
- Tech stack: Next.js 16 (App Router), React 19, TypeScript, pnpm, Tailwind CSS v4.
- No state-management or data-fetching libraries; prefer native `fetch`, `useState`/`useEffect`, and Context for local state.
- No `axios`, no React Query/SWR, no Redux/Zustand/Jotai.
- No charting library unless the user explicitly approves — dashboards use hand-rolled SVG charts.
- Session-cookie auth with Route Handlers under `app/api/v1/**/route.ts` acting as a thin proxy to the backend. Mutations require `X-CSRFToken` and a `Referer` header.

Design & UI conventions
- Follow the established admin design system (colors, cards, money/date formatting) as implemented in `app/admin/...` and `lib/format.ts` / `lib/order-status.ts`.
- Import and reuse `formatCurrency`, `formatDate`, and `STATUS_UI` instead of reimplementing formatting or order-status color maps.

Code structure and reuse
- Prefer reuse: if a formatter, map, permission check, or query helper already exists, import and reuse it. If a new shared helper is needed, extract it into a single new shared file and update callers to import it.
- Avoid creating a fourth copy of functionality that already has multiple implementations; consolidate instead, but do not perform wide refactors.

Restrictions and safety
- Do not refactor heavily or rename existing symbols without explicit permission.
- Do not add new npm dependencies without asking the user first.
- Be conservative: this repo lacks full automated tests for most areas — avoid risky, wide-impact changes.

Developer notes for Copilot
- When asked to implement features or fix bugs, consult [CLAUDE.md](CLAUDE.md) for the definitive guidance and keep changes minimal and consistent with existing patterns.
- Point to canonical files when suggesting edits (e.g., `lib/format.ts`, `app/api/v1/admin/orders/route.ts`).
- If a change will alter public response shapes or TypeScript types consumed by the frontend BFF routes, call this out clearly in recommendations.

If you need clarification
- Ask the user before adding dependencies, renaming symbols, or performing wide refactors.

Maintainers: keep these instructions in sync with [CLAUDE.md](CLAUDE.md).
