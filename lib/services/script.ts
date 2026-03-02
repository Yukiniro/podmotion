import type { PodcastStyle, ScriptParagraph } from '@/lib/store'

export interface GenerateScriptParams {
  transcript: string
  summary: string
  style: PodcastStyle
  speakers: 1 | 2
  language: 'zh' | 'en'
  signal?: AbortSignal
}

export async function generateScript(params: GenerateScriptParams): Promise<ScriptParagraph[]> {
  const { signal, ...body } = params

  const res = await fetch('/api/script', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Script generation failed' }))
    throw new Error(error.error || 'Script generation failed')
  }

  const data = await res.json()
  return data.paragraphs as ScriptParagraph[]
}
