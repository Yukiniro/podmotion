'use client'

import type { ScriptParagraph } from '@/lib/store'

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useCallback } from 'react'

import {
  editingParagraphAtom,
  generatingAllAtom,
  generatingProgressAtom,
  paragraphsAtom,
} from '@/lib/atoms/workspace-atoms'
import { generateAudio } from '@/lib/services/audio'

export function useParagraphs() {
  const [paragraphs, setParagraphs] = useAtom(paragraphsAtom)
  const setEditingParagraph = useSetAtom(editingParagraphAtom)
  const setGeneratingAll = useSetAtom(generatingAllAtom)
  const setGeneratingProgress = useSetAtom(generatingProgressAtom)
  const generatingAll = useAtomValue(generatingAllAtom)

  const addParagraph = useCallback(() => {
    const newP: ScriptParagraph = {
      id: `p${Date.now()}`,
      speaker: paragraphs.length % 2 === 0 ? 'A' : 'B',
      text: '',
      emotions: [],
      audioStatus: 'none',
    }
    setParagraphs((prev) => [...prev, newP])
    setEditingParagraph(newP.id)
  }, [paragraphs.length, setParagraphs, setEditingParagraph])

  const deleteParagraph = useCallback(
    (id: string) => {
      setParagraphs((prev) => prev.filter((p) => p.id !== id))
    },
    [setParagraphs]
  )

  const updateText = useCallback(
    (id: string, text: string) => {
      setParagraphs((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, text, audioStatus: p.audioStatus === 'generated' ? 'stale' : p.audioStatus }
            : p
        )
      )
    },
    [setParagraphs]
  )

  const toggleSpeaker = useCallback(
    (id: string) => {
      setParagraphs((prev) =>
        prev.map((p) => (p.id === id ? { ...p, speaker: p.speaker === 'A' ? 'B' : 'A' } : p))
      )
    },
    [setParagraphs]
  )

  const generateSingle = useCallback(
    async (id: string) => {
      setParagraphs((prev) =>
        prev.map((p) => (p.id === id ? { ...p, audioStatus: 'generating' as const } : p))
      )

      try {
        const paragraph = paragraphs.find((p) => p.id === id)
        const result = await generateAudio(paragraph?.text ?? '', '')
        setParagraphs((prev) =>
          prev.map((p) =>
            p.id === id
              ? { ...p, audioStatus: 'generated' as const, audioDuration: result.duration }
              : p
          )
        )
      } catch {
        setParagraphs((prev) =>
          prev.map((p) => (p.id === id ? { ...p, audioStatus: 'error' as const } : p))
        )
      }
    },
    [paragraphs, setParagraphs]
  )

  const generateAll = useCallback(async () => {
    const ungenerated = paragraphs.filter((p) => p.audioStatus !== 'generated')
    if (ungenerated.length === 0) return

    setGeneratingAll(true)
    setGeneratingProgress(0)

    let count = 0
    for (const p of ungenerated) {
      setParagraphs((prev) =>
        prev.map((pp) => (pp.id === p.id ? { ...pp, audioStatus: 'generating' as const } : pp))
      )

      try {
        const result = await generateAudio(p.text, '')
        setParagraphs((prev) =>
          prev.map((pp) =>
            pp.id === p.id
              ? { ...pp, audioStatus: 'generated' as const, audioDuration: result.duration }
              : pp
          )
        )
      } catch {
        setParagraphs((prev) =>
          prev.map((pp) => (pp.id === p.id ? { ...pp, audioStatus: 'error' as const } : pp))
        )
      }

      count++
      setGeneratingProgress(count)
    }

    setGeneratingAll(false)
  }, [paragraphs, setParagraphs, setGeneratingAll, setGeneratingProgress])

  const resetParagraphs = useCallback(
    (initial: ScriptParagraph[]) => {
      setParagraphs(
        initial.map((p) => ({
          ...p,
          audioStatus: 'none' as const,
          audioDuration: undefined,
        }))
      )
    },
    [setParagraphs]
  )

  return {
    paragraphs,
    generatingAll,
    addParagraph,
    deleteParagraph,
    updateText,
    toggleSpeaker,
    generateSingle,
    generateAll,
    resetParagraphs,
  }
}
