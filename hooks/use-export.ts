'use client'

import { useAtomValue } from 'jotai'
import { useCallback, useState } from 'react'

import { paragraphsAtom } from '@/lib/atoms/workspace-atoms'

export function useExport() {
  const paragraphs = useAtomValue(paragraphsAtom)
  const [isExporting, setIsExporting] = useState(false)

  const allAudioReady = paragraphs.length > 0 && paragraphs.every((p) => p.audioUrl)

  const exportAudio = useCallback(async () => {
    if (!allAudioReady) return

    setIsExporting(true)
    try {
      const blobs: Blob[] = []
      for (const p of paragraphs) {
        if (!p.audioUrl) continue
        const res = await fetch(p.audioUrl)
        blobs.push(await res.blob())
      }

      const merged = new Blob(blobs, { type: 'audio/mpeg' })
      const url = URL.createObjectURL(merged)
      const a = document.createElement('a')
      a.href = url
      a.download = `podcast-${Date.now()}.mp3`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('[useExport] Export failed:', err)
    } finally {
      setIsExporting(false)
    }
  }, [allAudioReady, paragraphs])

  return { exportAudio, isExporting, allAudioReady }
}
