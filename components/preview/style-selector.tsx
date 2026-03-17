'use client'

import { useAtomValue } from 'jotai'
import { useTranslations } from 'next-intl'

import { ChipButton } from '@/components/common/chip-button'
import { FormField } from '@/components/common/form-field'
import { useSetStyle } from '@/hooks/use-style-config'
import { styleAtom } from '@/lib/atoms/preview-atoms'
import { STYLE_OPTIONS } from '@/lib/store'

export function StyleSelector() {
  const t = useTranslations('preview')
  const style = useAtomValue(styleAtom)
  const changeStyle = useSetStyle()

  return (
    <FormField label={t('style')}>
      <div className="flex flex-wrap gap-2">
        {STYLE_OPTIONS.map((opt) => (
          <ChipButton
            key={opt.id}
            size="lg"
            active={style === opt.id}
            onClick={() => changeStyle(opt.id)}
          >
            {t(`styles.${opt.id}.label`)}
          </ChipButton>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{t(`styles.${style}.description`)}</p>
    </FormField>
  )
}
