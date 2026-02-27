'use client'

import { useAtomValue } from 'jotai'
import { useTranslations } from 'next-intl'

import { useSetStyle } from '@/hooks/use-style-config'
import { styleAtom } from '@/lib/atoms/preview-atoms'
import { STYLE_OPTIONS } from '@/lib/store'

export function StyleSelector() {
  const t = useTranslations('preview')
  const style = useAtomValue(styleAtom)
  const changeStyle = useSetStyle()

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-foreground">{t('style')}</label>
      <div className="flex flex-wrap gap-2">
        {STYLE_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => changeStyle(opt.id)}
            className={`rounded-lg px-3.5 py-1.5 text-sm transition-all ${
              style === opt.id
                ? 'bg-foreground text-background'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {t(`styles.${opt.id}.label`)}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{t(`styles.${style}.description`)}</p>
    </div>
  )
}
