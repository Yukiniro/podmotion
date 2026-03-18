import { Buffer } from 'node:buffer'

export const MINIMAX_API_URL = 'https://api.minimax.io/v1/t2a_v2'
export const PRIMARY_MODEL = 'speech-2.8-turbo'
export const FALLBACK_MODEL = 'speech-2.6-turbo'

export const LANGUAGE_MAP: Record<string, string> = {
  zh: 'Chinese',
  en: 'English',
}

export interface MiniMaxT2AResponse {
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

export async function callMiniMax(
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

export function decodeAudioBuffer(hexAudio: string): Buffer {
  return Buffer.from(hexAudio, 'hex')
}
