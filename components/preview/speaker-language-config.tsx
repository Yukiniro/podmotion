'use client'

import { useAtom, useAtomValue } from 'jotai'
import { useTranslations } from 'next-intl'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { languageAtom, speakersAtom, supportedSpeakersAtom } from '@/lib/atoms/preview-atoms'

export function SpeakerLanguageConfig() {
  const t = useTranslations('preview')
  const [speakers, setSpeakers] = useAtom(speakersAtom)
  const [language, setLanguage] = useAtom(languageAtom)
  const supportedSpeakers = useAtomValue(supportedSpeakersAtom)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-foreground">{t('speakers')}</label>
        <Tabs value={String(speakers)} onValueChange={(v) => setSpeakers(Number(v) as 1 | 2)}>
          <TabsList className="w-full">
            <TabsTrigger value="1" className="flex-1" disabled={!supportedSpeakers.includes(1)}>
              {t('solo')}
            </TabsTrigger>
            <TabsTrigger value="2" className="flex-1" disabled={!supportedSpeakers.includes(2)}>
              {t('duo')}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-foreground">{t('language')}</label>
        <Tabs value={language} onValueChange={(v) => setLanguage(v as 'zh' | 'en')}>
          <TabsList className="w-full">
            <TabsTrigger value="en" className="flex-1">
              {t('english')}
            </TabsTrigger>
            <TabsTrigger value="zh" className="flex-1">
              {t('chinese')}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}
