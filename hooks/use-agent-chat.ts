'use client'

import type { ScriptParagraph } from '@/lib/store'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useMemo } from 'react'

interface CoverImage {
  base64: string
  mediaType: string
}

interface AudioResult {
  paragraphId: string
  audioBase64: string
  duration: number
}

export function useAgentChat() {
  const chat = useChat({
    transport: new DefaultChatTransport({ api: '/api/agent' }),
  })

  const { script, coverImage, audioResults } = useMemo(() => {
    let script: ScriptParagraph[] = []
    let coverImage: CoverImage | null = null
    let audioResults: AudioResult[] = []

    for (const message of chat.messages) {
      if (message.role !== 'assistant') continue
      for (const part of message.parts) {
        if (part.type === 'tool-generateScript' && part.state === 'output-available') {
          const output = part.output as { paragraphs: ScriptParagraph[] } | undefined
          if (output?.paragraphs) {
            script = output.paragraphs
          }
        }
        if (part.type === 'tool-generateCoverImage' && part.state === 'output-available') {
          const output = part.output as CoverImage | undefined
          if (output?.base64) {
            coverImage = output
          }
        }
        if (part.type === 'tool-generateAudio' && part.state === 'output-available') {
          const output = part.output as { audioResults: AudioResult[] } | undefined
          if (output?.audioResults) {
            audioResults = output.audioResults
          }
        }
      }
    }

    return { script, coverImage, audioResults }
  }, [chat.messages])

  return {
    ...chat,
    script,
    coverImage,
    audioResults,
  }
}
