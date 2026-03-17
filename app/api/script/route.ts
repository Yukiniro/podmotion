import { Output, streamText } from 'ai'
import { z } from 'zod'

import { buildScriptSystemPrompt } from '@/lib/prompts/script'

export const maxDuration = 60

const emotionSchema = z.object({
  start: z.number().describe('Start character index in the text'),
  end: z.number().describe('End character index in the text'),
  emotion: z.enum([
    'happy',
    'excited',
    'angry',
    'sad',
    'surprised',
    'gentle',
    'humorous',
    'serious',
  ]),
  intensity: z.enum(['slight', 'moderate', 'strong', 'very-strong']),
})

const paragraphSchema = z.object({
  id: z.string().describe('Unique paragraph ID like p1, p2, p3...'),
  speaker: z.enum(['A', 'B']),
  text: z.string().describe('The spoken text content'),
  emotions: z.array(emotionSchema).describe('Emotion annotations for segments of the text'),
})

export async function POST(req: Request) {
  let body
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { transcript, summary, style, speakers, language } = body

  if (!transcript) {
    return Response.json({ error: 'Missing transcript' }, { status: 400 })
  }

  const result = streamText({
    model: 'google/gemini-2.5-flash',
    output: Output.array({ element: paragraphSchema }),
    system: buildScriptSystemPrompt({ style, speakers, language }),
    prompt: `Content Summary:\n${summary}\n\nSource Content:\n${transcript}`,
  })

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      for await (const paragraph of result.elementStream) {
        controller.enqueue(encoder.encode(`${JSON.stringify(paragraph)}\n`))
      }
      controller.close()
    },
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'application/x-ndjson' },
  })
}
