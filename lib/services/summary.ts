export interface StreamSummaryOptions {
  signal?: AbortSignal
  onChunk: (accumulated: string) => void
}

export async function streamSummary(
  transcript: string,
  lang: string,
  options: StreamSummaryOptions
): Promise<string> {
  const res = await fetch('/api/summary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transcript, lang }),
    signal: options.signal,
  })

  if (!res.ok) throw new Error('Summary request failed')
  if (!res.body) throw new Error('No response body')

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let text = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    text += decoder.decode(value, { stream: true })
    options.onChunk(text)
  }

  return text
}
