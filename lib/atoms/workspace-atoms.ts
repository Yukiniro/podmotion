import type { ScriptParagraph } from '@/lib/store'

import { atom } from 'jotai'

export type ScriptStatus = 'idle' | 'loading' | 'done' | 'error'

export const paragraphsAtom = atom<ScriptParagraph[]>([])
export const scriptStatusAtom = atom<ScriptStatus>('idle')
export const editingParagraphAtom = atom<string | null>(null)
