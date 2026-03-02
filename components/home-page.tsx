'use client'

import { ArrowRight, Sparkles, Wand2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { PodmotionLogo } from '@/components/podmotion-logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { isValidYoutubeUrl } from '@/lib/utils/validators'

interface HomePageProps {
  onNavigate: (url: string) => void
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

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border/50 bg-background/80 px-6 py-4 backdrop-blur-xl">
        <PodmotionLogo />
        <span className="text-sm text-muted-foreground">{tc('youtubeToPocast')}</span>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-32">
        <div className="flex max-w-2xl flex-col items-center text-center">
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
            <div className="flex items-center gap-2 rounded-2xl border border-border bg-background p-1.5 transition-colors duration-150 ease-out focus-within:border-foreground/20">
              <Input
                type="url"
                placeholder={t('placeholder')}
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value)
                  if (error) setError('')
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="w-[360px] flex-1 rounded-3xl border-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                size="sm"
                className="gap-1.5 rounded-2xl bg-foreground px-5 text-background hover:bg-foreground/90"
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
      </main>
    </div>
  )
}
