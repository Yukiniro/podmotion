import { Buffer } from 'node:buffer'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'

import 'dotenv/config'

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY
const TTS_API_URL = 'https://api.minimax.io/v1/t2a_v2'
const VOICE_API_URL = 'https://api.minimax.io/v1/get_voice'
const PRIMARY_MODEL = 'speech-2.8-turbo'
const FALLBACK_MODEL = 'speech-2.6-turbo'
const MAX_PER_LANGUAGE = 20
const CONCURRENCY = 3
const RETRY_COUNT = 1
const OUTPUT_DIR = resolve(process.cwd(), 'public/audio/previews')
const FORCE = process.argv.includes('--force')

const PREVIEW_TEXT: Record<string, string> = {
  'Chinese (Mandarin)': '你好，这是语音预览效果，希望你喜欢这个声音。',
  English: 'Hello, this is a voice preview. I hope you enjoy this voice.',
}

const LANGUAGE_BOOST_MAP: Record<string, string> = {
  'Chinese (Mandarin)': 'Chinese',
  English: 'English',
}

// ---------------------------------------------------------------------------
// Voice inference (mirrored from app/api/voices/route.ts)
// ---------------------------------------------------------------------------

const CHINESE_EXCEPTIONS = new Set(['Arrogant_Miss', 'Robot_Armor'])

function inferLanguage(voiceId: string): string | null {
  if (CHINESE_EXCEPTIONS.has(voiceId)) return 'Chinese (Mandarin)'
  if (voiceId.startsWith('English_') || voiceId.startsWith('English ')) return 'English'
  if (
    voiceId.startsWith('Chinese (Mandarin)_') ||
    voiceId.startsWith('Chinese (Mandarin) ') ||
    voiceId.startsWith('Chinese_') ||
    voiceId.startsWith('Chinese ')
  )
    return 'Chinese (Mandarin)'
  return null
}

const FEMALE_PATTERNS =
  /\b(?:girl|woman|women|lady|female|queen|miss|sister|maiden|princess|belle|heroine|aunt|auntie|antie|wife|girlfriend|mother|hostess|schoolgirl|attendant|bestie)\b/i

const MALE_PATTERNS =
  /\b(?:man|men|boy|male|bloke|gentleman|knight|butler|commander|scholar|warrior|husband|father|soldier|veteran|guy|boyfriend|executive|anchor|armor|robot|sorcerer|reaper|claus|rudolph|arnold|ghost|godfather|grinch|santa)\b/i

function inferGender(voiceId: string, voiceName: string): 'male' | 'female' {
  const combined = `${voiceName} ${voiceId}`
  if (FEMALE_PATTERNS.test(combined)) return 'female'
  if (MALE_PATTERNS.test(combined)) return 'male'
  return 'male'
}

// ---------------------------------------------------------------------------
// MiniMax API calls
// ---------------------------------------------------------------------------

interface MiniMaxVoice {
  voice_id: string
  voice_name: string
  description: string[]
}

interface MiniMaxT2AResponse {
  data?: { audio?: string; status?: number }
  extra_info?: { audio_length?: number }
  base_resp?: { status_code: number; status_msg: string }
}

async function fetchSystemVoices(): Promise<MiniMaxVoice[]> {
  const res = await fetch(VOICE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${MINIMAX_API_KEY}`,
    },
    body: JSON.stringify({ voice_type: 'system' }),
  })

  if (!res.ok) throw new Error(`Get Voice API HTTP ${res.status}`)
  const data = await res.json()
  if (data.base_resp?.status_code !== 0) {
    throw new Error(`Get Voice API error: ${data.base_resp?.status_msg}`)
  }
  return data.system_voice ?? []
}

async function generateAudio(
  text: string,
  voiceId: string,
  languageBoost: string,
  model: string
): Promise<{ buffer: Buffer; duration: number }> {
  const res = await fetch(TTS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${MINIMAX_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      text,
      voice_setting: { voice_id: voiceId, speed: 1.0, vol: 1.0, pitch: 0 },
      audio_setting: { format: 'mp3', sample_rate: 32000 },
      language_boost: languageBoost,
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`TTS API HTTP ${res.status}: ${errText}`)
  }

  const data: MiniMaxT2AResponse = await res.json()

  if (data.base_resp?.status_code === 2013) {
    return generateAudio(text, voiceId, languageBoost, FALLBACK_MODEL)
  }

  if (data.base_resp?.status_code !== 0) {
    throw new Error(`TTS error: ${data.base_resp?.status_msg}`)
  }
  if (!data.data?.audio) {
    throw new Error('No audio data returned')
  }

  return {
    buffer: Buffer.from(data.data.audio, 'hex'),
    duration: data.extra_info?.audio_length ?? 0,
  }
}

// ---------------------------------------------------------------------------
// Concurrency helper
// ---------------------------------------------------------------------------

async function runWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = []
  let cursor = 0

  async function worker() {
    while (cursor < items.length) {
      const idx = cursor++
      results[idx] = await fn(items[idx], idx)
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()))
  return results
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

interface VoiceEntry {
  voice_id: string
  voice_name: string
  language: string
  gender: 'male' | 'female'
  description: string[]
  preview_file: string
  duration: number
}

async function main() {
  if (!MINIMAX_API_KEY) {
    console.error('MINIMAX_API_KEY not configured in .env')
    process.exit(1)
  }

  mkdirSync(OUTPUT_DIR, { recursive: true })

  console.log('Fetching system voices...')
  const allVoices = await fetchSystemVoices()
  console.log(`Found ${allVoices.length} total system voices`)

  const grouped: Record<
    string,
    (MiniMaxVoice & { language: string; gender: 'male' | 'female' })[]
  > = {}

  for (const v of allVoices) {
    const language = inferLanguage(v.voice_id)
    if (!language) continue
    if (!grouped[language]) grouped[language] = []
    if (grouped[language].length >= MAX_PER_LANGUAGE) continue
    grouped[language].push({
      ...v,
      language,
      gender: inferGender(v.voice_id, v.voice_name),
    })
  }

  const voicesToProcess = Object.values(grouped).flat()
  console.log(
    `Selected ${voicesToProcess.length} voices: ${Object.entries(grouped)
      .map(([lang, arr]) => `${lang}(${arr.length})`)
      .join(', ')}`
  )

  const entries: VoiceEntry[] = []
  let successCount = 0
  let skipCount = 0
  let errorCount = 0

  await runWithConcurrency(voicesToProcess, CONCURRENCY, async (voice, idx) => {
    const filename = `${voice.voice_id}.mp3`
    const filepath = resolve(OUTPUT_DIR, filename)
    const label = `[${idx + 1}/${voicesToProcess.length}] ${voice.voice_id}`

    if (!FORCE && existsSync(filepath)) {
      console.log(`${label} — skipped (exists)`)
      skipCount++
      entries[idx] = {
        voice_id: voice.voice_id,
        voice_name: voice.voice_name,
        language: voice.language,
        gender: voice.gender,
        description: voice.description,
        preview_file: filename,
        duration: 0,
      }
      return
    }

    const text = PREVIEW_TEXT[voice.language]
    const languageBoost = LANGUAGE_BOOST_MAP[voice.language] ?? 'English'

    for (let attempt = 0; attempt <= RETRY_COUNT; attempt++) {
      try {
        if (attempt > 0) console.log(`${label} — retry #${attempt}`)

        const { buffer, duration } = await generateAudio(
          text,
          voice.voice_id,
          languageBoost,
          PRIMARY_MODEL
        )
        writeFileSync(filepath, buffer)
        console.log(`${label} — saved (${(buffer.length / 1024).toFixed(1)} KB, ${duration}ms)`)
        successCount++

        entries[idx] = {
          voice_id: voice.voice_id,
          voice_name: voice.voice_name,
          language: voice.language,
          gender: voice.gender,
          description: voice.description,
          preview_file: filename,
          duration,
        }
        return
      } catch (err) {
        if (attempt === RETRY_COUNT) {
          console.error(`${label} — FAILED:`, err instanceof Error ? err.message : err)
          errorCount++
        }
      }
    }
  })

  const validEntries = entries.filter(Boolean)

  const index = {
    generatedAt: new Date().toISOString(),
    model: PRIMARY_MODEL,
    voices: validEntries,
  }

  const indexPath = resolve(OUTPUT_DIR, 'index.json')
  writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`)

  console.log('\n--- Done ---')
  console.log(`Generated: ${successCount}, Skipped: ${skipCount}, Failed: ${errorCount}`)
  console.log(`Index written to ${indexPath} (${validEntries.length} entries)`)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
