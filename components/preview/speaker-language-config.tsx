'use client'

import { useAtom } from 'jotai'

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { speakersAtom, languageAtom } from '@/lib/atoms/preview-atoms'

export function SpeakerLanguageConfig() {
  const [speakers, setSpeakers] = useAtom(speakersAtom)
  const [language, setLanguage] = useAtom(languageAtom)

  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-foreground">Speakers</label>
        <RadioGroup
          value={String(speakers)}
          onValueChange={(v) => setSpeakers(Number(v) as 1 | 2)}
          className="flex gap-4"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="1" id="s1" />
            <Label htmlFor="s1" className="cursor-pointer text-sm">
              Solo
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="2" id="s2" />
            <Label htmlFor="s2" className="cursor-pointer text-sm">
              Duo
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-foreground">Language</label>
        <RadioGroup
          value={language}
          onValueChange={(v) => setLanguage(v as 'zh' | 'en')}
          className="flex gap-4"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="en" id="en" />
            <Label htmlFor="en" className="cursor-pointer text-sm">
              English
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="zh" id="zh" />
            <Label htmlFor="zh" className="cursor-pointer text-sm">
              Chinese
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}
