'use client'

import type { GenderFilter } from '@/lib/atoms/workspace-atoms'
import type { VoiceOption } from '@/lib/store'

import { useAtom, useAtomValue } from 'jotai'
import { Loader2, Square, Volume2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCallback } from 'react'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useAudioPreview } from '@/hooks/use-audio-preview'
import { useVoices } from '@/hooks/use-voices'
import { speakersAtom } from '@/lib/atoms/preview-atoms'
import {
  voiceAAtom,
  voiceBAtom,
  voiceGenderFilterAAtom,
  voiceGenderFilterBAtom,
  voiceLanguageFilterAtom,
} from '@/lib/atoms/workspace-atoms'

const GENDER_OPTIONS: GenderFilter[] = ['all', 'male', 'female']

interface SpeakerVoicePickerProps {
  label: string
  voiceId: string
  onVoiceChange: (id: string) => void
  voiceList: VoiceOption[]
  genderFilter: GenderFilter
  onGenderChange: (g: GenderFilter) => void
  isPreviewActive: boolean
  isPreviewLoading: boolean
  onPreview: () => void
  onStopPreview: () => void
  selectPlaceholder: string
  previewTitle: string
  genderLabels: Record<GenderFilter, string>
}

function SpeakerVoicePicker({
  label,
  voiceId,
  onVoiceChange,
  voiceList,
  genderFilter,
  onGenderChange,
  isPreviewActive,
  isPreviewLoading,
  onPreview,
  onStopPreview,
  selectPlaceholder,
  previewTitle,
  genderLabels,
}: SpeakerVoicePickerProps) {
  const handlePreviewClick = () => {
    if (isPreviewActive || isPreviewLoading) {
      onStopPreview()
    } else {
      onPreview()
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] font-medium text-muted-foreground">{label}</label>
      <div className="flex gap-1">
        {GENDER_OPTIONS.map((g) => (
          <button
            key={g}
            onClick={() => onGenderChange(g)}
            className={`rounded-lg px-2 py-0.5 text-[11px] transition-colors duration-150 ease-out ${
              genderFilter === g
                ? 'bg-foreground text-background'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {genderLabels[g]}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1.5">
        <Select value={voiceId} onValueChange={onVoiceChange}>
          <SelectTrigger className="h-9 flex-1 text-xs">
            <SelectValue placeholder={selectPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {voiceList.map((v) => (
              <SelectItem key={v.voice_id} value={v.voice_id} className="text-xs">
                {v.voice_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
          onClick={handlePreviewClick}
          disabled={!voiceId}
          title={previewTitle}
        >
          {isPreviewLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : isPreviewActive ? (
            <Square className="h-3 w-3 fill-current" />
          ) : (
            <Volume2 className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
    </div>
  )
}

export function VoiceSelector() {
  const t = useTranslations('workspace')
  const speakers = useAtomValue(speakersAtom)
  const isSolo = speakers === 1
  const { voicesForA, voicesForB, availableLanguages, voiceListStatus } = useVoices()
  const [voiceA, setVoiceA] = useAtom(voiceAAtom)
  const [voiceB, setVoiceB] = useAtom(voiceBAtom)
  const [languageFilter, setLanguageFilter] = useAtom(voiceLanguageFilterAtom)
  const [genderA, setGenderA] = useAtom(voiceGenderFilterAAtom)
  const [genderB, setGenderB] = useAtom(voiceGenderFilterBAtom)

  const { state: previewState, activeId, preview, stop } = useAudioPreview()

  const handleLanguageChange = useCallback(
    (lang: string) => {
      stop()
      setLanguageFilter(lang)
    },
    [stop, setLanguageFilter]
  )

  const handleVoiceAChange = useCallback(
    (id: string) => {
      stop()
      setVoiceA(id)
    },
    [stop, setVoiceA]
  )

  const handleVoiceBChange = useCallback(
    (id: string) => {
      stop()
      setVoiceB(id)
    },
    [stop, setVoiceB]
  )

  const handleGenderAChange = useCallback(
    (g: GenderFilter) => {
      stop()
      setGenderA(g)
    },
    [stop, setGenderA]
  )

  const handleGenderBChange = useCallback(
    (g: GenderFilter) => {
      stop()
      setGenderB(g)
    },
    [stop, setGenderB]
  )

  const handlePreviewA = useCallback(() => {
    const voice = voicesForA.find((v) => v.voice_id === voiceA)
    preview(voice?.preview_url, voiceA)
  }, [voicesForA, voiceA, preview])

  const handlePreviewB = useCallback(() => {
    const voice = voicesForB.find((v) => v.voice_id === voiceB)
    preview(voice?.preview_url, voiceB)
  }, [voicesForB, voiceB, preview])

  const genderLabels: Record<GenderFilter, string> = {
    all: t('genderAll'),
    male: t('genderMale'),
    female: t('genderFemale'),
  }

  if (voiceListStatus === 'loading') {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-6 w-48" />
        <div className={`grid gap-3 ${isSolo ? 'grid-cols-1' : 'grid-cols-2'}`}>
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          {!isSolo && (
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          )}
        </div>
      </div>
    )
  }

  if (voiceListStatus === 'error') {
    return null
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-medium text-muted-foreground">{t('voiceLanguage')}</span>
        <Select value={languageFilter} onValueChange={handleLanguageChange}>
          <SelectTrigger className="h-8 w-48 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableLanguages.map((lang) => (
              <SelectItem key={lang} value={lang} className="text-xs">
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className={`grid gap-3 ${isSolo ? 'grid-cols-1' : 'grid-cols-2'}`}>
        <SpeakerVoicePicker
          label={isSolo ? t('voice') : t('speakerAVoice')}
          voiceId={voiceA}
          onVoiceChange={handleVoiceAChange}
          voiceList={voicesForA}
          genderFilter={genderA}
          onGenderChange={handleGenderAChange}
          isPreviewActive={activeId === voiceA && previewState === 'playing'}
          isPreviewLoading={activeId === voiceA && previewState === 'loading'}
          onPreview={handlePreviewA}
          onStopPreview={stop}
          selectPlaceholder={t('selectVoice')}
          previewTitle={t('preview')}
          genderLabels={genderLabels}
        />
        {!isSolo && (
          <SpeakerVoicePicker
            label={t('speakerBVoice')}
            voiceId={voiceB}
            onVoiceChange={handleVoiceBChange}
            voiceList={voicesForB}
            genderFilter={genderB}
            onGenderChange={handleGenderBChange}
            isPreviewActive={activeId === voiceB && previewState === 'playing'}
            isPreviewLoading={activeId === voiceB && previewState === 'loading'}
            onPreview={handlePreviewB}
            onStopPreview={stop}
            selectPlaceholder={t('selectVoice')}
            previewTitle={t('preview')}
            genderLabels={genderLabels}
          />
        )}
      </div>
    </div>
  )
}
