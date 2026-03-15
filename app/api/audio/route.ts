import { Buffer } from 'node:buffer'
import process from 'node:process'

const MINIMAX_API_URL = 'https://api.minimax.io/v1/t2a_v2'
const PRIMARY_MODEL = 'speech-2.8-turbo'
const FALLBACK_MODEL = 'speech-2.6-turbo'

export const maxDuration = 60

const LANGUAGE_MAP: Record<string, string> = {
  zh: 'Chinese',
  en: 'English',
}

interface MiniMaxT2AResponse {
  data?: {
    audio?: string
    status?: number
  }
  extra_info?: {
    audio_length?: number
    audio_sample_rate?: number
    audio_size?: number
    audio_format?: string
    usage_characters?: number
  }
  base_resp?: {
    status_code: number
    status_msg: string
  }
}

async function callMiniMax(
  apiKey: string,
  text: string,
  voiceId: string,
  language: string,
  model: string
): Promise<MiniMaxT2AResponse> {
  const res = await fetch(MINIMAX_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      text,
      voice_setting: {
        voice_id: voiceId,
        speed: 1.0,
        vol: 1.0,
        pitch: 0,
      },
      audio_setting: {
        format: 'mp3',
        sample_rate: 32000,
      },
      language_boost: LANGUAGE_MAP[language] ?? 'English',
    }),
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`MiniMax API HTTP ${res.status}: ${errorText}`)
  }

  return res.json()
}

export async function POST(req: Request) {
  const apiKey = process.env.MINIMAX_API_KEY
  if (!apiKey) {
    return Response.json({ error: 'MINIMAX_API_KEY not configured' }, { status: 500 })
  }

  let body: { text?: string; voiceId?: string; language?: string }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { text, voiceId, language = 'en' } = body

  if (!text || !voiceId) {
    return Response.json({ error: 'Missing text or voiceId' }, { status: 400 })
  }

  if (text.length > 10000) {
    return Response.json({ error: 'Text exceeds 10,000 character limit' }, { status: 400 })
  }

  try {
    let data = await callMiniMax(apiKey, text, voiceId, language, PRIMARY_MODEL)

    if (data.base_resp?.status_code === 2013) {
      console.warn('[audio] Primary model rejected, falling back to', FALLBACK_MODEL)
      data = await callMiniMax(apiKey, text, voiceId, language, FALLBACK_MODEL)
    }

    if (data.base_resp?.status_code !== 0) {
      console.error('[audio] MiniMax API error:', data.base_resp)
      return Response.json(
        { error: data.base_resp?.status_msg ?? 'TTS generation failed' },
        { status: 502 }
      )
    }

    if (!data.data?.audio) {
      return Response.json({ error: 'No audio data returned' }, { status: 502 })
    }

    const audioBuffer = Buffer.from(data.data.audio, 'hex')
    const duration = data.extra_info?.audio_length ?? 0

    return new Response(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': String(audioBuffer.length),
        'X-Audio-Duration': String(duration),
      },
    })
  } catch (error) {
    console.error('[audio] Error:', error)
    return Response.json({ error: 'Failed to generate audio' }, { status: 500 })
  }
}
