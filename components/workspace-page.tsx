'use client'

import type { ScriptParagraph } from '@/lib/store'
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Clock,
  Loader2,
  PanelRightClose,
  PanelRightOpen,
  Pause,
  Play,
  Plus,
  RefreshCw,
  X,
  Zap,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { PodCraftLogo } from '@/components/podcraft-logo'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { EMOTION_COLORS, EMOTION_LABELS, INTENSITY_LABELS } from '@/lib/store'

const ChatPanel = dynamic(() => import('@/components/chat-panel').then((m) => m.ChatPanel), {
  ssr: false,
})

interface WorkspacePageProps {
  onBack: () => void
  onExport: () => void
}

const INITIAL_PARAGRAPHS: ScriptParagraph[] = [
  {
    id: 'p1',
    speaker: 'A',
    text: "Today we're going to talk about a really fascinating topic -- how artificial intelligence is revolutionizing the education sector. The progress we've been seeing lately is genuinely exciting!",
    emotions: [{ start: 150, end: 175, emotion: 'excited', intensity: 'strong' }],
    audioStatus: 'generated',
    audioDuration: 23,
  },
  {
    id: 'p2',
    speaker: 'B',
    text: 'Absolutely! I came across a video the other day that was all about this. Did you know that some schools are already using AI to create personalized learning paths for every single student?',
    emotions: [{ start: 130, end: 185, emotion: 'surprised', intensity: 'moderate' }],
    audioStatus: 'generated',
    audioDuration: 18,
  },
  {
    id: 'p3',
    speaker: 'A',
    text: 'Yes, and the results are remarkable. The biggest issue with traditional education has always been the one-size-fits-all approach, but every student has a different foundation and learning rhythm.',
    emotions: [{ start: 160, end: 190, emotion: 'serious', intensity: 'moderate' }],
    audioStatus: 'generating',
  },
  {
    id: 'p4',
    speaker: 'B',
    text: "That's incredible! So how exactly does it work? I mean, how does the AI figure out what each student needs?",
    emotions: [{ start: 0, end: 22, emotion: 'excited', intensity: 'strong' }],
    audioStatus: 'none',
  },
  {
    id: 'p5',
    speaker: 'A',
    text: "Great question. It starts by analyzing each student's performance data -- test scores, time spent on problems, areas where they struggle. Then the AI adapts the curriculum in real-time.",
    emotions: [],
    audioStatus: 'none',
  },
]

export function WorkspacePage({ onBack, onExport }: WorkspacePageProps) {
  const t = useTranslations('workspace')
  const tc = useTranslations('common')
  const [paragraphs, setParagraphs] = useState<ScriptParagraph[]>(INITIAL_PARAGRAPHS)
  const [showChat, setShowChat] = useState(true)
  const [playingAll, setPlayingAll] = useState(false)
  const [currentTime] = useState(0)
  const [activeParagraph, setActiveParagraph] = useState<string | null>(null)
  const [editingParagraph, setEditingParagraph] = useState<string | null>(null)
  const [generatingAll, setGeneratingAll] = useState(false)
  const [generatingProgress, setGeneratingProgress] = useState(0)

  const totalDuration = paragraphs.reduce((sum, p) => sum + (p.audioDuration || 0), 0)
  const allGenerated = paragraphs.every((p) => p.audioStatus === 'generated')

  useEffect(() => {
    const timer = setTimeout(() => {
      setParagraphs((prev) =>
        prev.map((p) => (p.id === 'p3' ? { ...p, audioStatus: 'generated', audioDuration: 21 } : p))
      )
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  const handleGenerateSingle = (id: string) => {
    setParagraphs((prev) =>
      prev.map((p) => (p.id === id ? { ...p, audioStatus: 'generating' } : p))
    )
    setTimeout(
      () => {
        setParagraphs((prev) =>
          prev.map((p) =>
            p.id === id
              ? {
                  ...p,
                  audioStatus: 'generated',
                  audioDuration: 12 + Math.floor(Math.random() * 15),
                }
              : p
          )
        )
      },
      2000 + Math.random() * 2000
    )
  }

  const handleGenerateAll = () => {
    setGeneratingAll(true)
    setGeneratingProgress(0)
    const ungenerated = paragraphs.filter((p) => p.audioStatus !== 'generated')
    let count = 0

    ungenerated.forEach((p, i) => {
      setTimeout(() => {
        setParagraphs((prev) =>
          prev.map((pp) => (pp.id === p.id ? { ...pp, audioStatus: 'generating' } : pp))
        )
        setTimeout(() => {
          setParagraphs((prev) =>
            prev.map((pp) =>
              pp.id === p.id
                ? {
                    ...pp,
                    audioStatus: 'generated',
                    audioDuration: 12 + Math.floor(Math.random() * 15),
                  }
                : pp
            )
          )
          count++
          setGeneratingProgress(count)
          if (count === ungenerated.length) {
            setGeneratingAll(false)
          }
        }, 1500)
      }, i * 2000)
    })
  }

  const handleDeleteParagraph = (id: string) => {
    setParagraphs((prev) => prev.filter((p) => p.id !== id))
  }

  const handleAddParagraph = () => {
    const newP: ScriptParagraph = {
      id: `p${Date.now()}`,
      speaker: paragraphs.length % 2 === 0 ? 'A' : 'B',
      text: '',
      emotions: [],
      audioStatus: 'none',
    }
    setParagraphs((prev) => [...prev, newP])
    setEditingParagraph(newP.id)
  }

  const handleTextChange = (id: string, text: string) => {
    setParagraphs((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, text, audioStatus: p.audioStatus === 'generated' ? 'stale' : p.audioStatus }
          : p
      )
    )
  }

  const handleTogglePlay = () => {
    setPlayingAll(!playingAll)
    if (!playingAll) {
      setActiveParagraph(paragraphs[0]?.id || null)
    } else {
      setActiveParagraph(null)
    }
  }

  const getStatusIcon = (status: ScriptParagraph['audioStatus']) => {
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

  return (
    <TooltipProvider>
      <div className="flex h-screen flex-col overflow-hidden bg-background">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-border px-5 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              {tc('back')}
            </Button>
            <div className="h-4 w-px bg-border" />
            <PodCraftLogo />
          </div>
          <div className="flex items-center gap-2">
            {generatingAll ? (
              <span className="text-xs text-muted-foreground">
                {t('generating', {
                  progress: generatingProgress,
                  total:
                    paragraphs.filter((p) => p.audioStatus !== 'generated').length +
                    generatingProgress,
                })}
              </span>
            ) : null}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setParagraphs(
                  INITIAL_PARAGRAPHS.map((p) => ({
                    ...p,
                    audioStatus: 'none',
                    audioDuration: undefined,
                  }))
                )
              }
              className="gap-1.5 text-xs"
            >
              <RefreshCw className="h-3 w-3" />
              {t('regenerate')}
            </Button>
            <Button
              size="sm"
              onClick={handleGenerateAll}
              disabled={generatingAll || allGenerated}
              className="gap-1.5 bg-foreground text-xs text-background hover:bg-foreground/90"
            >
              <Zap className="h-3 w-3" />
              {t('generateAll')}
            </Button>
            <div className="ml-1 h-4 w-px bg-border" />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowChat(!showChat)}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              {showChat ? (
                <PanelRightClose className="h-4 w-4" />
              ) : (
                <PanelRightOpen className="h-4 w-4" />
              )}
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Script Editor */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-2 p-5">
                {paragraphs.map((p, idx) => (
                  <div
                    key={p.id}
                    className={`group rounded-lg border transition-all ${
                      activeParagraph === p.id
                        ? 'border-foreground/15 bg-muted/50'
                        : 'border-transparent hover:bg-muted/30'
                    }`}
                  >
                    {/* Header row */}
                    <div className="flex items-center gap-2 px-4 pb-1 pt-3">
                      <button
                        onClick={() => {
                          setParagraphs((prev) =>
                            prev.map((pp) =>
                              pp.id === p.id
                                ? { ...pp, speaker: pp.speaker === 'A' ? 'B' : 'A' }
                                : pp
                            )
                          )
                        }}
                        className={`rounded px-1.5 py-0.5 text-[11px] font-semibold transition-colors ${
                          p.speaker === 'A'
                            ? 'bg-foreground/10 text-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {p.speaker}
                      </button>
                      <span className="text-[11px] text-muted-foreground">#{idx + 1}</span>
                      <div className="flex-1" />
                      {getStatusIcon(p.audioStatus) ? (
                        <div className="flex items-center gap-1">
                          {getStatusIcon(p.audioStatus)}
                          <span className="text-[11px] text-muted-foreground">
                            {getStatusLabel(p.audioStatus)}
                          </span>
                        </div>
                      ) : null}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground opacity-0 hover:text-destructive group-hover:opacity-100"
                        onClick={() => handleDeleteParagraph(p.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Text */}
                    <div className="px-4 py-2">
                      {editingParagraph === p.id ? (
                        <Textarea
                          value={p.text}
                          onChange={(e) => handleTextChange(p.id, e.target.value)}
                          onBlur={() => setEditingParagraph(null)}
                          autoFocus
                          className="min-h-[60px] resize-none border-0 bg-transparent p-0 text-sm leading-relaxed text-foreground shadow-none focus-visible:ring-0"
                        />
                      ) : (
                        <p
                          className="min-h-[32px] cursor-text text-sm leading-relaxed text-foreground/85"
                          onClick={() => setEditingParagraph(p.id)}
                        >
                          {renderTextWithEmotions(p.text, p.emotions)}
                        </p>
                      )}
                    </div>

                    {/* Audio controls */}
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
                                onClick={() => handleGenerateSingle(p.id)}
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
                          <span className="text-[11px] text-muted-foreground">
                            {t('audioStatus.generating')}
                          </span>
                        </div>
                      ) : p.audioStatus === 'stale' ? (
                        <>
                          <span className="text-[11px] text-amber-600">{t('contentModified')}</span>
                          <div className="flex-1" />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 gap-1 text-[11px] text-amber-600 hover:text-amber-700"
                            onClick={() => handleGenerateSingle(p.id)}
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
                            onClick={() => handleGenerateSingle(p.id)}
                          >
                            <Play className="h-3 w-3" />
                            {t('generate')}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}

                {/* Add Segment */}
                <button
                  onClick={handleAddParagraph}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {t('addSegment')}
                </button>
              </div>
            </ScrollArea>

            {/* Bottom Player */}
            <div className="flex items-center gap-3 border-t border-border px-5 py-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleTogglePlay}
                disabled={!paragraphs.some((p) => p.audioStatus === 'generated')}
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
          </div>

          {/* Right: AI Chat */}
          {showChat ? <ChatPanel onClose={() => setShowChat(false)} /> : null}
        </div>
      </div>
    </TooltipProvider>
  )
}

function renderTextWithEmotions(text: string, emotions: ScriptParagraph['emotions']) {
  if (!emotions.length) return text

  const parts: React.JSX.Element[] = []
  let lastIndex = 0
  const sorted = [...emotions].sort((a, b) => a.start - b.start)

  sorted.forEach((em, i) => {
    const start = Math.min(em.start, text.length)
    const end = Math.min(em.end, text.length)

    if (start > lastIndex) {
      parts.push(<span key={`t${i}`}>{text.slice(lastIndex, start)}</span>)
    }

    const opacity =
      em.intensity === 'slight'
        ? 0.2
        : em.intensity === 'moderate'
          ? 0.35
          : em.intensity === 'strong'
            ? 0.5
            : 0.65

    parts.push(
      <span
        key={`e${i}`}
        className="cursor-help rounded px-0.5"
        style={{
          backgroundColor: `${EMOTION_COLORS[em.emotion]}${Math.round(opacity * 255)
            .toString(16)
            .padStart(2, '0')}`,
        }}
        title={`${EMOTION_LABELS[em.emotion]} - ${INTENSITY_LABELS[em.intensity]}`}
      >
        {text.slice(start, end)}
      </span>
    )
    lastIndex = end
  })

  if (lastIndex < text.length) {
    parts.push(<span key="last">{text.slice(lastIndex)}</span>)
  }

  return <>{parts}</>
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
