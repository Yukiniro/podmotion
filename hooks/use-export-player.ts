'use client'

import { useAtom, useAtomValue } from 'jotai'
import { useEffect } from 'react'

import {
  exportCurrentTimeAtom,
  exportPlayingAtom,
  exportTotalDurationAtom,
} from '@/lib/atoms/export-atoms'

export function useExportPlayer() {
  const [playing, setPlaying] = useAtom(exportPlayingAtom)
  const [currentTime, setCurrentTime] = useAtom(exportCurrentTimeAtom)
  const totalDuration = useAtomValue(exportTotalDurationAtom)

  useEffect(() => {
    if (!playing) return
    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= totalDuration) {
          setPlaying(false)
          return 0
        }
        return prev + 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [playing, totalDuration, setCurrentTime, setPlaying])

  const togglePlay = () => setPlaying(!playing)

  return { playing, currentTime, totalDuration, togglePlay }
}
