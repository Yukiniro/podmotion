'use client'

import type { PodcastStyle } from '@/lib/store'

import { useSetAtom } from 'jotai'
import { useCallback } from 'react'

import { speakersAtom, styleAtom } from '@/lib/atoms/preview-atoms'
import { STYLE_OPTIONS } from '@/lib/store'

export function useSetStyle() {
  const setStyle = useSetAtom(styleAtom)
  const setSpeakers = useSetAtom(speakersAtom)

  return useCallback(
    (newStyle: PodcastStyle) => {
      setStyle(newStyle)
      const opt = STYLE_OPTIONS.find((s) => s.id === newStyle)
      if (opt) setSpeakers(opt.defaultSpeakers)
    },
    [setStyle, setSpeakers]
  )
}
