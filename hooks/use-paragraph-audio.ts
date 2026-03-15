'use client'

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useEffect, useRef } from 'react'

import { languageAtom } from '@/lib/atoms/preview-atoms'
import {
  audioStatusMapAtom,
  batchAudioStatusAtom,
  paragraphsAtom,
  playingParagraphAtom,
  voiceAAtom,
  voiceBAtom,
} from '@/lib/atoms/workspace-atoms'
import { generateAudio } from '@/lib/services/audio'

export function useParagraphAudio() {
  const [paragraphs, setParagraphs] = useAtom(paragraphsAtom)
  const [audioStatusMap, setAudioStatusMap] = useAtom(audioStatusMapAtom)
  const [currentPlaying, setCurrentPlaying] = useAtom(playingParagraphAtom)
  const batchAudioStatus = useAtomValue(batchAudioStatusAtom)
  const setBatchAudioStatus = useSetAtom(batchAudioStatusAtom)
  const voiceA = useAtomValue(voiceAAtom)
  const voiceB = useAtomValue(voiceBAtom)
  const language = useAtomValue(languageAtom)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const prevVoiceARef = useRef(voiceA)
  const prevVoiceBRef = useRef(voiceB)

  const stopPlaying = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setCurrentPlaying(null)
  }, [setCurrentPlaying])

  const generateAudioForParagraph = useCallback(
    async (paragraphId: string) => {
      const paragraph = paragraphs.find((p) => p.id === paragraphId)
      if (!paragraph || !paragraph.text.trim()) return

      const voiceId = paragraph.speaker === 'A' ? voiceA : voiceB
      if (!voiceId) return

      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      setAudioStatusMap((prev) => ({ ...prev, [paragraphId]: 'generating' }))

      try {
        const result = await generateAudio(paragraph.text, voiceId, language, controller.signal)

        setParagraphs((prev) =>
          prev.map((p) =>
            p.id === paragraphId
              ? { ...p, audioUrl: result.blobUrl, audioDuration: result.duration }
              : p
          )
        )
        setAudioStatusMap((prev) => ({ ...prev, [paragraphId]: 'done' }))

        return result.blobUrl
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        console.error('[useParagraphAudio] Generation error:', err)
        setAudioStatusMap((prev) => ({ ...prev, [paragraphId]: 'error' }))
        return undefined
      }
    },
    [paragraphs, voiceA, voiceB, language, setParagraphs, setAudioStatusMap]
  )

  const playParagraph = useCallback(
    async (paragraphId: string) => {
      if (currentPlaying === paragraphId) {
        stopPlaying()
        return
      }

      stopPlaying()

      const paragraph = paragraphs.find((p) => p.id === paragraphId)
      if (!paragraph) return

      let audioUrl = paragraph.audioUrl
      if (!audioUrl) {
        audioUrl = await generateAudioForParagraph(paragraphId)
        if (!audioUrl) return
      }

      if (!audioRef.current) {
        audioRef.current = new Audio()
      }

      audioRef.current.src = audioUrl
      audioRef.current.onended = () => setCurrentPlaying(null)
      audioRef.current.onerror = () => {
        console.error('[useParagraphAudio] Playback error')
        setCurrentPlaying(null)
      }

      try {
        await audioRef.current.play()
        setCurrentPlaying(paragraphId)
      } catch (err) {
        console.error('[useParagraphAudio] Play failed:', err)
        setCurrentPlaying(null)
      }
    },
    [currentPlaying, paragraphs, stopPlaying, generateAudioForParagraph, setCurrentPlaying]
  )

  const generateAllAudio = useCallback(async () => {
    const pending = paragraphs.filter((p) => !p.audioUrl && p.text.trim())
    if (pending.length === 0) return

    setBatchAudioStatus('generating')
    try {
      for (const p of pending) {
        await generateAudioForParagraph(p.id)
      }
      setBatchAudioStatus('done')
    } catch {
      setBatchAudioStatus('idle')
    }
  }, [paragraphs, generateAudioForParagraph, setBatchAudioStatus])

  useEffect(() => {
    if (prevVoiceARef.current === voiceA && prevVoiceBRef.current === voiceB) return

    const changedSpeaker =
      prevVoiceARef.current !== voiceA && prevVoiceBRef.current !== voiceB
        ? 'both'
        : prevVoiceARef.current !== voiceA
          ? 'A'
          : 'B'

    prevVoiceARef.current = voiceA
    prevVoiceBRef.current = voiceB

    stopPlaying()

    setParagraphs((prev) =>
      prev.map((p) => {
        if (changedSpeaker === 'both' || p.speaker === changedSpeaker) {
          if (p.audioUrl) URL.revokeObjectURL(p.audioUrl)
          return { ...p, audioUrl: undefined, audioDuration: undefined }
        }
        return p
      })
    )

    setAudioStatusMap((prev) => {
      const next = { ...prev }
      for (const p of paragraphs) {
        if (changedSpeaker === 'both' || p.speaker === changedSpeaker) {
          next[p.id] = 'idle'
        }
      }
      return next
    })
  }, [voiceA, voiceB, paragraphs, stopPlaying, setParagraphs, setAudioStatusMap])

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      for (const p of paragraphs) {
        if (p.audioUrl) URL.revokeObjectURL(p.audioUrl)
      }
    }
    // Only run cleanup on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    playParagraph,
    stopPlaying,
    generateAudioForParagraph,
    generateAllAudio,
    audioStatusMap,
    currentPlaying,
    batchAudioStatus,
  }
}
