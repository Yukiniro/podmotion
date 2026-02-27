'use client'

import type { ScriptParagraph } from '@/lib/store'

import { AlertCircle, CheckCircle2, Clock, Loader2, Play, RefreshCw, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { renderTextWithEmotions } from '@/lib/utils/emotion'

interface ParagraphCardProps {
  paragraph: ScriptParagraph
  index: number
  isActive: boolean
  isEditing: boolean
  onToggleSpeaker: (id: string) => void
  onDelete: (id: string) => void
  onStartEditing: (id: string) => void
  onStopEditing: () => void
  onTextChange: (id: string, text: string) => void
  onGenerate: (id: string) => void
}

function getStatusIcon(status: ScriptParagraph['audioStatus']) {
  switch (status) {
    case 'generated':
      return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
    case 'generating':
      return <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
    case 'stale':
      return <Clock className="h-3.5 w-3.5 text-amber-500" />
    case 'error':
      return <AlertCircle className="h-3.5 w-3.5 text-destructive" />
    default:
      return null
  }
}

export function ParagraphCard({
  paragraph: p,
  index,
  isActive,
  isEditing,
  onToggleSpeaker,
  onDelete,
  onStartEditing,
  onStopEditing,
  onTextChange,
  onGenerate,
}: ParagraphCardProps) {
  const t = useTranslations('workspace')

  const getStatusLabel = (status: ScriptParagraph['audioStatus']) => {
    switch (status) {
      case 'generated':
        return t('audioStatus.ready')
      case 'generating':
        return t('audioStatus.generating')
      case 'stale':
        return t('audioStatus.modified')
      case 'error':
        return t('audioStatus.failed')
      default:
        return t('audioStatus.pending')
    }
  }

  const statusIcon = getStatusIcon(p.audioStatus)

  return (
    <div
      className={`group rounded-lg border transition-all ${
        isActive ? 'border-foreground/15 bg-muted/50' : 'border-transparent hover:bg-muted/30'
      }`}
    >
      <div className="flex items-center gap-2 px-4 pb-1 pt-3">
        <button
          onClick={() => onToggleSpeaker(p.id)}
          className={`rounded px-1.5 py-0.5 text-[11px] font-semibold transition-colors ${
            p.speaker === 'A'
              ? 'bg-foreground/10 text-foreground'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {p.speaker}
        </button>
        <span className="text-[11px] text-muted-foreground">#{index + 1}</span>
        <div className="flex-1" />
        {statusIcon ? (
          <div className="flex items-center gap-1">
            {statusIcon}
            <span className="text-[11px] text-muted-foreground">
              {getStatusLabel(p.audioStatus)}
            </span>
          </div>
        ) : null}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground opacity-0 hover:text-destructive group-hover:opacity-100"
          onClick={() => onDelete(p.id)}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      <div className="px-4 py-2">
        {isEditing ? (
          <Textarea
            value={p.text}
            onChange={(e) => onTextChange(p.id, e.target.value)}
            onBlur={onStopEditing}
            autoFocus
            className="min-h-[60px] resize-none border-0 bg-transparent p-0 text-sm leading-relaxed text-foreground shadow-none focus-visible:ring-0"
          />
        ) : (
          <p
            className="min-h-[32px] cursor-text text-sm leading-relaxed text-foreground/85"
            onClick={() => onStartEditing(p.id)}
          >
            {renderTextWithEmotions(p.text, p.emotions)}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 px-4 pb-3">
        {p.audioStatus === 'generated' ? (
          <>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Play className="h-3 w-3" />
            </Button>
            <div className="flex-1">
              <div className="h-1 w-full rounded-full bg-border">
                <div className="h-1 w-0 rounded-full bg-foreground/40 transition-all" />
              </div>
            </div>
            <span className="text-[11px] tabular-nums text-muted-foreground">
              0:{String(p.audioDuration || 0).padStart(2, '0')}
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground opacity-0 hover:text-foreground group-hover:opacity-100"
                  onClick={() => onGenerate(p.id)}
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t('regenerateAudio')}</TooltipContent>
            </Tooltip>
          </>
        ) : p.audioStatus === 'generating' ? (
          <div className="flex items-center gap-2 py-0.5">
            <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
            <span className="text-[11px] text-muted-foreground">{t('audioStatus.generating')}</span>
          </div>
        ) : p.audioStatus === 'stale' ? (
          <>
            <span className="text-[11px] text-amber-600">{t('contentModified')}</span>
            <div className="flex-1" />
            <Button
              size="sm"
              variant="ghost"
              className="h-6 gap-1 text-[11px] text-amber-600 hover:text-amber-700"
              onClick={() => onGenerate(p.id)}
            >
              <RefreshCw className="h-3 w-3" />
              {t('regenerate')}
            </Button>
          </>
        ) : (
          <>
            <span className="text-[11px] text-muted-foreground">{t('noAudio')}</span>
            <div className="flex-1" />
            <Button
              size="sm"
              className="h-6 gap-1 rounded-md bg-foreground text-[11px] text-background hover:bg-foreground/90"
              onClick={() => onGenerate(p.id)}
            >
              <Play className="h-3 w-3" />
              {t('generate')}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
