'use client'

import { useAtomValue, useSetAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'

import { transcriptAtom, transcriptStatusAtom, videoLoadingAtom } from '@/lib/atoms/preview-atoms'
import { fetchTranscript, TranscriptPendingError } from '@/lib/services/transcript'

export function useTranscript(videoUrl: string, onTranscriptReady?: (content: string) => void) {
  const t = useTranslations('toast')
  const videoLoading = useAtomValue(videoLoadingAtom)
  const transcriptStatus = useAtomValue(transcriptStatusAtom)
  const setTranscript = useSetAtom(transcriptAtom)
  const setTranscriptStatus = useSetAtom(transcriptStatusAtom)

  const statusRef = useRef(transcriptStatus)
  const onReadyRef = useRef(onTranscriptReady)
  onReadyRef.current = onTranscriptReady

  useEffect(() => {
    if (videoLoading || !videoUrl || statusRef.current !== 'idle') return

    const controller = new AbortController()
    let cancelled = false

    async function load() {
      statusRef.current = 'loading'
      setTranscriptStatus('loading')

      try {
        const result = await fetchTranscript(videoUrl, controller.signal)
        if (cancelled) return

        setTranscript(result.content)
        setTranscriptStatus('done')
        statusRef.current = 'done'
        onReadyRef.current?.(result.content)
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
        if (error instanceof TranscriptPendingError) {
          setTranscriptStatus('loading')
          return
        }
        console.error('[transcript] Error:', error)
        toast.error(t('transcriptError'))
        setTranscriptStatus('error')
        statusRef.current = 'error'
      }
    }

    load()

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [videoLoading, videoUrl, setTranscript, setTranscriptStatus])
}
