'use client'

import { useAtomValue, useSetAtom } from 'jotai'

import { STYLE_OPTIONS } from '@/lib/store'
import { styleAtom, styleDescriptionAtom, setStyleAtom } from '@/lib/atoms/preview-atoms'

export function StyleSelector() {
  const style = useAtomValue(styleAtom)
  const description = useAtomValue(styleDescriptionAtom)
  const changeStyle = useSetAtom(setStyleAtom)

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-foreground">Style</label>
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
            {opt.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  )
}
