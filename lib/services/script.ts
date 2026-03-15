import type { PodcastStyle, ScriptParagraph } from '@/lib/store'

export interface StreamScriptParams {
  transcript: string
  summary: string
  style: PodcastStyle
  speakers: 1 | 2
  language: 'zh' | 'en'
  signal?: AbortSignal
  onParagraph: (paragraph: ScriptParagraph) => void
}

export async function streamScript(params: StreamScriptParams): Promise<ScriptParagraph[]> {
  const { signal, onParagraph, ...body } = params

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

  if (!res.body) {
    throw new Error('No response body')
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  const paragraphs: ScriptParagraph[] = []
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop()!

    for (const line of lines) {
      if (!line.trim()) continue
      const paragraph = JSON.parse(line) as ScriptParagraph
      paragraphs.push(paragraph)
      onParagraph(paragraph)
    }
  }

  if (buffer.trim()) {
    const paragraph = JSON.parse(buffer) as ScriptParagraph
    paragraphs.push(paragraph)
    onParagraph(paragraph)
  }

  return paragraphs
}
