'use client'

import type { InputMode } from '@/lib/store'

import { useAtomValue } from 'jotai'
import { ArrowRight } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

import { AppHeader } from '@/components/common/app-header'
import { BackButton } from '@/components/common/back-button'
import { SectionTitle } from '@/components/common/section-title'
import { PodmotionLogo } from '@/components/podmotion-logo'
import { Button } from '@/components/ui/button'
import { useSummary } from '@/hooks/use-summary'
import { summaryStatusAtom } from '@/lib/atoms/preview-atoms'
import { AISummary } from './ai-summary'
import { TextContentLoader, WebContentLoader, YouTubeContentLoader } from './content-loaders'
import { ContentPreview } from './content-preview'
import { SpeakerLanguageConfig } from './speaker-language-config'
import { StyleSelector } from './style-selector'

interface PreviewPageProps {
  input: string
  inputMode: InputMode
  onBack: () => void
  onGenerate: () => void
}

export function PreviewPage({ input, inputMode, onBack, onGenerate }: PreviewPageProps) {
  const t = useTranslations('preview')

  const summaryStatus = useAtomValue(summaryStatusAtom)
  const summaryReady = summaryStatus === 'done'
  const locale = useLocale()

  const { startSummary } = useSummary(locale)

  return (
    <div className="flex min-h-screen flex-col">
      {inputMode === 'youtube' && (
        <YouTubeContentLoader input={input} onContentReady={startSummary} />
      )}
      {inputMode === 'web-url' && <WebContentLoader input={input} onContentReady={startSummary} />}
      {inputMode === 'text' && <TextContentLoader input={input} onContentReady={startSummary} />}

      <AppHeader>
        <BackButton onClick={onBack} />
        <PodmotionLogo />
      </AppHeader>

      <main className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-8">
          <section>
            <ContentPreview input={input} inputMode={inputMode} />
          </section>
          <div className="h-px bg-border" />
          <AISummary />
        </div>

        <div className="flex flex-col gap-8">
          <SectionTitle>{t('podcastConfig')}</SectionTitle>

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
