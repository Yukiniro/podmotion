import { streamText } from 'ai'

import { buildSummarySystemPrompt } from '@/lib/prompts/summary'

export const maxDuration = 30

export async function POST(req: Request) {
  const { transcript, lang } = await req.json()

  if (!transcript) {
    return Response.json({ error: 'Missing transcript' }, { status: 400 })
  }

  const result = streamText({
    model: 'google/gemini-2.5-flash',
    system: buildSummarySystemPrompt(lang),
    prompt: transcript,
  })

  return result.toTextStreamResponse()
}
