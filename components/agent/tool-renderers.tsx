'use client'

import type { ScriptParagraph } from '@/lib/store'

import {
  CheckCircle,
  Download,
  FileText,
  Globe,
  Headphones,
  Image as ImageIcon,
  Mic,
  Pause,
  Play,
  Youtube,
} from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { renderTextWithEmotions } from '@/lib/utils/emotion'

interface ExtractContentOutput {
  content: string
  title?: string
  sourceType: 'youtube' | 'web' | 'text'
  language?: string
}

export function ExtractContentRenderer({ output }: { output: ExtractContentOutput }) {
  const icons = {
    youtube: <Youtube className="h-4 w-4 text-red-500" />,
    web: <Globe className="h-4 w-4 text-blue-500" />,
    text: <FileText className="h-4 w-4 text-muted-foreground" />,
  }

  const labels = {
    youtube: 'YouTube transcript',
    web: 'Web page',
    text: 'Text input',
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2 text-sm">
      {icons[output.sourceType]}
      <span className="text-muted-foreground">{labels[output.sourceType]} extracted</span>
      {output.title && (
        <span className="truncate font-medium text-foreground">{output.title}</span>
      )}
      <CheckCircle className="ml-auto h-4 w-4 shrink-0 text-green-500" />
    </div>
  )
}

export function SummaryRenderer({ output }: { output: { summary: string } }) {
  return (
    <Card className="border-muted">
      <CardContent className="p-3">
        <p className="text-sm leading-relaxed text-muted-foreground">{output.summary}</p>
      </CardContent>
    </Card>
  )
}

export function ScriptRenderer({ output }: { output: { paragraphs: ScriptParagraph[] } }) {
  const { paragraphs } = output

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <FileText className="h-4 w-4" />
        <span>{paragraphs.length} paragraphs generated</span>
      </div>
      <ScrollArea className="max-h-[400px]">
        <div className="space-y-2 pr-4">
          {paragraphs.map((p, i) => (
            <div key={p.id} className="rounded-lg border bg-card p-3">
              <div className="mb-1.5 flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {p.speaker === 'A' ? 'Speaker A' : 'Speaker B'}
                </Badge>
                <span className="text-xs text-muted-foreground">#{i + 1}</span>
              </div>
              <p className="text-sm leading-relaxed">
                {p.emotions.length > 0 ? renderTextWithEmotions(p.text, p.emotions) : p.text}
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

interface VoiceRecommendation {
  speaker: string
  voiceId: string
  voiceName: string
  gender: string
  description: string
}

export function VoiceRecommendationRenderer({
  output,
}: {
  output: { recommendations: VoiceRecommendation[]; availableVoices?: unknown[] }
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Mic className="h-4 w-4" />
        <span>Voice recommendations</span>
      </div>
      <div className="grid gap-2">
        {output.recommendations.map((rec) => (
          <Card key={`${rec.speaker}-${rec.voiceId}`} className="border-muted">
            <CardContent className="flex items-center gap-3 p-3">
              <Badge variant="secondary" className="shrink-0">
                Speaker {rec.speaker}
              </Badge>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{rec.voiceName}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {rec.gender} · {rec.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function CoverImageRenderer({
  output,
}: {
  output: { base64: string; mediaType: string }
}) {
  const handleDownload = useCallback(() => {
    const ext = output.mediaType.split('/')[1] || 'png'
    const link = document.createElement('a')
    link.href = `data:${output.mediaType};base64,${output.base64}`
    link.download = `podcast-cover.${ext}`
    link.click()
  }, [output])

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <ImageIcon className="h-4 w-4" />
        <span>Cover image generated</span>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <img
          src={`data:${output.mediaType};base64,${output.base64}`}
          alt="Podcast cover"
          className="aspect-square w-full max-w-[300px] object-cover"
        />
      </div>
      <Button variant="outline" size="sm" onClick={handleDownload}>
        <Download className="mr-1.5 h-3.5 w-3.5" />
        Download
      </Button>
    </div>
  )
}

interface AudioResultItem {
  paragraphId: string
  audioBase64: string
  duration: number
}

export function AudioRenderer({
  output,
}: {
  output: { audioResults: AudioResultItem[] }
}) {
  const [playingId, setPlayingId] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handlePlay = useCallback(
    (item: AudioResultItem) => {
      if (playingId === item.paragraphId) {
        audioRef.current?.pause()
        setPlayingId(null)
        return
      }

      if (audioRef.current) {
        audioRef.current.pause()
      }

      // Convert hex to binary then to blob
      const bytes = new Uint8Array(
        item.audioBase64.match(/.{1,2}/g)?.map((byte) => Number.parseInt(byte, 16)) ?? []
      )
      const blob = new Blob([bytes], { type: 'audio/mpeg' })
      const url = URL.createObjectURL(blob)

      const audio = new Audio(url)
      audio.onended = () => setPlayingId(null)
      audio.play()
      audioRef.current = audio
      setPlayingId(item.paragraphId)
    },
    [playingId]
  )

  const formatDuration = (ms: number) => {
    const s = Math.round(ms / 1000)
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${String(sec).padStart(2, '0')}`
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Headphones className="h-4 w-4" />
        <span>{output.audioResults.length} audio segments generated</span>
      </div>
      <div className="space-y-1.5">
        {output.audioResults.map((item) => (
          <div
            key={item.paragraphId}
            className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2"
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0"
              onClick={() => handlePlay(item)}
            >
              {playingId === item.paragraphId ? (
                <Pause className="h-3.5 w-3.5" />
              ) : (
                <Play className="h-3.5 w-3.5" />
              )}
            </Button>
            <span className="text-sm text-muted-foreground">{item.paragraphId}</span>
            <span className="ml-auto text-xs text-muted-foreground">
              {formatDuration(item.duration)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

