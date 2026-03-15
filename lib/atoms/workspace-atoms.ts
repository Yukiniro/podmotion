import type { ScriptParagraph, VoiceOption } from '@/lib/store'

import { atom } from 'jotai'

export type ScriptStatus = 'idle' | 'loading' | 'streaming' | 'done' | 'error'

export const paragraphsAtom = atom<ScriptParagraph[]>([])
export const scriptStatusAtom = atom<ScriptStatus>('idle')
export const editingParagraphAtom = atom<string | null>(null)

export const voiceAAtom = atom<string>('')
export const voiceBAtom = atom<string>('')

export const voiceListAtom = atom<VoiceOption[]>([])
export type VoiceListStatus = 'idle' | 'loading' | 'done' | 'error'
export const voiceListStatusAtom = atom<VoiceListStatus>('idle')

export const voiceLanguageFilterAtom = atom<string>('English')
export type GenderFilter = 'all' | 'male' | 'female'
export const voiceGenderFilterAAtom = atom<GenderFilter>('all')
export const voiceGenderFilterBAtom = atom<GenderFilter>('all')

export type AudioGenStatus = 'idle' | 'generating' | 'done' | 'error'
export const audioStatusMapAtom = atom<Record<string, AudioGenStatus>>({})

export const playingParagraphAtom = atom<string | null>(null)

export type BatchAudioStatus = 'idle' | 'generating' | 'done'
export const batchAudioStatusAtom = atom<BatchAudioStatus>('idle')

export type AudioPreviewState = 'idle' | 'loading' | 'playing'
export const audioPreviewStateAtom = atom<AudioPreviewState>('idle')
export const audioPreviewActiveIdAtom = atom<string | null>(null)
