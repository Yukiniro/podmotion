'use client'

import { useAtomValue, useSetAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef } from 'react'
import { toast } from 'sonner'

import { summaryAtom, summaryStatusAtom } from '@/lib/atoms/preview-atoms'
import { streamSummary } from '@/lib/services/summary'

export function useSummary(lang: string) {
  const t = useTranslations('toast')
  const setSummary = useSetAtom(summaryAtom)
  const setSummaryStatus = useSetAtom(summaryStatusAtom)
  const summaryStatus = useAtomValue(summaryStatusAtom)
  const summaryStatusRef = useRef(summaryStatus)
  summaryStatusRef.current = summaryStatus
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    return () => abortRef.current?.abort()
  }, [])

  const startSummary = useCallback(
    async (transcript: string) => {
      if (summaryStatusRef.current === 'done') return

      setSummaryStatus('loading')
      setSummary('')

      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      try {
        setSummaryStatus('streaming')
        await streamSummary(transcript, lang, {
          signal: controller.signal,
          onChunk: (text) => setSummary(text),
        })
        setSummaryStatus('done')
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
        console.error('[summary] Error:', error)
        toast.error(t('summaryError'))
        setSummaryStatus('error')
      }
    },
    [lang, setSummary, setSummaryStatus]
  )

  return { startSummary }
}
