'use client'

import type { InputMode } from '@/lib/store'

import { useAtomValue } from 'jotai'
import { ExternalLink, FileText } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Skeleton } from '@/components/ui/skeleton'
import { YouTubePlayer } from '@/components/ui/youtube-video-player'
import { videoLoadingAtom, webPageDomainAtom, webPageTitleAtom } from '@/lib/atoms/preview-atoms'

interface ContentPreviewProps {
  input: string
  inputMode: InputMode
}

export function ContentPreview({ input, inputMode }: ContentPreviewProps) {
  const t = useTranslations('preview')
  const loading = useAtomValue(videoLoadingAtom)
  const webPageTitle = useAtomValue(webPageTitleAtom)
  const webPageDomain = useAtomValue(webPageDomainAtom)

  if (inputMode === 'youtube') {
    if (loading) {
      return (
        <div className="flex flex-col gap-4">
          <Skeleton className="aspect-video w-full rounded-lg" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-4">
        <YouTubePlayer videoId={input} title="" containerClassName="rounded-lg overflow-hidden" />
      </div>
    )
  }

  if (inputMode === 'web-url') {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4">
        <ExternalLink className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-foreground">{webPageTitle || input}</p>
          <p className="text-xs text-muted-foreground">
            {t('webSource')}: {webPageDomain || new URL(input).hostname}
          </p>
        </div>
      </div>
    )
  }

  // text mode — minimal indicator
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 p-4">
      <FileText className="h-5 w-5 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{t('textInput')}</p>
    </div>
  )
}
