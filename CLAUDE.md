# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Runtime & Package Manager

This project uses **Bun** exclusively — use `bun` instead of `npm`/`npx`/`yarn`/`pnpm` for all commands.

## Commands

```bash
bun run dev        # Start Next.js dev server (localhost:3000)
bun run build      # Production build
bun run lint       # ESLint (includes Prettier)
bun run typecheck  # TypeScript type-check (no emit)
bun install        # Install dependencies
```

There is **no test framework** configured in this project.

## Git Hooks (Lefthook)

Hooks run automatically — do not bypass them:

- **pre-commit**: `lint` + `typecheck` on staged `*.ts`/`*.tsx` files
- **commit-msg**: Enforces [Conventional Commits](https://www.conventionalcommits.org/) format (`feat:`, `fix:`, `chore:`, etc.)
- **pre-push**: Full `build`

## Architecture

**Next.js 16 App Router** with React Compiler enabled (`reactCompiler: true` in `next.config.ts`).

### Routes (`app/`)

- `app/page.tsx` — Redirects to `/file/0/`
- `app/file/[...path]/page.tsx` — Main file browser (catch-all route)
- `app/dashboard/page.tsx` — Protected user dashboard
- `app/login/page.tsx` — OTP-based login (email → 8-digit OTP)
- `app/auth/callback/route.ts` — Supabase auth callback
- `app/api/auth/send-otp/route.ts` — Sends OTP via Supabase
- `app/api/auth/verify-otp/route.ts` — Verifies OTP and creates session
- `app/not-found.tsx` — Retro 404 page

### Key Directories

- `components/common/` — Primitive UI components (Button, Input, Label, OtpInput, StatusBanner, Toaster). Each has a `variants.ts` using HeroUI's `tv()` for variant definitions.
- `components/ui/` — Feature-level components grouped by page (`home/`, `login/`)
- `components/SearchModal/` — Command-palette modal (Ctrl/Cmd+K), uses `cmdk`
- `components/header/` — Sticky header, hidden on login/callback routes
- `components/background/` — Pacman CSS animation background
- `context/` — React contexts with co-located hook and type files (ThemeContext, ViewModeContext)
- `hooks/` — SWR data-fetching hooks (`useDriveItems`, `useAuth`, `useAuthUser`)
- `lib/supabase/` — Separate `client.ts` (browser) and `server.ts` (RSC/API routes) Supabase instances
- `lib/swr/` — SWR provider (`revalidateOnFocus: false`, `shouldRetryOnError: false`) and custom fetcher
- `services/` — Supabase calls abstracted from hooks (`auth.ts`, `drive.ts`)
- `type/` — Shared TypeScript types (not `types/`)
- `constants/` — Static mappings (file-type icons, path names, search config)
- `utils/` — Pure helper functions

### Authentication

Supabase OTP-based auth. Middleware (`middleware.ts`) runs on all routes, refreshes session cookies, and redirects unauthenticated users from `/dashboard` to `/login?next=...`. Protected server components call `await createClient()` (server instance) to get the session.

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=
ALLOWED_EMAILS=          # Comma-separated list of allowed login emails
```

## Key Conventions

- **Tailwind v4**: `@import 'tailwindcss'` + `@theme` blocks in `globals.css` — no `tailwind.config.js`. Configured via PostCSS (`@tailwindcss/postcss`).
- **Path alias**: `@/` maps to the project root.
- **Type-only**: ESLint enforces `type` over `interface`.
- **No `any`**: `@typescript-eslint/no-explicit-any` is set to `error`.
- **RSC by default**: Components are Server Components unless `'use client'` is declared.
- **Dark mode**: CSS `prefers-color-scheme` media query — not class-based or JS-toggled.
- **HeroUI variants**: All component styling via HeroUI's `tv()` utility in co-located `variants.ts` files.
- **SWR mutations**: Auth mutations (`useSendOtp`, `useVerifyOtp`) defined in hooks, not services.

## Design System

**Retro gaming aesthetic** — pixelated, sharp corners, Pacman-inspired:

- **Fonts**: `Press Start 2P` (display/headings) + `Space Mono` (body). Applied via CSS variables `--font-press-start` and `--font-space-mono`.
- **No border-radius**: Everything uses `rounded-none` for a pixelated look.
- **Pixel shadows**: `box-shadow: 4px 4px 0px var(--foreground)` — defined as `.shadow-pixel` / `.shadow-pixel-sm` / `.shadow-pixel-primary` CSS utilities.
- **Colors** (CSS custom properties in `globals.css`):
  - Primary: `#2a3fe5` (blue)
  - Secondary: `#f4b9b0` (coral)
  - Background: `#ffffff` / `#000000` (dark)
- **File-type accents**: Each file category has a distinct border-top color on cards (blue=doc, amber=folder, etc.)
- **Hover effects**: Buttons/cards shift via `translate` (2–4px) mirroring shadow lift.

## CI Pipeline

GitHub Actions (`.github/workflows/ci.yml`) runs on push/PR to `main`/`master`:

1. `bun install --frozen-lockfile`
2. `bun run lint`
3. `bun run typecheck`
4. `bun run build` (with `NEXT_TELEMETRY_DISABLED=1`)
