import type { ScriptParagraph } from '@/lib/store'

import { atom } from 'jotai'

export const paragraphsAtom = atom<ScriptParagraph[]>([])
export const showChatAtom = atom(true)
export const playingAllAtom = atom(false)
export const currentTimeAtom = atom(0)
export const activeParagraphAtom = atom<string | null>(null)
export const editingParagraphAtom = atom<string | null>(null)
export const generatingAllAtom = atom(false)
export const generatingProgressAtom = atom(0)

export const totalDurationAtom = atom((get) => {
  return get(paragraphsAtom).reduce((sum, p) => sum + (p.audioDuration || 0), 0)
})

export const allGeneratedAtom = atom((get) => {
  return get(paragraphsAtom).every((p) => p.audioStatus === 'generated')
})
