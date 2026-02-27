'use client'

import { useAtom, useSetAtom } from 'jotai'
import {
  ArrowLeft,
  Download,
  FileText,
  ImageIcon,
  Music,
  Pause,
  Play,
  RefreshCw,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'

import { PodCraftLogo } from '@/components/podcraft-logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { useExportPlayer } from '@/hooks/use-export-player'
import { coverLoadingAtom, exportDescriptionAtom, exportTitleAtom } from '@/lib/atoms/export-atoms'
import { formatTime } from '@/lib/utils/format'

interface ExportPageProps {
  onBack: () => void
}

export function ExportPage({ onBack }: ExportPageProps) {
  const t = useTranslations('export')
  const tc = useTranslations('common')
  const [coverLoading, setCoverLoading] = useAtom(coverLoadingAtom)
  const [title, setTitle] = useAtom(exportTitleAtom)
  const [description, setDescription] = useAtom(exportDescriptionAtom)
  const { playing, currentTime, totalDuration, togglePlay } = useExportPlayer()

  const setInitialTitle = useSetAtom(exportTitleAtom)
  const setInitialDescription = useSetAtom(exportDescriptionAtom)

  useEffect(() => {
    setInitialTitle('AI in Education -- A Revolution in Personalized Learning')
    setInitialDescription(
      'This episode explores how artificial intelligence is transforming the education landscape, from personalized learning paths to intelligent assessment systems.'
    )
    setCoverLoading(true)
    const timer = setTimeout(() => setCoverLoading(false), 2500)
    return () => clearTimeout(timer)
  }, [setInitialTitle, setInitialDescription, setCoverLoading])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-border px-8 py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {tc('back')}
        </Button>
        <PodCraftLogo />
      </header>

      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center px-6 py-14">
        <div className="animate-fade-in-up mb-10 flex flex-col items-center gap-1">
          <h1 className="text-xl font-semibold text-foreground">{t('title')}</h1>
          <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
        </div>

        <div className="animate-fade-in-up w-full" style={{ animationDelay: '0.1s' }}>
          <div className="flex gap-5">
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
                {t('regenerate')}
              </Button>
            </div>

            <div className="flex flex-1 flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground">{t('fieldTitle')}</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border-border bg-background text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground">{t('fieldDescription')}</label>
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

        <div className="animate-fade-in-up w-full" style={{ animationDelay: '0.2s' }}>
          <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t('preview')}
          </h3>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={togglePlay}>
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

        <div
          className="animate-fade-in-up mt-10 flex flex-col items-center gap-3"
          style={{ animationDelay: '0.3s' }}
        >
          <Button className="gap-2 rounded-lg bg-foreground px-10 py-2.5 text-sm text-background hover:bg-foreground/90">
            <Download className="h-4 w-4" />
            {t('download')}
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
