# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Podmotion is an AI-powered podcast generator that converts YouTube videos into podcasts. Users input a YouTube URL (or text), the app extracts the transcript, generates an AI summary, creates a multi-speaker script with emotion annotations, and synthesizes audio via TTS. An AI agent interface orchestrates the entire workflow conversationally.

**Tech stack:** Next.js 16 (App Router), React 19, TypeScript (strict), Jotai (state), Tailwind CSS, shadcn/ui, Vitest, pnpm.

## Commands

```bash
pnpm dev              # Dev server (Turbo mode)
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # ESLint
pnpm lint:fix         # Auto-fix lint
pnpm type-check       # TypeScript check (tsc --noEmit)
pnpm format           # Prettier format
pnpm format:check     # Check formatting (CI)
pnpm test             # Vitest watch mode
pnpm test:run         # Single test run
pnpm test:ui          # Vitest UI dashboard
pnpm test:coverage    # Coverage report (v8)
pnpm generate:voice-previews  # Pre-generate TTS voice samples
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

## App Flow

The app uses three routes with the agent page managing most of the podcast workflow internally:

1. **Home** (`/[locale]/`) — YouTube URL or text input, validation, navigates to agent with query
2. **Agent** (`/[locale]/agent?q=<query>`) — AI-powered conversational interface that orchestrates the full pipeline: transcript extraction, streaming summary, style/speaker config, script generation (NDJSON), voice selection, per-paragraph audio generation with emotion marks, and export. Preview and workspace are UI states within this page, not separate routes.
3. **Invite** (`/[locale]/invite`) — Invite code gate (active when `INVITE_CODE` env var is set)

## Directory Structure

```text
app/
  [locale]/           # i18n routes (Home, Agent, Invite)
  api/                # Server-side API routes
    agent/            # Agent chat/reasoning endpoint
    audio/            # TTS audio generation (MiniMax)
    auth/             # Invite code verification
    scrape/           # Web page scraping
    script/           # AI script generation (streaming NDJSON)
    summary/          # AI summary generation (streaming)
    transcript/       # YouTube transcript extraction (Supadata)
components/
  agent/              # Agent container, input, messages, tool renderers
  preview/            # Summary display, video preview, style/speaker config
  workspace/          # Paragraph cards, voice selector, workspace header
  ai-elements/        # Rich AI chat UI (code blocks, audio player, etc.)
  common/             # Shared UI (header, buttons, form fields)
  ui/                 # shadcn/ui components (~57 components)
hooks/                # 15 custom hooks orchestrating services + atoms
lib/
  atoms/              # Jotai atoms (preview-atoms, workspace-atoms)
  services/           # Pure async business logic (transcript, summary, script, audio, voices, scrape, cache)
  utils/              # Pure functions (emotion, format, validators, agent, invite)
  server/             # Server-only code (minimax, schemas)
  prompts/            # AI prompt templates (agent, script, summary, constants)
  storage.ts          # IndexedDB wrapper via unstorage
  store.ts            # Global types and constants
  utils.ts            # cn() class merging utility
languages/            # Translation files (en.json, cn.json)
i18n/                 # next-intl config (routing, navigation, request)
scripts/              # Utility scripts (generate-voice-previews)
styles/               # Global CSS
```

## Key Patterns

**Streaming:** Summary and script generation use `ReadableStream` on the server and `getReader()` on the client. Script streaming emits NDJSON (one JSON object per line) parsed incrementally.

**Emotion system:** Paragraphs have character-indexed emotion marks (`{type, intensity, start, end}`) validated via Zod. 8 emotion types x 4 intensity levels, color-coded in UI (`lib/utils/emotion.tsx`).

**Caching:** IndexedDB via `unstorage` (`lib/storage.ts`). Transcript and voice data are cached client-side with `getCached()`/`setCache()` wrappers in `lib/services/cache.ts`.

**Internationalization:** `next-intl` with locales `en` and `cn`. Translations in `languages/{en,cn}.json`. Locale routing configured in `i18n/routing.ts`. Routes are `app/[locale]/`. Use `useTranslations()` hook.

**Agent architecture:** The agent page (`components/agent/`) uses a tool-based pattern with a tool registry (`tool-registry.ts`) and renderers (`tool-renderers.tsx`) to display rich interactive elements within the chat interface.

**AI prompts:** Prompt templates live in `lib/prompts/` (agent, script, summary) with shared constants in `lib/prompts/constants.ts`.

## External APIs

All accessed through server-side API routes (`app/api/`):

- **Supadata** — YouTube transcript extraction (supports async jobs with polling)
- **MiniMax** — TTS audio generation (`speech-2.8-turbo`) with emotion control
- **Vercel AI Gateway** — LLM access (`google/gemini-2.5-flash`) for summary and script generation

Required env vars (see `.env.example`):

| Variable | Purpose |
|---|---|
| `AI_GATEWAY_API_KEY` | Vercel AI Gateway (Google Gemini) |
| `SUPADATA_API_KEY` | YouTube transcript extraction |
| `MINIMAX_API_KEY` | TTS audio generation |
| `INVITE_CODE` | Optional — enables invite gate at `/invite` |

## Code Style

- `'use client'` at top of all client components
- Named exports for components: `export function ComponentName() {}`
- Import order: React/types → third-party → local (`@/` alias)
- Type-only imports: `import type { ... }`
- Class merging: `cn()` from `lib/utils.ts`
- File naming: kebab-case for all files; constants use `SCREAMING_SNAKE_CASE`
- No `any` — strict TypeScript
- Prettier: single quotes, no semicolons, trailing commas (es5), 100 char width, Tailwind class sorting
- ESLint: `@antfu/eslint-config` with React plugin; `components/ai-elements/` and `components/ui/` are excluded from linting

## Testing

- Vitest with jsdom environment; tests colocated as `*.test.ts` next to source files
- Prioritize testing services and utils (no React dependency)
- Mock fetch with `globalThis.fetch = vi.fn()` (not `global.fetch`)
- Mock modules with `vi.mock()` — imports are hoisted automatically
- Browser APIs mocked in `vitest.setup.ts` (matchMedia, IntersectionObserver)
- Coverage provider: v8
