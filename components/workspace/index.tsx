'use client'

import { useAtom, useAtomValue } from 'jotai'
import { AlertCircle, Download, Loader2, Plus, Volume2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { SectionTitle } from '@/components/common/section-title'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ParagraphCard } from '@/components/workspace/paragraph-card'
import { VoiceSelector } from '@/components/workspace/voice-selector'
import { WorkspaceHeader } from '@/components/workspace/workspace-header'
import { useExport } from '@/hooks/use-export'
import { useParagraphAudio } from '@/hooks/use-paragraph-audio'
import { useParagraphs } from '@/hooks/use-paragraphs'
import { useScript } from '@/hooks/use-script'
import { speakersAtom } from '@/lib/atoms/preview-atoms'
import { editingParagraphAtom, scriptStatusAtom } from '@/lib/atoms/workspace-atoms'

interface WorkspacePageProps {
  onBack: () => void
}

export function WorkspacePage({ onBack }: WorkspacePageProps) {
  const t = useTranslations('workspace')
  const [editingParagraph, setEditingParagraph] = useAtom(editingParagraphAtom)
  const scriptStatus = useAtomValue(scriptStatusAtom)
  const speakers = useAtomValue(speakersAtom)
  const isSolo = speakers === 1

  const { paragraphs, addParagraph, deleteParagraph, updateText, toggleSpeaker } = useParagraphs()
  const { generate } = useScript()
  const { playParagraph, audioStatusMap, currentPlaying, generateAllAudio, batchAudioStatus } =
    useParagraphAudio()
  const { exportAudio, isExporting, allAudioReady } = useExport()

  const isGenerating = scriptStatus === 'loading' || scriptStatus === 'streaming'
  const hasParagraphs = paragraphs.length > 0
  const showParagraphs =
    (scriptStatus === 'streaming' || scriptStatus === 'done' || scriptStatus === 'idle') &&
    hasParagraphs

  const isBatchGenerating = batchAudioStatus === 'generating'
  const audioReadyCount = paragraphs.filter((p) => p.audioUrl).length
  const totalCount = paragraphs.length

  return (
    <TooltipProvider>
      <div className="flex h-screen flex-col overflow-hidden bg-background">
        <WorkspaceHeader onBack={onBack} onRegenerate={generate} isGenerating={isGenerating} />

        <div className="flex flex-1 overflow-hidden">
          {/* Left panel - Script paragraphs */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <ScrollArea className="flex-1">
              <div className="mx-auto w-full max-w-3xl px-6 py-6">
                <div className="flex flex-col gap-3">
                  {scriptStatus === 'loading' && (
                    <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t('generating')}
                    </div>
                  )}

                  {scriptStatus === 'error' && (
                    <div className="flex flex-col items-center gap-4 py-16 text-center">
                      <AlertCircle className="h-10 w-10 text-destructive" />
                      <p className="text-sm text-muted-foreground">{t('generateError')}</p>
                      <Button variant="outline" size="sm" onClick={generate}>
                        {t('retry')}
                      </Button>
                    </div>
                  )}

                  {showParagraphs && (
                    <>
                      {paragraphs.map((p, idx) => (
                        <div key={p.id} className="duration-300 animate-in fade-in">
                          <ParagraphCard
                            paragraph={p}
                            index={idx}
                            isEditing={editingParagraph === p.id}
                            audioStatus={audioStatusMap[p.id] ?? 'idle'}
                            isPlaying={currentPlaying === p.id}
                            singleSpeaker={isSolo}
                            onToggleSpeaker={toggleSpeaker}
                            onDelete={deleteParagraph}
                            onStartEditing={(id) => setEditingParagraph(id)}
                            onStopEditing={() => setEditingParagraph(null)}
                            onTextChange={updateText}
                            onPlay={playParagraph}
                          />
                        </div>
                      ))}

                      {scriptStatus === 'streaming' && (
                        <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
                          <span className="flex gap-1">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current [animation-delay:150ms]" />
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current [animation-delay:300ms]" />
                          </span>
                          {t('generating')}
                        </div>
                      )}

                      {scriptStatus !== 'streaming' && (
                        <button
                          onClick={addParagraph}
                          className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-3 text-sm text-muted-foreground transition-colors duration-150 ease-out hover:border-foreground/20 hover:text-foreground"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          {t('addSegment')}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Right panel - Settings */}
          {showParagraphs && (
            <div className="flex w-80 shrink-0 flex-col border-l border-border">
              <ScrollArea className="flex-1">
                <div className="flex flex-col gap-6 p-5">
                  <div>
                    <SectionTitle className="mb-3 font-semibold">{t('configPanel')}</SectionTitle>
                    <VoiceSelector />
                  </div>

                  <Separator />

                  <div className="flex flex-col gap-3">
                    <Button
                      className="w-full gap-2"
                      onClick={generateAllAudio}
                      disabled={isBatchGenerating || isGenerating || !hasParagraphs}
                    >
                      {isBatchGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {t('generatingAll')} ({audioReadyCount}/{totalCount})
                        </>
                      ) : (
                        <>
                          <Volume2 className="h-4 w-4" />
                          {t('generateAll')}
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={exportAudio}
                      disabled={!allAudioReady || isExporting}
                    >
                      {isExporting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {t('exporting')}
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4" />
                          {t('export')}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
