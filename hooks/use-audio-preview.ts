'use client'

import { useAtom } from 'jotai'
import { useCallback, useEffect } from 'react'

import {
  audioPreviewActiveIdAtom,
  audioPreviewStateAtom,
} from '@/lib/atoms/workspace-atoms'

let sharedAudio: HTMLAudioElement | null = null

export function useAudioPreview() {
  const [state, setState] = useAtom(audioPreviewStateAtom)
  const [activeId, setActiveId] = useAtom(audioPreviewActiveIdAtom)

  const stop = useCallback(() => {
    if (sharedAudio) {
      sharedAudio.pause()
      sharedAudio.currentTime = 0
      sharedAudio.oncanplaythrough = null
      sharedAudio.onended = null
      sharedAudio.onerror = null
    }
    setState('idle')
    setActiveId(null)
  }, [setState, setActiveId])

  const preview = useCallback(
    (url: string | undefined, id?: string) => {
      if (!url) return

      stop()
      setState('loading')
      setActiveId(id ?? null)

      if (!sharedAudio) sharedAudio = new Audio()

      const currentAudio = sharedAudio
      currentAudio.src = url
      currentAudio.oncanplaythrough = () => {
        currentAudio.play()
        setState('playing')
      }
      currentAudio.onended = () => {
        setState('idle')
        setActiveId(null)
      }
      currentAudio.onerror = () => {
        console.error('[AudioPreview] Failed to load:', url)
        setState('idle')
        setActiveId(null)
      }
      currentAudio.load()
    },
    [stop, setState, setActiveId]
  )

  useEffect(() => {
    return () => {
      stop()
    }
  }, [stop])

  return { state, activeId, preview, stop }
}
