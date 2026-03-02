'use client'

import { useAtom, useAtomValue } from 'jotai'
import { AlertCircle, Loader2, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ParagraphCard } from '@/components/workspace/paragraph-card'
import { WorkspaceHeader } from '@/components/workspace/workspace-header'
import { useParagraphs } from '@/hooks/use-paragraphs'
import { useScript } from '@/hooks/use-script'
import { editingParagraphAtom, scriptStatusAtom } from '@/lib/atoms/workspace-atoms'

interface WorkspacePageProps {
  onBack: () => void
}

export function WorkspacePage({ onBack }: WorkspacePageProps) {
  const t = useTranslations('workspace')
  const [editingParagraph, setEditingParagraph] = useAtom(editingParagraphAtom)
  const scriptStatus = useAtomValue(scriptStatusAtom)

  const { paragraphs, addParagraph, deleteParagraph, updateText, toggleSpeaker } = useParagraphs()
  const { generate } = useScript()

  const isGenerating = scriptStatus === 'loading'

  return (
    <TooltipProvider>
      <div className="flex h-screen flex-col overflow-hidden bg-background">
        <WorkspaceHeader onBack={onBack} onRegenerate={generate} isGenerating={isGenerating} />

        <ScrollArea className="flex-1">
          <div className="mx-auto w-full max-w-3xl px-6 py-8">
            <div className="flex flex-col gap-3">
              {scriptStatus === 'loading' && (
                <div className="flex flex-col gap-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={`skeleton-${String(i)}`}
                      className="rounded-xl border border-border p-4"
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="mb-2 h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ))}
                  <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t('generating')}
                  </div>
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

              {(scriptStatus === 'done' || scriptStatus === 'idle') && paragraphs.length > 0 && (
                <>
                  {paragraphs.map((p, idx) => (
                    <ParagraphCard
                      key={p.id}
                      paragraph={p}
                      index={idx}
                      isEditing={editingParagraph === p.id}
                      onToggleSpeaker={toggleSpeaker}
                      onDelete={deleteParagraph}
                      onStartEditing={(id) => setEditingParagraph(id)}
                      onStopEditing={() => setEditingParagraph(null)}
                      onTextChange={updateText}
                    />
                  ))}

                  <button
                    onClick={addParagraph}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-3 text-sm text-muted-foreground transition-colors duration-150 ease-out hover:border-foreground/20 hover:text-foreground"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {t('addSegment')}
                  </button>
                </>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    </TooltipProvider>
  )
}
