'use client'

import type { InputMode } from '@/lib/store'

import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { AppHeader } from '@/components/common/app-header'
import { PodmotionLogo } from '@/components/podmotion-logo'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Link } from '@/i18n/navigation'
import { classifyInput, isValidUrl } from '@/lib/utils/validators'

interface HomePageProps {
  onNavigate: (input: string, mode: InputMode) => void
}

export function HomePage({ onNavigate }: HomePageProps) {
  const t = useTranslations('home')
  const tc = useTranslations('common')
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isComposing, setIsComposing] = useState(false)

  const handleSubmit = () => {
    const trimmed = input.trim()
    if (!trimmed) {
      setError(t('errorEmpty'))
      return
    }
    const mode: InputMode = classifyInput(trimmed)
    if (mode === 'youtube' || mode === 'web-url') {
      if (!isValidUrl(trimmed)) {
        setError(t('errorInvalid'))
        return
      }
    } else if (trimmed.length < 50) {
      setError(t('errorTextTooShort'))
      return
    }
    setError('')
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      onNavigate(trimmed, mode)
    }, 800)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader>
        <PodmotionLogo />
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{tc('contentToPodcast')}</span>
          <Link
            href="/agent"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {tc('aiAssistant')}
          </Link>
        </div>
      </AppHeader>

      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-32">
        <div className="flex w-full max-w-2xl flex-col items-center text-center">
          <h1 className="animate-fade-in-up mb-3 text-balance text-[28px] font-semibold leading-tight tracking-tight text-foreground">
            {t('title')}
          </h1>

          <p
            className="animate-fade-in-up mb-12 max-w-md text-pretty text-sm leading-[1.6] text-muted-foreground"
            style={{ animationDelay: '0.08s' }}
          >
            {t('description')}
          </p>

          <div className="animate-fade-in-up w-full max-w-2xl" style={{ animationDelay: '0.16s' }}>
            <div className="rounded-2xl border border-border bg-background transition-colors duration-200 focus-within:border-foreground/20">
              <Textarea
                placeholder={t('placeholder')}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  if (error) setError('')
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
                    e.preventDefault()
                    handleSubmit()
                  }
                }}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
                className="field-sizing-content min-h-[140px] max-h-[300px] w-full resize-none border-0 bg-transparent px-4 pb-2 pt-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
              />

              {/* Bottom toolbar */}
              <div className="flex items-center justify-between px-4 pb-3">
                {error ? (
                  <p className="text-sm text-destructive">{error}</p>
                ) : (
                  <span />
                )}
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  size="icon"
                  className="h-8 w-8 shrink-0 rounded-full bg-foreground text-background hover:bg-foreground/90"
                >
                  {isLoading ? (
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-background/30 border-t-background" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
