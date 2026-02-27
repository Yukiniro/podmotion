'use client'

import type { ScriptParagraph } from '@/lib/store'

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'

import { ScrollArea } from '@/components/ui/scroll-area'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ParagraphCard } from '@/components/workspace/paragraph-card'
import { PlayerBar } from '@/components/workspace/player-bar'
import { WorkspaceHeader } from '@/components/workspace/workspace-header'
import { useParagraphs } from '@/hooks/use-paragraphs'
import {
  activeParagraphAtom,
  allGeneratedAtom,
  editingParagraphAtom,
  paragraphsAtom,
  showChatAtom,
} from '@/lib/atoms/workspace-atoms'

const ChatPanel = dynamic(() => import('@/components/chat-panel').then((m) => m.ChatPanel), {
  ssr: false,
})

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

interface WorkspacePageProps {
  onBack: () => void
  onExport: () => void
}

export function WorkspacePage({ onBack, onExport }: WorkspacePageProps) {
  const t = useTranslations('workspace')
  const setParagraphs = useSetAtom(paragraphsAtom)
  const [showChat, setShowChat] = useAtom(showChatAtom)
  const activeParagraph = useAtomValue(activeParagraphAtom)
  const [editingParagraph, setEditingParagraph] = useAtom(editingParagraphAtom)
  const allGenerated = useAtomValue(allGeneratedAtom)

  const {
    paragraphs,
    addParagraph,
    deleteParagraph,
    updateText,
    toggleSpeaker,
    generateSingle,
    generateAll,
    resetParagraphs,
  } = useParagraphs()

  useEffect(() => {
    setParagraphs(INITIAL_PARAGRAPHS)

    const timer = setTimeout(() => {
      setParagraphs((prev) =>
        prev.map((p) =>
          p.id === 'p3' ? { ...p, audioStatus: 'generated' as const, audioDuration: 21 } : p
        )
      )
    }, 3000)
    return () => clearTimeout(timer)
  }, [setParagraphs])

  return (
    <TooltipProvider>
      <div className="flex h-screen flex-col overflow-hidden bg-background">
        <WorkspaceHeader
          onBack={onBack}
          showChat={showChat}
          onToggleChat={() => setShowChat(!showChat)}
          onGenerateAll={generateAll}
          onReset={resetParagraphs}
          initialParagraphs={INITIAL_PARAGRAPHS}
        />

        <div className="flex flex-1 overflow-hidden">
          <div className="flex flex-1 flex-col overflow-hidden">
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-2 p-5">
                {paragraphs.map((p, idx) => (
                  <ParagraphCard
                    key={p.id}
                    paragraph={p}
                    index={idx}
                    isActive={activeParagraph === p.id}
                    isEditing={editingParagraph === p.id}
                    onToggleSpeaker={toggleSpeaker}
                    onDelete={deleteParagraph}
                    onStartEditing={(id) => setEditingParagraph(id)}
                    onStopEditing={() => setEditingParagraph(null)}
                    onTextChange={updateText}
                    onGenerate={generateSingle}
                  />
                ))}

                <button
                  onClick={addParagraph}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {t('addSegment')}
                </button>
              </div>
            </ScrollArea>

            <PlayerBar onExport={onExport} allGenerated={allGenerated} />
          </div>

          {showChat ? <ChatPanel onClose={() => setShowChat(false)} /> : null}
        </div>
      </div>
    </TooltipProvider>
  )
}
