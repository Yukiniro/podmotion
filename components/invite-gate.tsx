'use client'

import { KeyRound } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { useState } from 'react'

import { PodmotionLogo } from '@/components/podmotion-logo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export function InviteGate() {
  const t = useTranslations('invite')
  const router = useRouter()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    const trimmed = code.trim()
    if (!trimmed) {
      setError(t('errorEmpty'))
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/verify-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: trimmed }),
      })

      if (res.ok) {
        router.push('/')
        router.refresh()
      } else {
        setError(t('errorInvalid'))
      }
    } catch {
      setError(t('errorNetwork'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="mb-8">
        <PodmotionLogo />
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <KeyRound className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardTitle className="text-xl">{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit()
            }}
            className="flex flex-col gap-4"
          >
            <Input
              type="text"
              placeholder={t('placeholder')}
              value={code}
              onChange={(e) => {
                setCode(e.target.value)
                if (error) setError('')
              }}
              autoFocus
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? t('verifying') : t('submit')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
