'use client'

import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useRef } from 'react'

import { transcriptStatusAtom, videoLoadingAtom } from '@/lib/atoms/preview-atoms'

export function useVideoLoading(delay = 1500) {
  const setVideoLoading = useSetAtom(videoLoadingAtom)
  const transcriptStatus = useAtomValue(transcriptStatusAtom)
  const alreadyLoaded = useRef(transcriptStatus === 'done')

  useEffect(() => {
    if (alreadyLoaded.current) {
      setVideoLoading(false)
      return
    }
    setVideoLoading(true)
    const timer = setTimeout(() => setVideoLoading(false), delay)
    return () => clearTimeout(timer)
  }, [setVideoLoading, delay])
}
