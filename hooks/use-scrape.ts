'use client'

import { useAtomValue, useSetAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'

import {
  transcriptAtom,
  transcriptStatusAtom,
  videoLoadingAtom,
  webPageDomainAtom,
  webPageTitleAtom,
} from '@/lib/atoms/preview-atoms'
import { fetchScrape } from '@/lib/services/scrape'

export function useScrape(webUrl: string, onContentReady?: (content: string) => void) {
  const t = useTranslations('toast')
  const transcriptStatus = useAtomValue(transcriptStatusAtom)
  const setTranscript = useSetAtom(transcriptAtom)
  const setTranscriptStatus = useSetAtom(transcriptStatusAtom)
  const setVideoLoading = useSetAtom(videoLoadingAtom)
  const setWebPageTitle = useSetAtom(webPageTitleAtom)
  const setWebPageDomain = useSetAtom(webPageDomainAtom)

  const statusRef = useRef(transcriptStatus)
  const onReadyRef = useRef(onContentReady)
  onReadyRef.current = onContentReady

  useEffect(() => {
    setVideoLoading(false)
  }, [setVideoLoading])

  useEffect(() => {
    if (!webUrl || statusRef.current !== 'idle') return

    const controller = new AbortController()
    let cancelled = false

    async function load() {
      statusRef.current = 'loading'
      setTranscriptStatus('loading')

      try {
        const result = await fetchScrape(webUrl, controller.signal)
        if (cancelled) return

        setTranscript(result.content)
        setWebPageTitle(result.title)
        setWebPageDomain(result.domain)
        setTranscriptStatus('done')
        statusRef.current = 'done'
        onReadyRef.current?.(result.content)
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
        console.error('[scrape] Error:', error)
        toast.error(t('scrapeError'))
        setTranscriptStatus('error')
        statusRef.current = 'error'
      }
    }

    load()

    return () => {
      cancelled = true
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- t is stable from next-intl
  }, [webUrl, setTranscript, setTranscriptStatus, setWebPageTitle, setWebPageDomain])
}
