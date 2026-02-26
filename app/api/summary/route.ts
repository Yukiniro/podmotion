import { streamText } from 'ai'

export const maxDuration = 30

export async function POST(req: Request) {
  const { transcript, lang } = await req.json()

  if (!transcript) {
    return Response.json({ error: 'Missing transcript' }, { status: 400 })
  }

  const result = streamText({
    model: 'openai/gpt-4o-mini',
    system: `You are a content analyst. Generate a concise summary of the video transcript.
Respond in ${lang === 'zh' ? 'Chinese' : 'English'}.
The summary should cover: main topics, key arguments, and conclusions.
Keep it within 3-5 sentences.`,
    prompt: transcript,
  })

  return result.toTextStreamResponse()
}
