'use client'

import { ArrowLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'

interface BackButtonProps {
  onClick: () => void
}

export function BackButton({ onClick }: BackButtonProps) {
  const tc = useTranslations('common')

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className="gap-2 text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" />
      {tc('back')}
    </Button>
  )
}
