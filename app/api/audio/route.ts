import process from 'node:process'

import { callMiniMax, decodeAudioBuffer, FALLBACK_MODEL, PRIMARY_MODEL } from '@/lib/server/minimax'

export const maxDuration = 60

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

    const audioBuffer = decodeAudioBuffer(data.data.audio)
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
