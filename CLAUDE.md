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

**Next.js 16 App Router** project — all routes live under `app/`. Current structure:

- `app/layout.tsx` — Root layout (Geist fonts, global CSS wrapper)
- `app/page.tsx` — Homepage (`/`)
- `app/globals.css` — Tailwind v4 global styles + CSS custom properties for theming

### Key Conventions

- **Tailwind v4**: Uses `@import 'tailwindcss'` and `@theme` blocks in CSS — there is no `tailwind.config.js`. Configured via PostCSS (`@tailwindcss/postcss`).
- **Path alias**: `@/` maps to the project root (e.g., `import x from '@/app/utils'`).
- **Type-only**: ESLint enforces `type` over `interface` for all type definitions.
- **No `any`**: `@typescript-eslint/no-explicit-any` is set to `error`.
- **RSC by default**: All components are React Server Components unless `'use client'` is explicitly declared.
- **Dark mode**: Handled via `prefers-color-scheme` CSS media query, not a JS/class toggle.

## CI Pipeline

GitHub Actions (`.github/workflows/ci.yml`) runs on push/PR to `main`/`master`:
1. `bun install --frozen-lockfile`
2. `bun run lint`
3. `bun run typecheck`
4. `bun run build` (with `NEXT_TELEMETRY_DISABLED=1`)
