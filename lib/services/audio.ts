export interface GenerateAudioResult {
  blobUrl: string
  duration: number
}

export async function generateAudio(
  text: string,
  voiceId: string,
  language: 'zh' | 'en',
  signal?: AbortSignal
): Promise<GenerateAudioResult> {
  const res = await fetch('/api/audio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voiceId, language }),
    signal,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(err.error ?? `Audio generation failed (${res.status})`)
  }

  const blob = await res.blob()
  const blobUrl = URL.createObjectURL(blob)
  const duration = Number(res.headers.get('X-Audio-Duration')) || 0

  return { blobUrl, duration }
}
