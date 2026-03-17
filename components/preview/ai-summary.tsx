'use client'

import { useAtomValue } from 'jotai'
import { useTranslations } from 'next-intl'

import { SectionTitle } from '@/components/common/section-title'
import { Skeleton } from '@/components/ui/skeleton'
import {
  summaryAtom,
  summaryStatusAtom,
  transcriptStatusAtom,
  videoLoadingAtom,
} from '@/lib/atoms/preview-atoms'

export function AISummary() {
  const t = useTranslations('preview')
  const videoLoading = useAtomValue(videoLoadingAtom)
  const transcriptStatus = useAtomValue(transcriptStatusAtom)
  const summary = useAtomValue(summaryAtom)
  const summaryStatus = useAtomValue(summaryStatusAtom)

  const isLoading = videoLoading || transcriptStatus === 'loading' || summaryStatus === 'loading'
  const isStreaming = summaryStatus === 'streaming'
  const hasError = transcriptStatus === 'error' || summaryStatus === 'error'

  function renderContent() {
    if (isLoading) {
      return (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      )
    }

    if (hasError) {
      return (
        <p className="text-sm text-destructive">
          {t('summaryError', { defaultMessage: 'Failed to generate summary. Please try again.' })}
        </p>
      )
    }

    return (
      <p className="text-sm leading-[1.6] text-muted-foreground">
        {summary}
        {isStreaming && (
          <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-foreground/40" />
        )}
      </p>
    )
  }

  return (
    <section>
      <SectionTitle className="mb-3">{t('contentSummary')}</SectionTitle>
      {renderContent()}
    </section>
  )
}
