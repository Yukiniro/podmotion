import type {UIMessage} from 'ai';
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import process from 'node:process'
import { Supadata } from '@supadata/js'
import {
  createAgentUIStreamResponse,
  generateText,
  Output,
  tool,
  ToolLoopAgent
  
} from 'ai'
import { z } from 'zod'

import { buildAgentSystemPrompt } from '@/lib/prompts/agent'
import { buildScriptSystemPrompt } from '@/lib/prompts/script'
import { buildSummarySystemPrompt } from '@/lib/prompts/summary'
import { callMiniMax, FALLBACK_MODEL, PRIMARY_MODEL } from '@/lib/server/minimax'
import { paragraphSchema } from '@/lib/server/schemas'
import { buildCoverImagePrompt } from '@/lib/utils/agent'
import { isValidYoutubeUrl } from '@/lib/utils/validators'

export const maxDuration = 120

function getSupadata() {
  return new Supadata({ apiKey: process.env.SUPADATA_API_KEY! })
}

const extractContent = tool({
  description:
    'Extract content from a YouTube video URL, a web page URL, or process raw text input. Use this when the user provides a link or text to turn into a podcast.',
  inputSchema: z.object({
    url: z.string().optional().describe('A YouTube video URL or web page URL to extract content from'),
    text: z.string().optional().describe('Raw text content provided directly by the user'),
  }),
  execute: async ({ url, text }) => {
    if (text) {
      return {
        content: text,
        sourceType: 'text' as const,
      }
    }

    if (!url) {
      throw new Error('Either url or text must be provided')
    }

    const supadata = getSupadata()

    if (isValidYoutubeUrl(url)) {
      const result = await supadata.transcript({ url, text: true, mode: 'auto' })

      if ('jobId' in result) {
        // Poll for async job completion
        let attempts = 0
        while (attempts < 30) {
          await new Promise((resolve) => setTimeout(resolve, 2000))
          const status = await supadata.transcript.getJobStatus(result.jobId)
          if (status.status === 'completed' && status.result) {
            return {
              content: status.result.content,
              language: status.result.lang,
              sourceType: 'youtube' as const,
            }
          }
          if (status.status === 'failed') {
            throw new Error('Transcript extraction failed')
          }
          attempts++
        }
        throw new Error('Transcript extraction timed out')
      }

      return {
        content: result.content,
        language: result.lang,
        sourceType: 'youtube' as const,
      }
    }

    // Web URL
    const result = await supadata.web.scrape(url)
    if (!result.content) {
      throw new Error('No content could be extracted from the URL')
    }

    return {
      content: result.content,
      title: result.name || undefined,
      sourceType: 'web' as const,
    }
  },
})

const generateSummary = tool({
  description: 'Generate a concise summary of the extracted content. Use after extracting content.',
  inputSchema: z.object({
    content: z.string().describe('The content text to summarize'),
    language: z
      .string()
      .optional()
      .describe('Language code for the summary output (en or zh). Defaults to en.'),
  }),
  execute: async ({ content, language }) => {
    const result = await generateText({
      model: 'google/gemini-2.5-flash',
      system: buildSummarySystemPrompt(language || 'en'),
      prompt: content,
    })

    return { summary: result.text }
  },
})

const generateScript = tool({
  description:
    'Generate a multi-speaker podcast script with emotion annotations. Use after generating a summary and confirming user preferences.',
  inputSchema: z.object({
    transcript: z.string().describe('The full source content/transcript'),
    summary: z.string().describe('The content summary'),
    style: z
      .enum(['casual', 'popular-science', 'news'])
      .describe('Podcast style: casual, popular-science, or news'),
    speakers: z
      .union([z.literal(1), z.literal(2)])
      .describe('Number of speakers: 1 for solo, 2 for dialogue'),
    language: z.enum(['zh', 'en']).describe('Output language: zh for Chinese, en for English'),
  }),
  execute: async ({ transcript, summary, style, speakers, language }) => {
    const result = await generateText({
      model: 'google/gemini-2.5-flash',
      output: Output.array({ element: paragraphSchema }),
      system: buildScriptSystemPrompt({ style, speakers, language }),
      prompt: `Content Summary:\n${summary}\n\nSource Content:\n${transcript}`,
    })

    return { paragraphs: result.output ?? [] }
  },
})

const suggestVoices = tool({
  description:
    'Suggest suitable TTS voices for the podcast based on language and style. Use after generating the script.',
  inputSchema: z.object({
    language: z.enum(['zh', 'en']).describe('Podcast language: zh or en'),
    speakers: z
      .union([z.literal(1), z.literal(2)])
      .describe('Number of speakers: 1 or 2'),
    style: z.string().optional().describe('The podcast style for context'),
  }),
  execute: async ({ language, speakers }) => {
    const indexPath = join(process.cwd(), 'public', 'audio', 'previews', 'index.json')
    const indexData = JSON.parse(await readFile(indexPath, 'utf-8'))
    const voices = indexData.voices as Array<{
      voice_id: string
      voice_name: string
      language: string
      gender: string
      description?: string[]
    }>

    const langFilter = language === 'zh' ? 'Chinese' : 'English'
    const filtered = voices.filter((v) => v.language === langFilter)

    const maleVoices = filtered.filter((v) => v.gender === 'male')
    const femaleVoices = filtered.filter((v) => v.gender === 'female')

    const recommendations: Array<{
      speaker: string
      voiceId: string
      voiceName: string
      gender: string
      description: string
    }> = []

    if (speakers === 1) {
      const voice = maleVoices[0] || filtered[0]
      if (voice) {
        recommendations.push({
          speaker: 'A',
          voiceId: voice.voice_id,
          voiceName: voice.voice_name,
          gender: voice.gender,
          description: voice.description?.[0] || '',
        })
      }
    } else {
      const voiceA = maleVoices[0] || filtered[0]
      const voiceB = femaleVoices[0] || filtered[1] || filtered[0]
      if (voiceA) {
        recommendations.push({
          speaker: 'A',
          voiceId: voiceA.voice_id,
          voiceName: voiceA.voice_name,
          gender: voiceA.gender,
          description: voiceA.description?.[0] || '',
        })
      }
      if (voiceB) {
        recommendations.push({
          speaker: 'B',
          voiceId: voiceB.voice_id,
          voiceName: voiceB.voice_name,
          gender: voiceB.gender,
          description: voiceB.description?.[0] || '',
        })
      }
    }

    return {
      recommendations,
      availableVoices: filtered.map((v) => ({
        voiceId: v.voice_id,
        voiceName: v.voice_name,
        gender: v.gender,
        description: v.description?.[0] || '',
      })),
    }
  },
})

const generateCoverImage = tool({
  description:
    'Generate a podcast cover image based on the content summary and style. Creates a visually appealing square image suitable for podcast platforms.',
  inputSchema: z.object({
    summary: z.string().describe('Content summary to base the image on'),
    style: z.string().describe('Podcast style (casual, popular-science, or news)'),
    title: z.string().optional().describe('Optional title to incorporate into the image'),
  }),
  execute: async ({ summary, style, title }) => {
    const prompt = buildCoverImagePrompt(summary, style, title)

    const result = await generateText({
      model: 'google/gemini-2.5-flash',
      prompt,
    })

    const imageFile = result.files?.find((f) => f.mediaType?.startsWith('image/'))

    if (!imageFile) {
      throw new Error('No image was generated. The model may not support image generation.')
    }

    const base64 = imageFile.base64

    return {
      base64,
      mediaType: imageFile.mediaType || 'image/png',
    }
  },
})

const generateAudio = tool({
  description:
    'Generate TTS audio for podcast script paragraphs. Call this after the user confirms voice selections.',
  inputSchema: z.object({
    paragraphs: z.array(
      z.object({
        id: z.string().describe('Paragraph ID (e.g., p1, p2)'),
        text: z.string().describe('The text content to synthesize'),
        voiceId: z.string().describe('The TTS voice ID to use'),
        language: z.enum(['zh', 'en']).describe('Language for TTS'),
      })
    ),
  }),
  execute: async ({ paragraphs }) => {
    const apiKey = process.env.MINIMAX_API_KEY
    if (!apiKey) {
      throw new Error('MINIMAX_API_KEY not configured')
    }

    const results: Array<{
      paragraphId: string
      audioBase64: string
      duration: number
    }> = []

    for (const paragraph of paragraphs) {
      let data = await callMiniMax(apiKey, paragraph.text, paragraph.voiceId, paragraph.language, PRIMARY_MODEL)

      if (data.base_resp?.status_code === 2013) {
        data = await callMiniMax(apiKey, paragraph.text, paragraph.voiceId, paragraph.language, FALLBACK_MODEL)
      }

      if (data.base_resp?.status_code !== 0) {
        throw new Error(`TTS failed for ${paragraph.id}: ${data.base_resp?.status_msg}`)
      }

      if (!data.data?.audio) {
        throw new Error(`No audio data for ${paragraph.id}`)
      }

      results.push({
        paragraphId: paragraph.id,
        audioBase64: data.data.audio,
        duration: data.extra_info?.audio_length ?? 0,
      })
    }

    return { audioResults: results }
  },
})

const agent = new ToolLoopAgent({
  model: 'google/gemini-2.5-flash',
  instructions: buildAgentSystemPrompt('en'),
  tools: {
    extractContent,
    generateSummary,
    generateScript,
    suggestVoices,
    generateCoverImage,
    generateAudio,
  },
})

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  return createAgentUIStreamResponse({
    agent,
    uiMessages: messages,
  })
}
