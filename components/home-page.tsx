'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ArrowRight, Sparkles, Headphones, Wand2, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PodCraftLogo } from '@/components/podcraft-logo'

interface HomePageProps {
  onNavigate: (url: string) => void
}

function isValidYoutubeUrl(url: string) {
  const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)/
  return pattern.test(url.trim())
}

export function HomePage({ onNavigate }: HomePageProps) {
  const t = useTranslations('home')
  const tc = useTranslations('common')
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = () => {
    if (!url.trim()) {
      setError(t('errorEmpty'))
      return
    }
    if (!isValidYoutubeUrl(url)) {
      setError(t('errorInvalid'))
      return
    }
    setError('')
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      onNavigate(url)
    }, 800)
  }

  const steps = [
    { icon: Sparkles, label: t('steps.aiScript') },
    { icon: Wand2, label: t('steps.emotionTagging') },
    { icon: Headphones, label: t('steps.expressiveAudio') },
    { icon: MessageSquare, label: t('steps.aiChat') },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-8 py-5">
        <PodCraftLogo />
        <span className="text-sm text-muted-foreground">{tc('youtubeToPocast')}</span>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-32">
        <div className="flex max-w-xl flex-col items-center text-center">
          <h1 className="animate-fade-in-up mb-3 text-balance text-4xl font-bold leading-tight tracking-tight text-foreground">
            {t('title')}
          </h1>

          <p
            className="animate-fade-in-up mb-10 max-w-md text-pretty text-base leading-relaxed text-muted-foreground"
            style={{ animationDelay: '0.08s' }}
          >
            {t('description')}
          </p>

          <div className="animate-fade-in-up w-full max-w-lg" style={{ animationDelay: '0.16s' }}>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-background p-1.5 transition-colors focus-within:border-foreground/20">
              <Input
                type="url"
                placeholder={t('placeholder')}
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value)
                  if (error) setError('')
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="flex-1 border-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                size="sm"
                className="gap-1.5 rounded-lg bg-foreground px-5 text-background hover:bg-foreground/90"
              >
                {isLoading ? (
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-background/30 border-t-background" />
                ) : (
                  <>
                    {t('start')}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            </div>
            {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
          </div>
        </div>

        <div
          className="animate-fade-in-up mt-16 flex items-center gap-8"
          style={{ animationDelay: '0.3s' }}
        >
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-2">
              {i > 0 && <div className="mr-6 h-px w-6 bg-border" />}
              <step.icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{step.label}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
