'use client'

import { useScrape } from '@/hooks/use-scrape'
import { useTextInput } from '@/hooks/use-text-input'
import { useTranscript } from '@/hooks/use-transcript'
import { useVideoLoading } from '@/hooks/use-video-loading'

interface ContentLoaderProps {
  input: string
  onContentReady: (content: string) => void
}

export function YouTubeContentLoader({ input, onContentReady }: ContentLoaderProps) {
  useVideoLoading()
  useTranscript(input, onContentReady)
  return null
}

export function WebContentLoader({ input, onContentReady }: ContentLoaderProps) {
  useScrape(input, onContentReady)
  return null
}

export function TextContentLoader({ input, onContentReady }: ContentLoaderProps) {
  useTextInput(input, onContentReady)
  return null
}
