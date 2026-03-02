'use client'

import { useAtomValue, useSetAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef } from 'react'
import { toast } from 'sonner'

import {
  languageAtom,
  speakersAtom,
  styleAtom,
  summaryAtom,
  transcriptAtom,
} from '@/lib/atoms/preview-atoms'
import { paragraphsAtom, scriptStatusAtom } from '@/lib/atoms/workspace-atoms'
import { generateScript } from '@/lib/services/script'

export function useScript() {
  const t = useTranslations('toast')
  const transcript = useAtomValue(transcriptAtom)
  const summary = useAtomValue(summaryAtom)
  const style = useAtomValue(styleAtom)
  const speakers = useAtomValue(speakersAtom)
  const language = useAtomValue(languageAtom)

  const setParagraphs = useSetAtom(paragraphsAtom)
  const setScriptStatus = useSetAtom(scriptStatusAtom)

  const abortRef = useRef<AbortController | null>(null)
  const initializedRef = useRef(false)

  const generate = useCallback(async () => {
    if (!transcript || !summary) return

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setScriptStatus('loading')
    setParagraphs([])

    try {
      const paragraphs = await generateScript({
        transcript,
        summary,
        style,
        speakers,
        language,
        signal: controller.signal,
      })
      setParagraphs(paragraphs)
      setScriptStatus('done')
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      console.error('[script] Error:', error)
      toast.error(t('scriptError'))
      setScriptStatus('error')
    }
  }, [transcript, summary, style, speakers, language, setParagraphs, setScriptStatus])

  useEffect(() => {
    if (initializedRef.current || !transcript || !summary) return
    initializedRef.current = true
    generate()
  }, [transcript, summary, generate])

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
      initializedRef.current = false
    }
  }, [])

  return { generate }
}
