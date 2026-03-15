'use client'

import type { ScriptParagraph } from '@/lib/store'

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useCallback } from 'react'

import { speakersAtom } from '@/lib/atoms/preview-atoms'
import { editingParagraphAtom, paragraphsAtom } from '@/lib/atoms/workspace-atoms'

export function useParagraphs() {
  const [paragraphs, setParagraphs] = useAtom(paragraphsAtom)
  const setEditingParagraph = useSetAtom(editingParagraphAtom)
  const speakers = useAtomValue(speakersAtom)

  const addParagraph = useCallback(() => {
    const newP: ScriptParagraph = {
      id: `p${Date.now()}`,
      speaker: speakers === 1 ? 'A' : paragraphs.length % 2 === 0 ? 'A' : 'B',
      text: '',
      emotions: [],
    }
    setParagraphs((prev) => [...prev, newP])
    setEditingParagraph(newP.id)
  }, [speakers, paragraphs.length, setParagraphs, setEditingParagraph])

  const deleteParagraph = useCallback(
    (id: string) => {
      setParagraphs((prev) => prev.filter((p) => p.id !== id))
    },
    [setParagraphs]
  )

  const updateText = useCallback(
    (id: string, text: string) => {
      setParagraphs((prev) => prev.map((p) => (p.id === id ? { ...p, text } : p)))
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

  const resetParagraphs = useCallback(
    (initial: ScriptParagraph[]) => {
      setParagraphs(initial)
    },
    [setParagraphs]
  )

  return {
    paragraphs,
    addParagraph,
    deleteParagraph,
    updateText,
    toggleSpeaker,
    resetParagraphs,
  }
}
