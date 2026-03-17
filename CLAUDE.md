# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Podmotion is an AI-powered podcast generator that converts YouTube videos into podcasts. Users input a YouTube URL, the app extracts the transcript, generates an AI summary, creates a multi-speaker script with emotion annotations, and synthesizes audio via TTS.

**Tech stack:** Next.js 16 (App Router), React 19, TypeScript (strict), Jotai (state), Tailwind CSS, shadcn/ui, Vitest, pnpm.

## Commands

```bash
pnpm dev              # Dev server (Turbo mode)
pnpm build            # Production build
pnpm lint             # ESLint
pnpm lint:fix         # Auto-fix lint
pnpm type-check       # TypeScript check (tsc --noEmit)
pnpm format           # Prettier format
pnpm test             # Vitest watch mode
pnpm test:run         # Single test run
pnpm test:coverage    # Coverage report
```

Run a single test file: `pnpm vitest run lib/services/transcript.test.ts`

## Architecture

The project enforces a strict **five-layer architecture** with one-way dependencies:

```text
UI (components/) → Hooks (hooks/) → Atoms (lib/atoms/) + Services (lib/services/) → Utils (lib/utils/)
```

**Rules:**

- UI components must NOT call `fetch`, services, or cache directly — only read atoms via `useAtomValue` and call hooks
- Services are pure async functions with NO React/Jotai imports — they are testable in isolation
- Atoms define state shape only — NO business logic, side effects, or write-only atoms
- Hooks orchestrate services + atoms: call service functions, update atoms via `useSetAtom`, manage `AbortController` lifecycle
- Utils are pure functions with no side effects

**When adding a feature**, build bottom-up: Utils → Service → Atoms → Hook → UI → Tests.

See [AGENTS.md](AGENTS.md) for detailed layer rules and code examples.

## App Flow (Multi-Page)

1. **Home** — YouTube URL input and validation
2. **Preview** (`/[locale]/preview`) — Transcript extraction, streaming AI summary, style/speaker config
3. **Workspace** (`/[locale]/workspace`) — Streaming script generation (NDJSON), voice selection, per-paragraph audio generation with emotion marks
4. **Export** — Final podcast assembly

## Key Patterns

**Streaming:** Summary and script generation use `ReadableStream` on the server and `getReader()` on the client. Script streaming emits NDJSON (one JSON object per line) parsed incrementally.

**Emotion system:** Paragraphs have character-indexed emotion marks (`{type, intensity, start, end}`) validated via Zod. 8 emotion types × 4 intensity levels, color-coded in UI (`lib/utils/emotion.tsx`).

**Caching:** IndexedDB via `unstorage` (`lib/storage.ts`). Transcript and voice data are cached client-side with `getCached()`/`setCache()` wrappers in `lib/services/cache.ts`.

**Internationalization:** `next-intl` with locales `en` and `cn`. Translations in `languages/{en,cn}.json`. Routes are `app/[locale]/`. Use `useTranslations()` hook.

## External APIs

All accessed through server-side API routes (`app/api/`):

- **Supadata** — YouTube transcript extraction (supports async jobs with polling)
- **MiniMax** — TTS audio generation (`speech-2.8-turbo`) with emotion control
- **Vercel AI Gateway** — LLM access (`google/gemini-2.5-flash`) for summary and script generation

Required env vars: `AI_GATEWAY_API_KEY`, `SUPADATA_API_KEY`, `MINIMAX_API_KEY` (see `.env.example`).

## Code Style

- `'use client'` at top of all client components
- Named exports for components: `export function ComponentName() {}`
- Import order: React/types → third-party → local (`@/` alias)
- Type-only imports: `import type { ... }`
- Class merging: `cn()` from `lib/utils.ts`
- File naming: kebab-case for all files; constants use `SCREAMING_SNAKE_CASE`
- No `any` — strict TypeScript
- Prettier: single quotes, no semicolons, trailing commas (es5), 100 char width, Tailwind class sorting

## Testing

- Vitest with jsdom environment; tests colocated as `*.test.ts` next to source files
- Prioritize testing services and utils (no React dependency)
- Mock fetch with `globalThis.fetch = vi.fn()` (not `global.fetch`)
- Mock modules with `vi.mock()` — imports are hoisted automatically
- Browser APIs mocked in `vitest.setup.ts` (matchMedia, IntersectionObserver)
