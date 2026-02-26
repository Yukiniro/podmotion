import type { PodcastStyle } from '@/lib/store'

import { atom } from 'jotai'
import { STYLE_OPTIONS } from '@/lib/store'

export const videoLoadingAtom = atom(true)

export const styleAtom = atom<PodcastStyle>('casual')
export const speakersAtom = atom<1 | 2>(2)
export const languageAtom = atom<'zh' | 'en'>('en')
export const voiceAAtom = atom('male-mature')
export const voiceBAtom = atom('female-sweet')

export const styleDescriptionAtom = atom((get) => {
  const style = get(styleAtom)
  return STYLE_OPTIONS.find((s) => s.id === style)?.description ?? ''
})

export const setStyleAtom = atom(null, (_get, set, newStyle: PodcastStyle) => {
  set(styleAtom, newStyle)
  const opt = STYLE_OPTIONS.find((s) => s.id === newStyle)
  if (opt) set(speakersAtom, opt.defaultSpeakers)
})

export const previewConfigAtom = atom((get) => ({
  style: get(styleAtom),
  speakers: get(speakersAtom),
  language: get(languageAtom),
  voiceA: get(voiceAAtom),
  voiceB: get(voiceBAtom),
}))
