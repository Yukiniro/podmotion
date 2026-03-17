'use client'

import { useSetAtom } from 'jotai'
import { useEffect, useRef } from 'react'

import { transcriptAtom, transcriptStatusAtom, videoLoadingAtom } from '@/lib/atoms/preview-atoms'

export function useTextInput(text: string, onContentReady?: (content: string) => void) {
  const setTranscript = useSetAtom(transcriptAtom)
  const setTranscriptStatus = useSetAtom(transcriptStatusAtom)
  const setVideoLoading = useSetAtom(videoLoadingAtom)

  const onContentReadyRef = useRef(onContentReady)
  onContentReadyRef.current = onContentReady
  const didRunRef = useRef(false)

  useEffect(() => {
    setVideoLoading(false)
  }, [setVideoLoading])

  useEffect(() => {
    if (!text || didRunRef.current) return
    didRunRef.current = true

    setTranscript(text)
    setTranscriptStatus('done')
    onContentReadyRef.current?.(text)
  }, [text, setTranscript, setTranscriptStatus])
}
