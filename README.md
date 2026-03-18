# Podmotion

Turn YouTube videos, web articles, and text into AI-generated podcasts.

Podmotion is an open-source AI podcast generator. Paste a YouTube URL, drop in a web link, or type raw text — Podmotion extracts the content, summarizes it, writes a multi-speaker script with emotion annotations, and synthesizes natural-sounding audio via TTS.

## Features

- **Multiple input sources** — YouTube videos, web pages, or plain text
- **AI-powered summarization** — Streaming summary generation via Google Gemini
- **Multi-speaker scripts** — 1 or 2 speakers with character-level emotion marks (8 types x 4 intensities)
- **3 podcast styles** — Casual chat, popular science, news brief
- **40+ TTS voices** — English and Chinese (Mandarin), with gender filters and voice previews
- **Editable scripts** — Refine paragraphs before generating audio
- **Per-paragraph audio** — Generate and preview audio for each section independently
- **Agent chat mode** — Conversational AI flow for end-to-end podcast creation
- **Internationalization** — English and Simplified Chinese UI
- **Optional invite gate** — Access control via invitation codes

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router), React 19, TypeScript (strict) |
| State | Jotai |
| Styling | Tailwind CSS, shadcn/ui |
| AI | Vercel AI SDK v6, Google Gemini (via AI Gateway) |
| TTS | MiniMax (`speech-2.8-turbo`) |
| Transcripts | Supadata |
| Testing | Vitest |
| Package Manager | pnpm |

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
git clone https://github.com/zhanghao/podmotion.git
cd podmotion
pnpm install
```

### Environment Variables

Copy `.env.example` and fill in your API keys:

```bash
cp .env.example .env.local
```

| Variable | Description |
|----------|-------------|
| `AI_GATEWAY_API_KEY` | Vercel AI Gateway key (for Gemini LLM access) |
| `SUPADATA_API_KEY` | Supadata key (YouTube transcript extraction) |
| `MINIMAX_API_KEY` | MiniMax key (TTS audio synthesis) |
| `INVITE_CODE` | *(Optional)* Set to enable invitation code gate |

### Development

```bash
pnpm dev          # Start dev server (Turbo mode)
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
pnpm build        # Production build
pnpm start        # Start production server
```

## How It Works

```
YouTube URL / Web URL / Text
        │
        ▼
  ┌─────────────┐
  │  Extract     │  Supadata (YouTube) / Web scraper / Direct text
  │  Content     │
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐
  │  AI Summary  │  Google Gemini via streaming
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐
  │  Script Gen  │  Multi-speaker script with emotion marks (NDJSON stream)
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐
  │  TTS Audio   │  MiniMax per-paragraph synthesis with emotion control
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐
  │   Export     │  Final podcast assembly
  └─────────────┘
```

## Project Structure

```
app/
  [locale]/              # i18n routes (en, cn)
    agent/               # AI agent chat interface
    invite/              # Invitation code gate
  api/                   # Server API routes
    transcript/          # YouTube transcript extraction
    scrape/              # Web page extraction
    summary/             # Streaming AI summary
    script/              # Streaming script generation (NDJSON)
    audio/               # TTS audio synthesis
    agent/               # Agent tool orchestration
    voices/              # Available TTS voices

components/
  agent/                 # Agent chat UI
  preview/               # Content preview + config
  workspace/             # Script editor + audio generation
  ui/                    # shadcn/ui components

hooks/                   # Business logic orchestration
lib/
  atoms/                 # Jotai state definitions
  services/              # Pure async service functions
  utils/                 # Pure utility functions
  prompts/               # AI prompt templates

languages/               # i18n translations (en.json, cn.json)
public/audio/previews/   # Voice preview audio files
```

### Architecture

Five-layer architecture with one-way dependencies:

```
UI (components/) → Hooks (hooks/) → Atoms (lib/atoms/) + Services (lib/services/) → Utils (lib/utils/)
```

## Scripts

```bash
pnpm dev              # Dev server (Turbo mode)
pnpm build            # Production build
pnpm lint             # ESLint
pnpm lint:fix         # Auto-fix lint issues
pnpm type-check       # TypeScript check
pnpm format           # Prettier format
pnpm test             # Vitest watch mode
pnpm test:run         # Single test run
pnpm test:coverage    # Coverage report
```

## License

MIT
