import { atom } from 'jotai'

export const exportTitleAtom = atom('')
export const exportDescriptionAtom = atom('')
export const coverLoadingAtom = atom(true)
export const exportPlayingAtom = atom(false)
export const exportCurrentTimeAtom = atom(0)
export const exportTotalDurationAtom = atom(750)
