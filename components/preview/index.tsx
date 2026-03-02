'use client'

import { useAtomValue } from 'jotai'
import { ArrowRight } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

import { BackButton } from '@/components/common/back-button'
import { PodmotionLogo } from '@/components/podmotion-logo'
import { Button } from '@/components/ui/button'
import { useSummary } from '@/hooks/use-summary'
import { useTranscript } from '@/hooks/use-transcript'
import { useVideoLoading } from '@/hooks/use-video-loading'
import { summaryStatusAtom } from '@/lib/atoms/preview-atoms'
import { AISummary } from './ai-summary'
import { SpeakerLanguageConfig } from './speaker-language-config'
import { StyleSelector } from './style-selector'
import { VideoPreview } from './video-preview'

interface PreviewPageProps {
  videoUrl: string
  onBack: () => void
  onGenerate: () => void
}

export function PreviewPage({ videoUrl, onBack, onGenerate }: PreviewPageProps) {
  const t = useTranslations('preview')

  const summaryStatus = useAtomValue(summaryStatusAtom)
  const summaryReady = summaryStatus === 'done'
  const locale = useLocale()

  useVideoLoading()

  const { startSummary } = useSummary(locale)
  useTranscript(videoUrl, startSummary)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border/50 bg-background/80 px-6 py-4 backdrop-blur-xl">
        <BackButton onClick={onBack} />
        <PodmotionLogo />
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-8">
          <section>
            <VideoPreview videoUrl={videoUrl} />
          </section>
          <div className="h-px bg-border" />
          <AISummary />
        </div>

        <div className="flex flex-col gap-8">
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t('podcastConfig')}
          </h3>

          <StyleSelector />
          <SpeakerLanguageConfig />

          <div className="flex justify-center pt-4">
            <Button
              onClick={onGenerate}
              disabled={!summaryReady}
              className="w-full gap-2 rounded-2xl bg-foreground px-8 py-2.5 text-sm text-background hover:bg-foreground/90"
            >
              {summaryReady ? t('generateScript') : t('waitingSummary')}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
