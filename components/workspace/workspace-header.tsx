'use client'

import type { ScriptParagraph } from '@/lib/store'

import { useAtomValue } from 'jotai'
import { ArrowLeft, PanelRightClose, PanelRightOpen, RefreshCw, Zap } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { PodCraftLogo } from '@/components/podcraft-logo'
import { Button } from '@/components/ui/button'
import {
  allGeneratedAtom,
  generatingAllAtom,
  generatingProgressAtom,
  paragraphsAtom,
} from '@/lib/atoms/workspace-atoms'

interface WorkspaceHeaderProps {
  onBack: () => void
  showChat: boolean
  onToggleChat: () => void
  onGenerateAll: () => void
  onReset: (initial: ScriptParagraph[]) => void
  initialParagraphs: ScriptParagraph[]
}

export function WorkspaceHeader({
  onBack,
  showChat,
  onToggleChat,
  onGenerateAll,
  onReset,
  initialParagraphs,
}: WorkspaceHeaderProps) {
  const t = useTranslations('workspace')
  const tc = useTranslations('common')
  const paragraphs = useAtomValue(paragraphsAtom)
  const generatingAll = useAtomValue(generatingAllAtom)
  const generatingProgress = useAtomValue(generatingProgressAtom)
  const allGenerated = useAtomValue(allGeneratedAtom)

  return (
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
                paragraphs.filter((p) => p.audioStatus !== 'generated').length + generatingProgress,
            })}
          </span>
        ) : null}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onReset(initialParagraphs)}
          className="gap-1.5 text-xs"
        >
          <RefreshCw className="h-3 w-3" />
          {t('regenerate')}
        </Button>
        <Button
          size="sm"
          onClick={onGenerateAll}
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
          onClick={onToggleChat}
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
  )
}
