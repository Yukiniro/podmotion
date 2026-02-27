'use client'

import { ChevronRight, Pause, Play } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { useAudioPlayer } from '@/hooks/use-audio-player'
import { formatTime } from '@/lib/utils/format'

interface PlayerBarProps {
  onExport: () => void
  allGenerated: boolean
}

export function PlayerBar({ onExport, allGenerated }: PlayerBarProps) {
  const t = useTranslations('workspace')
  const { playingAll, currentTime, totalDuration, hasPlayable, togglePlay } = useAudioPlayer()

  return (
    <div className="flex items-center gap-3 border-t border-border px-5 py-3">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={togglePlay}
        disabled={!hasPlayable}
      >
        {playingAll ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
      <div className="flex-1">
        <div className="h-1 w-full rounded-full bg-border">
          <div
            className="h-1 rounded-full bg-foreground/40 transition-all"
            style={{ width: `${totalDuration ? (currentTime / totalDuration) * 100 : 0}%` }}
          />
        </div>
      </div>
      <span className="text-xs tabular-nums text-muted-foreground">
        {formatTime(currentTime)} / {formatTime(totalDuration)}
      </span>
      <Button
        size="sm"
        onClick={onExport}
        disabled={!allGenerated}
        className="gap-1.5 bg-foreground text-xs text-background hover:bg-foreground/90"
      >
        {t('export')}
        <ChevronRight className="h-3 w-3" />
      </Button>
    </div>
  )
}
