'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useAtomValue } from 'jotai'

import { Skeleton } from '@/components/ui/skeleton'
import { videoLoadingAtom } from '@/lib/atoms/preview-atoms'

const MOCK_SUMMARY = `This video explores the latest applications of artificial intelligence in the education sector, covering three core areas: personalized learning paths, intelligent assessment systems, and virtual teaching assistants. Through concrete case studies, the presenter demonstrates how AI can enhance teaching efficiency while also examining the ethical implications and privacy concerns that arise from such technological integration.`

export function AISummary() {
  const t = useTranslations('preview')
  const loading = useAtomValue(videoLoadingAtom)
  const [summaryText, setSummaryText] = useState('')
  const [summaryLoading, setSummaryLoading] = useState(true)

  useEffect(() => {
    if (loading) return
    let i = 0
    const interval = setInterval(() => {
      if (i < MOCK_SUMMARY.length) {
        setSummaryText(MOCK_SUMMARY.slice(0, i + 3))
        i += 3
      } else {
        setSummaryLoading(false)
        clearInterval(interval)
      }
    }, 15)
    return () => clearInterval(interval)
  }, [loading])

  return (
    <section>
      <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {t('contentSummary')}
      </h3>
      {loading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ) : (
        <p className="text-sm leading-relaxed text-foreground/80">
          {summaryText}
          {summaryLoading ? (
            <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-foreground/40" />
          ) : null}
        </p>
      )}
    </section>
  )
}
