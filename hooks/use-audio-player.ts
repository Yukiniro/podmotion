'use client'

import { useAtom, useAtomValue } from 'jotai'
import { useCallback } from 'react'

import {
  activeParagraphAtom,
  currentTimeAtom,
  paragraphsAtom,
  playingAllAtom,
  totalDurationAtom,
} from '@/lib/atoms/workspace-atoms'

export function useAudioPlayer() {
  const paragraphs = useAtomValue(paragraphsAtom)
  const totalDuration = useAtomValue(totalDurationAtom)
  const [playingAll, setPlayingAll] = useAtom(playingAllAtom)
  const [currentTime] = useAtom(currentTimeAtom)
  const [activeParagraph, setActiveParagraph] = useAtom(activeParagraphAtom)

  const togglePlay = useCallback(() => {
    if (playingAll) {
      setPlayingAll(false)
      setActiveParagraph(null)
    } else {
      setPlayingAll(true)
      setActiveParagraph(paragraphs[0]?.id ?? null)
    }
  }, [playingAll, paragraphs, setPlayingAll, setActiveParagraph])

  const hasPlayable = paragraphs.some((p) => p.audioStatus === 'generated')

  return {
    playingAll,
    currentTime,
    totalDuration,
    activeParagraph,
    hasPlayable,
    togglePlay,
  }
}
