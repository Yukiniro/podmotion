'use client'

import { useAtom } from 'jotai'
import { useTranslations } from 'next-intl'

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { speakersAtom, languageAtom } from '@/lib/atoms/preview-atoms'

export function SpeakerLanguageConfig() {
  const t = useTranslations('preview')
  const [speakers, setSpeakers] = useAtom(speakersAtom)
  const [language, setLanguage] = useAtom(languageAtom)

  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-foreground">{t('speakers')}</label>
        <RadioGroup
          value={String(speakers)}
          onValueChange={(v) => setSpeakers(Number(v) as 1 | 2)}
          className="flex gap-4"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="1" id="s1" />
            <Label htmlFor="s1" className="cursor-pointer text-sm">
              {t('solo')}
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="2" id="s2" />
            <Label htmlFor="s2" className="cursor-pointer text-sm">
              {t('duo')}
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-foreground">{t('language')}</label>
        <RadioGroup
          value={language}
          onValueChange={(v) => setLanguage(v as 'zh' | 'en')}
          className="flex gap-4"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="en" id="en" />
            <Label htmlFor="en" className="cursor-pointer text-sm">
              {t('english')}
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="zh" id="zh" />
            <Label htmlFor="zh" className="cursor-pointer text-sm">
              {t('chinese')}
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}
