"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, ArrowRight, Play, Check, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PodCraftLogo } from "@/components/podcraft-logo"
import {
  STYLE_OPTIONS,
  VOICE_OPTIONS,
  type PodcastStyle,
} from "@/lib/store"

interface PreviewPageProps {
  videoUrl: string
  onBack: () => void
  onGenerate: (config: PreviewConfig) => void
}

export interface PreviewConfig {
  style: PodcastStyle
  speakers: 1 | 2
  language: "zh" | "en"
  voiceA: string
  voiceB: string
}

const MOCK_VIDEO = {
  title: "How AI is Transforming Education -- Personalized Learning & Beyond",
  duration: "15:32",
  subtitle: "English (auto-generated)",
}

const MOCK_SUMMARY = `This video explores the latest applications of artificial intelligence in the education sector, covering three core areas: personalized learning paths, intelligent assessment systems, and virtual teaching assistants. Through concrete case studies, the presenter demonstrates how AI can enhance teaching efficiency while also examining the ethical implications and privacy concerns that arise from such technological integration.`

export function PreviewPage({ videoUrl, onBack, onGenerate }: PreviewPageProps) {
  const [loading, setLoading] = useState(true)
  const [summaryLoading, setSummaryLoading] = useState(true)
  const [summaryText, setSummaryText] = useState("")
  const [style, setStyle] = useState<PodcastStyle>("casual")
  const [speakers, setSpeakers] = useState<1 | 2>(2)
  const [language, setLanguage] = useState<"zh" | "en">("en")
  const [voiceA, setVoiceA] = useState("male-mature")
  const [voiceB, setVoiceB] = useState("female-sweet")
  const [playingVoice, setPlayingVoice] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (loading) return
    let i = 0
    const interval = setInterval(() => {
      if (i < MOCK_SUMMARY.length) {
        setSummaryText(MOCK_SUMMARY.slice(0, i + 3))
        i += 3
      } else {
        setSummaryLoading(false)
        clearInterval(interval)
      }
    }, 15)
    return () => clearInterval(interval)
  }, [loading])

  const handleStyleChange = (newStyle: PodcastStyle) => {
    setStyle(newStyle)
    const opt = STYLE_OPTIONS.find((s) => s.id === newStyle)
    if (opt) setSpeakers(opt.defaultSpeakers)
  }

  const handlePlayVoice = (voiceId: string) => {
    setPlayingVoice(voiceId)
    setTimeout(() => setPlayingVoice(null), 2000)
  }

  const handleGenerate = () => {
    onGenerate({ style, speakers, language, voiceA, voiceB })
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-8 py-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <PodCraftLogo />
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-10">
        {/* Video Info */}
        <section>
          {loading ? (
            <div className="flex gap-4">
              <Skeleton className="h-20 w-36 shrink-0 rounded-lg" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          ) : (
            <div className="flex gap-4">
              <div className="flex h-20 w-36 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Play className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-base font-semibold leading-snug text-foreground">
                  {MOCK_VIDEO.title}
                </h2>
                <p className="text-sm text-muted-foreground">{MOCK_VIDEO.duration}</p>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <span>Subtitles: {MOCK_VIDEO.subtitle}</span>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                </div>
              </div>
            </div>
          )}
        </section>

        <div className="h-px bg-border" />

        {/* AI Summary */}
        <section>
          <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Content Summary
          </h3>
          {loading ? (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-foreground/80">
              {summaryText}
              {summaryLoading && (
                <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-foreground/40" />
              )}
            </p>
          )}
        </section>

        <div className="h-px bg-border" />

        {/* Configuration */}
        <section className="flex flex-col gap-8">
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Podcast Configuration
          </h3>

          {/* Style */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-foreground">Style</label>
            <div className="flex flex-wrap gap-2">
              {STYLE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleStyleChange(opt.id)}
                  className={`rounded-lg px-3.5 py-1.5 text-sm transition-all ${
                    style === opt.id
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {STYLE_OPTIONS.find((s) => s.id === style)?.description}
            </p>
          </div>

          {/* Speakers & Language */}
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-foreground">Speakers</label>
              <RadioGroup
                value={String(speakers)}
                onValueChange={(v) => setSpeakers(Number(v) as 1 | 2)}
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="1" id="s1" />
                  <Label htmlFor="s1" className="cursor-pointer text-sm">Solo</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="2" id="s2" />
                  <Label htmlFor="s2" className="cursor-pointer text-sm">Duo</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-foreground">Language</label>
              <RadioGroup
                value={language}
                onValueChange={(v) => setLanguage(v as "zh" | "en")}
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="en" id="en" />
                  <Label htmlFor="en" className="cursor-pointer text-sm">English</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="zh" id="zh" />
                  <Label htmlFor="zh" className="cursor-pointer text-sm">Chinese</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Voice */}
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
                      {v.name} ({v.gender === "male" ? "M" : "F"})
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

            {speakers === 2 && (
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
                        {v.name} ({v.gender === "male" ? "M" : "F"})
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
            )}
          </div>
        </section>

        {/* Generate */}
        <div className="flex justify-center pb-10 pt-4">
          <Button
            onClick={handleGenerate}
            className="gap-2 rounded-lg bg-foreground px-8 py-2.5 text-sm text-background hover:bg-foreground/90"
          >
            Generate Podcast Script
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  )
}
