'use client'

import { useAtomValue } from 'jotai'
import { useTranslations } from 'next-intl'

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

  return (
    <section>
      <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {t('contentSummary')}
      </h3>
      {isLoading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ) : hasError ? (
        <p className="text-sm text-destructive">
          {t('summaryError', { defaultMessage: 'Failed to generate summary. Please try again.' })}
        </p>
      ) : (
        <p className="text-sm leading-relaxed text-foreground/80">
          {summary}
          {isStreaming ? (
            <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-foreground/40" />
          ) : null}
        </p>
      )}
    </section>
  )
}
