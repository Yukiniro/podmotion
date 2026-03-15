import type { VoiceOption } from '@/lib/store'

interface PreviewVoiceEntry {
  voice_id: string
  voice_name: string
  language: string
  gender: 'male' | 'female'
  description?: string[]
  preview_file: string
}

interface PreviewIndex {
  voices: PreviewVoiceEntry[]
}

let cachedVoices: VoiceOption[] | null = null

export async function fetchVoices(signal?: AbortSignal): Promise<VoiceOption[]> {
  if (cachedVoices) return cachedVoices

  const res = await fetch('/audio/previews/index.json', { signal })

  if (!res.ok) {
    throw new Error('Failed to load voice preview index')
  }

  const data = (await res.json()) as PreviewIndex

  const voices: VoiceOption[] = data.voices.map((v) => ({
    voice_id: v.voice_id,
    voice_name: v.voice_name,
    language: v.language,
    gender: v.gender,
    description: v.description,
    preview_url: `/audio/previews/${v.preview_file}`,
  }))

  cachedVoices = voices
  return voices
}
