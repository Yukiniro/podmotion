'use client'

import { useAtomValue } from 'jotai'
import { Check } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Skeleton } from '@/components/ui/skeleton'
import { YouTubePlayer } from '@/components/ui/youtube-video-player'
import { videoLoadingAtom } from '@/lib/atoms/preview-atoms'

const MOCK_VIDEO = {
  title: 'How AI is Transforming Education -- Personalized Learning & Beyond',
  duration: '15:32',
  subtitle: 'English (auto-generated)',
}

interface VideoPreviewProps {
  videoUrl: string
}

export function VideoPreview({ videoUrl }: VideoPreviewProps) {
  const t = useTranslations('preview')
  const loading = useAtomValue(videoLoadingAtom)

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
      <YouTubePlayer
        videoId={videoUrl}
        title={MOCK_VIDEO.title}
        containerClassName="rounded-lg overflow-hidden"
      />
      <div className="flex flex-col gap-1">
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
