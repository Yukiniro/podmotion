import type { PodcastStyle } from '@/lib/store'

import { atom } from 'jotai'
import { STYLE_OPTIONS } from '@/lib/store'

export const videoLoadingAtom = atom(true)

export const styleAtom = atom<PodcastStyle>('casual')
export const speakersAtom = atom<1 | 2>(2)
export const languageAtom = atom<'zh' | 'en'>('en')

export const styleDescriptionAtom = atom((get) => {
  const style = get(styleAtom)
  return STYLE_OPTIONS.find((s) => s.id === style)?.description ?? ''
})

export const supportedSpeakersAtom = atom((get) => {
  const style = get(styleAtom)
  return STYLE_OPTIONS.find((s) => s.id === style)?.supportedSpeakers ?? [1, 2]
})

export const previewConfigAtom = atom((get) => ({
  style: get(styleAtom),
  speakers: get(speakersAtom),
  language: get(languageAtom),
}))

export type TranscriptStatus = 'idle' | 'loading' | 'done' | 'error'
export type SummaryStatus = 'idle' | 'loading' | 'streaming' | 'done' | 'error'

export const transcriptAtom = atom<string>('')
export const transcriptLangAtom = atom<string>('')
export const transcriptStatusAtom = atom<TranscriptStatus>('idle')

export const summaryAtom = atom<string>('')
export const summaryStatusAtom = atom<SummaryStatus>('idle')
