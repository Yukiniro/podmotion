'use client'

import { useAtom, useAtomValue } from 'jotai'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef } from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import {
  languageAtom,
  summaryAtom,
  summaryStatusAtom,
  transcriptAtom,
  transcriptStatusAtom,
  videoLoadingAtom,
} from '@/lib/atoms/preview-atoms'
import { storage } from '@/lib/storage'

interface CachedTranscript {
  content: string
  lang: string
  availableLangs: string[]
  cachedAt: number
}

interface AISummaryProps {
  videoUrl: string
}

export function AISummary({ videoUrl }: AISummaryProps) {
  const t = useTranslations('preview')
  const videoLoading = useAtomValue(videoLoadingAtom)
  const lang = useAtomValue(languageAtom)

  const [_transcript, setTranscript] = useAtom(transcriptAtom)
  const [transcriptStatus, setTranscriptStatus] = useAtom(transcriptStatusAtom)
  const [summary, setSummary] = useAtom(summaryAtom)
  const [summaryStatus, setSummaryStatus] = useAtom(summaryStatusAtom)

  const abortRef = useRef<AbortController | null>(null)
  const transcriptStatusRef = useRef(transcriptStatus)
  transcriptStatusRef.current = transcriptStatus

  const fetchSummary = useCallback(
    async (transcriptText: string) => {
      setSummaryStatus('loading')
      setSummary('')

      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      try {
        const res = await fetch('/api/summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcript: transcriptText, lang }),
          signal: controller.signal,
        })

        if (!res.ok) throw new Error('Summary request failed')
        if (!res.body) throw new Error('No response body')

        setSummaryStatus('streaming')
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let text = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          text += decoder.decode(value, { stream: true })
          setSummary(text)
        }

        setSummaryStatus('done')
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
        console.error('[summary] Error:', error)
        setSummaryStatus('error')
      }
    },
    [lang, setSummary, setSummaryStatus]
  )

  useEffect(() => {
    if (videoLoading || !videoUrl || transcriptStatusRef.current !== 'idle') return

    const controller = new AbortController()
    const cacheKey = `transcript:${videoUrl}`
    let cancelled = false

    async function loadTranscript() {
      setTranscriptStatus('loading')

      const cached = await storage.getItem<CachedTranscript>(cacheKey)
      if (cached?.content) {
        if (cancelled) return
        setTranscript(cached.content)
        setTranscriptStatus('done')
        fetchSummary(cached.content)
        return
      }

      try {
        const res = await fetch(`/api/transcript?url=${encodeURIComponent(videoUrl)}`, {
          signal: controller.signal,
        })
        if (!res.ok) throw new Error('Transcript fetch failed')
        const data = await res.json()

        if (data.jobId) {
          setTranscriptStatus('loading')
          return
        }

        setTranscript(data.content)
        setTranscriptStatus('done')

        await storage.setItem<CachedTranscript>(cacheKey, {
          content: data.content,
          lang: data.lang,
          availableLangs: data.availableLangs,
          cachedAt: Date.now(),
        })

        fetchSummary(data.content)
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
        console.error('[transcript] Error:', error)
        setTranscriptStatus('error')
      }
    }

    loadTranscript()

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [videoLoading, videoUrl, setTranscript, setTranscriptStatus, fetchSummary])

  useEffect(() => {
    return () => abortRef.current?.abort()
  }, [])

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
