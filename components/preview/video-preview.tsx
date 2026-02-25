'use client'

import { useAtomValue } from 'jotai'
import { useTranslations } from 'next-intl'
import { Check, Play } from 'lucide-react'

import { Skeleton } from '@/components/ui/skeleton'
import { videoLoadingAtom } from '@/lib/atoms/preview-atoms'

const MOCK_VIDEO = {
  title: 'How AI is Transforming Education -- Personalized Learning & Beyond',
  duration: '15:32',
  subtitle: 'English (auto-generated)',
}

export function VideoPreview() {
  const t = useTranslations('preview')
  const loading = useAtomValue(videoLoadingAtom)

  if (loading) {
    return (
      <div className="flex gap-4">
        <Skeleton className="h-20 w-36 shrink-0 rounded-lg" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-4">
      <div className="flex h-20 w-36 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Play className="h-6 w-6 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold leading-snug text-foreground">{MOCK_VIDEO.title}</h2>
        <p className="text-sm text-muted-foreground">{MOCK_VIDEO.duration}</p>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <span>
            {t('subtitles')}: {MOCK_VIDEO.subtitle}
          </span>
          <Check className="h-3.5 w-3.5 text-emerald-500" />
        </div>
      </div>
    </div>
  )
}
