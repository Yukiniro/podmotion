'use client'

import { useSetAtom } from 'jotai'
import { useEffect } from 'react'

import { videoLoadingAtom } from '@/lib/atoms/preview-atoms'

export function useVideoLoading(delay = 1500) {
  const setVideoLoading = useSetAtom(videoLoadingAtom)

  useEffect(() => {
    setVideoLoading(true)
    const timer = setTimeout(() => setVideoLoading(false), delay)
    return () => clearTimeout(timer)
  }, [setVideoLoading, delay])
}
