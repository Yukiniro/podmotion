'use client'

import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useMemo } from 'react'

import {
  voiceAAtom,
  voiceBAtom,
  voiceGenderFilterAAtom,
  voiceGenderFilterBAtom,
  voiceLanguageFilterAtom,
  voiceListAtom,
  voiceListStatusAtom,
} from '@/lib/atoms/workspace-atoms'
import { fetchVoices } from '@/lib/services/voices'

const SUPPORTED_LANGUAGES = ['English', 'Chinese (Mandarin)'] as const

export function useVoices() {
  const voiceList = useAtomValue(voiceListAtom)
  const voiceListStatus = useAtomValue(voiceListStatusAtom)
  const languageFilter = useAtomValue(voiceLanguageFilterAtom)
  const genderFilterA = useAtomValue(voiceGenderFilterAAtom)
  const genderFilterB = useAtomValue(voiceGenderFilterBAtom)
  const setVoiceList = useSetAtom(voiceListAtom)
  const setVoiceListStatus = useSetAtom(voiceListStatusAtom)
  const setVoiceA = useSetAtom(voiceAAtom)
  const setVoiceB = useSetAtom(voiceBAtom)

  useEffect(() => {
    const controller = new AbortController()
    setVoiceListStatus('loading')

    fetchVoices(controller.signal)
      .then((voices) => {
        setVoiceList(voices)
        setVoiceListStatus('done')
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === 'AbortError') return
        console.error('[useVoices] Error:', err)
        setVoiceListStatus('error')
      })

    return () => controller.abort()
  }, [setVoiceList, setVoiceListStatus])

  const languageVoices = useMemo(
    () => voiceList.filter((v) => v.language === languageFilter),
    [voiceList, languageFilter]
  )

  const voicesForA = useMemo(
    () =>
      genderFilterA === 'all'
        ? languageVoices
        : languageVoices.filter((v) => v.gender === genderFilterA),
    [languageVoices, genderFilterA]
  )

  const voicesForB = useMemo(
    () =>
      genderFilterB === 'all'
        ? languageVoices
        : languageVoices.filter((v) => v.gender === genderFilterB),
    [languageVoices, genderFilterB]
  )

  useEffect(() => {
    if (voicesForA.length === 0) return
    setVoiceA((prev) => {
      if (prev && voicesForA.some((v) => v.voice_id === prev)) return prev
      return voicesForA[0]?.voice_id ?? ''
    })
  }, [voicesForA, setVoiceA])

  useEffect(() => {
    if (voicesForB.length === 0) return
    setVoiceB((prev) => {
      if (prev && voicesForB.some((v) => v.voice_id === prev)) return prev
      return voicesForB[1]?.voice_id ?? voicesForB[0]?.voice_id ?? ''
    })
  }, [voicesForB, setVoiceB])

  return {
    voicesForA,
    voicesForB,
    availableLanguages: SUPPORTED_LANGUAGES,
    voiceListStatus,
  }
}
