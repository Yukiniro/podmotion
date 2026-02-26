'use client'

import type { PodcastStyle } from '@/lib/store'
import { useAtomValue, useSetAtom } from 'jotai'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { useEffect } from 'react'
import { PodCraftLogo } from '@/components/podcraft-logo'
import { Button } from '@/components/ui/button'
import { previewConfigAtom, videoLoadingAtom } from '@/lib/atoms/preview-atoms'
import { AISummary } from './ai-summary'
import { SpeakerLanguageConfig } from './speaker-language-config'
import { StyleSelector } from './style-selector'
import { VideoPreview } from './video-preview'
import { VoiceSelector } from './voice-selector'

export interface PreviewConfig {
  style: PodcastStyle
  speakers: 1 | 2
  language: 'zh' | 'en'
  voiceA: string
  voiceB: string
}

interface PreviewPageProps {
  videoUrl: string
  onBack: () => void
  onGenerate: (config: PreviewConfig) => void
}

export function PreviewPage({ videoUrl: _videoUrl, onBack, onGenerate }: PreviewPageProps) {
  const t = useTranslations('preview')
  const tc = useTranslations('common')
  const setVideoLoading = useSetAtom(videoLoadingAtom)
  const config = useAtomValue(previewConfigAtom)

  useEffect(() => {
    setVideoLoading(true)
    const timer = setTimeout(() => setVideoLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [setVideoLoading])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-border px-8 py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {tc('back')}
        </Button>
        <PodCraftLogo />
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 gap-10 px-8 py-10 lg:grid-cols-[1fr_380px]">
        {/* Left: Video Preview + AI Summary */}
        <div className="flex flex-col gap-8">
          <section>
            <VideoPreview />
          </section>
          <div className="h-px bg-border" />
          <AISummary />
        </div>

        {/* Right: Configuration + Generate */}
        <div className="flex flex-col gap-8">
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t('podcastConfig')}
          </h3>
          <StyleSelector />
          <SpeakerLanguageConfig />
          <VoiceSelector />

          <div className="flex justify-center pt-4">
            <Button
              onClick={() => onGenerate(config)}
              className="w-full gap-2 rounded-lg bg-foreground px-8 py-2.5 text-sm text-background hover:bg-foreground/90"
            >
              {t('generateScript')}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
