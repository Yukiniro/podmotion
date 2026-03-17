'use client'

import { RefreshCw } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { AppHeader } from '@/components/common/app-header'
import { BackButton } from '@/components/common/back-button'
import { PodmotionLogo } from '@/components/podmotion-logo'
import { Button } from '@/components/ui/button'

interface WorkspaceHeaderProps {
  onBack: () => void
  onRegenerate: () => void
  isGenerating: boolean
}

export function WorkspaceHeader({ onBack, onRegenerate, isGenerating }: WorkspaceHeaderProps) {
  const t = useTranslations('workspace')

  return (
    <AppHeader className="py-3">
      <div className="flex items-center gap-3">
        <BackButton onClick={onBack} />
        <div className="h-4 w-px bg-border" />
        <PodmotionLogo />
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onRegenerate}
          disabled={isGenerating}
          className="gap-1.5 text-xs"
        >
          <RefreshCw className={`h-3 w-3 ${isGenerating ? 'animate-spin' : ''}`} />
          {t('regenerate')}
        </Button>
      </div>
    </AppHeader>
  )
}
