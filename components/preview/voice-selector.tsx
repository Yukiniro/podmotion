'use client'

import { useState } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { Play, Volume2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { VOICE_OPTIONS } from '@/lib/store'
import { speakersAtom, voiceAAtom, voiceBAtom } from '@/lib/atoms/preview-atoms'

export function VoiceSelector() {
  const speakers = useAtomValue(speakersAtom)
  const [voiceA, setVoiceA] = useAtom(voiceAAtom)
  const [voiceB, setVoiceB] = useAtom(voiceBAtom)
  const [playingVoice, setPlayingVoice] = useState<string | null>(null)

  const handlePlayVoice = (voiceId: string) => {
    setPlayingVoice(voiceId)
    setTimeout(() => setPlayingVoice(null), 2000)
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="text-sm font-medium text-foreground">Voice</label>

      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-xs font-bold text-background">
          A
        </span>
        <Select value={voiceA} onValueChange={setVoiceA}>
          <SelectTrigger className="flex-1 border-border bg-background text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {VOICE_OPTIONS.map((v) => (
              <SelectItem key={v.id} value={v.id}>
                {v.name} ({v.gender === 'male' ? 'M' : 'F'})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handlePlayVoice(voiceA)}
          className="gap-1.5 text-muted-foreground hover:text-foreground"
        >
          {playingVoice === voiceA ? (
            <Volume2 className="h-4 w-4 animate-pulse text-foreground" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          Preview
        </Button>
      </div>

      {speakers === 2 ? (
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-xs font-bold text-muted-foreground">
            B
          </span>
          <Select value={voiceB} onValueChange={setVoiceB}>
            <SelectTrigger className="flex-1 border-border bg-background text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VOICE_OPTIONS.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.name} ({v.gender === 'male' ? 'M' : 'F'})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePlayVoice(voiceB)}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            {playingVoice === voiceB ? (
              <Volume2 className="h-4 w-4 animate-pulse text-foreground" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            Preview
          </Button>
        </div>
      ) : null}
    </div>
  )
}
