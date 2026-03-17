'use client'

import type { AudioGenStatus } from '@/lib/atoms/workspace-atoms'
import type { ScriptParagraph } from '@/lib/store'

import { Loader2, Pause, Play, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { ChipButton } from '@/components/common/chip-button'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { renderTextWithEmotions } from '@/lib/utils/emotion'
import { formatTime } from '@/lib/utils/format'

interface ParagraphCardProps {
  paragraph: ScriptParagraph
  index: number
  isEditing: boolean
  audioStatus: AudioGenStatus
  isPlaying: boolean
  singleSpeaker?: boolean
  onToggleSpeaker: (id: string) => void
  onDelete: (id: string) => void
  onStartEditing: (id: string) => void
  onStopEditing: () => void
  onTextChange: (id: string, text: string) => void
  onPlay: (id: string) => void
}

export function ParagraphCard({
  paragraph: p,
  index,
  isEditing,
  audioStatus,
  isPlaying,
  singleSpeaker,
  onToggleSpeaker,
  onDelete,
  onStartEditing,
  onStopEditing,
  onTextChange,
  onPlay,
}: ParagraphCardProps) {
  const t = useTranslations('workspace')
  const isGenerating = audioStatus === 'generating'
  const hasAudio = !!p.audioUrl

  return (
    <div className="group rounded-xl border border-transparent transition-all duration-150 ease-out hover:border-border hover:bg-muted/30">
      <div className="flex items-center gap-2 px-4 pb-1 pt-3">
        {!singleSpeaker && (
          <ChipButton
            size="sm"
            active={p.speaker === 'A'}
            className={`font-semibold ${
              p.speaker === 'A'
                ? 'bg-foreground/10 text-foreground'
                : ''
            }`}
            onClick={() => onToggleSpeaker(p.id)}
          >
            {p.speaker}
          </ChipButton>
        )}
        <span className="text-[11px] text-muted-foreground">#{index + 1}</span>

        {hasAudio && p.audioDuration != null && p.audioDuration > 0 && (
          <span className="text-[10px] tabular-nums text-muted-foreground">
            {formatTime(p.audioDuration / 1000)}
          </span>
        )}

        <div className="flex-1" />

        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-foreground"
          onClick={() => onPlay(p.id)}
          disabled={isGenerating || !p.text.trim()}
          title={isPlaying ? t('pause') : t('play')}
        >
          {isGenerating ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : isPlaying ? (
            <Pause className="h-3 w-3" />
          ) : (
            <Play className="h-3 w-3" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground opacity-0 hover:text-destructive group-hover:opacity-100"
          onClick={() => onDelete(p.id)}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      <div className="px-4 py-2 pb-3">
        {isEditing ? (
          <Textarea
            value={p.text}
            onChange={(e) => onTextChange(p.id, e.target.value)}
            onBlur={onStopEditing}
            autoFocus
            className="min-h-[60px] resize-none border-0 bg-transparent p-0 text-sm leading-[1.6] text-foreground shadow-none focus-visible:ring-0"
          />
        ) : (
          <p
            className="min-h-[32px] cursor-text text-sm leading-[1.6] text-muted-foreground"
            onClick={() => onStartEditing(p.id)}
          >
            {renderTextWithEmotions(p.text, p.emotions)}
          </p>
        )}

        {audioStatus === 'error' && (
          <p className="mt-1 text-[11px] text-destructive">{t('generationFailed')}</p>
        )}
      </div>
    </div>
  )
}
