import { getCached, setCache } from './cache'

export interface TranscriptResult {
  content: string
  lang: string
  availableLangs: string[]
}

export class TranscriptPendingError extends Error {
  constructor(public readonly jobId: string) {
    super(`Transcript job pending: ${jobId}`)
    this.name = 'TranscriptPendingError'
  }
}

export async function fetchTranscript(
  videoUrl: string,
  signal?: AbortSignal
): Promise<TranscriptResult> {
  const cacheKey = `transcript:${videoUrl}`

  const cached = await getCached<TranscriptResult & { cachedAt: number }>(cacheKey)
  if (cached?.content) return cached

  const res = await fetch(`/api/transcript?url=${encodeURIComponent(videoUrl)}`, { signal })
  if (!res.ok) throw new Error('Transcript fetch failed')

  const data = await res.json()
  if ('jobId' in data) throw new TranscriptPendingError(data.jobId)

  const result: TranscriptResult = {
    content: data.content,
    lang: data.lang,
    availableLangs: data.availableLangs,
  }

  await setCache(cacheKey, { ...result, cachedAt: Date.now() })
  return result
}
