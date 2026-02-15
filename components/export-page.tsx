"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Download, Play, Pause, RefreshCw, Music, ImageIcon, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { PodCraftLogo } from "@/components/podcraft-logo"

interface ExportPageProps {
  onBack: () => void
}

export function ExportPage({ onBack }: ExportPageProps) {
  const [coverLoading, setCoverLoading] = useState(true)
  const [title, setTitle] = useState("AI in Education -- A Revolution in Personalized Learning")
  const [description, setDescription] = useState(
    "This episode explores how artificial intelligence is transforming the education landscape, from personalized learning paths to intelligent assessment systems."
  )
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const totalDuration = 750

  useEffect(() => {
    const timer = setTimeout(() => setCoverLoading(false), 2500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!playing) return
    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= totalDuration) {
          setPlaying(false)
          return 0
        }
        return prev + 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [playing, totalDuration])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-8 py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <PodCraftLogo />
      </header>

      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center px-6 py-14">
        {/* Title */}
        <div className="mb-10 flex flex-col items-center gap-1 animate-fade-in-up">
          <h1 className="text-xl font-semibold text-foreground">Your podcast is ready</h1>
          <p className="text-sm text-muted-foreground">Review details and download.</p>
        </div>

        {/* Info */}
        <div
          className="w-full animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex gap-5">
            {/* Cover */}
            <div className="flex shrink-0 flex-col gap-2">
              {coverLoading ? (
                <Skeleton className="h-36 w-36 rounded-lg" />
              ) : (
                <div className="flex h-36 w-36 items-center justify-center rounded-lg bg-muted">
                  <Music className="h-8 w-8 text-muted-foreground/60" />
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-[11px] text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setCoverLoading(true)
                  setTimeout(() => setCoverLoading(false), 2000)
                }}
              >
                <RefreshCw className="h-3 w-3" />
                Regenerate
              </Button>
            </div>

            {/* Fields */}
            <div className="flex flex-1 flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground">Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border-border bg-background text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="resize-none border-border bg-background text-sm leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="my-8 h-px w-full bg-border" />

        {/* Player */}
        <div
          className="w-full animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Preview</h3>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0"
              onClick={() => setPlaying(!playing)}
            >
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <div className="flex-1">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                <div
                  className="h-1.5 rounded-full bg-foreground/30 transition-all"
                  style={{ width: `${(currentTime / totalDuration) * 100}%` }}
                />
              </div>
            </div>
            <span className="text-xs tabular-nums text-muted-foreground">
              {formatTime(currentTime)} / {formatTime(totalDuration)}
            </span>
          </div>
        </div>

        {/* Download */}
        <div
          className="mt-10 flex flex-col items-center gap-3 animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          <Button
            className="gap-2 rounded-lg bg-foreground px-10 py-2.5 text-sm text-background hover:bg-foreground/90"
          >
            <Download className="h-4 w-4" />
            Download (MP3)
          </Button>
          <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Music className="h-3 w-3" />
              podcast.mp3
            </span>
            <span className="flex items-center gap-1">
              <ImageIcon className="h-3 w-3" />
              cover.png
            </span>
            <span className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              metadata.json
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}
