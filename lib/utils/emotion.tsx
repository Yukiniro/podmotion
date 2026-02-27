import type { ScriptParagraph } from '@/lib/store'

import { EMOTION_COLORS, EMOTION_LABELS, INTENSITY_LABELS } from '@/lib/store'

export function renderTextWithEmotions(
  text: string,
  emotions: ScriptParagraph['emotions']
): React.ReactNode {
  if (!emotions.length) return text

  const parts: React.JSX.Element[] = []
  let lastIndex = 0
  const sorted = [...emotions].sort((a, b) => a.start - b.start)

  sorted.forEach((em, i) => {
    const start = Math.min(em.start, text.length)
    const end = Math.min(em.end, text.length)

    if (start > lastIndex) {
      parts.push(<span key={`t${i}`}>{text.slice(lastIndex, start)}</span>)
    }

    const opacity =
      em.intensity === 'slight'
        ? 0.2
        : em.intensity === 'moderate'
          ? 0.35
          : em.intensity === 'strong'
            ? 0.5
            : 0.65

    parts.push(
      <span
        key={`e${i}`}
        className="cursor-help rounded px-0.5"
        style={{
          backgroundColor: `${EMOTION_COLORS[em.emotion]}${Math.round(opacity * 255)
            .toString(16)
            .padStart(2, '0')}`,
        }}
        title={`${EMOTION_LABELS[em.emotion]} - ${INTENSITY_LABELS[em.intensity]}`}
      >
        {text.slice(start, end)}
      </span>
    )
    lastIndex = end
  })

  if (lastIndex < text.length) {
    parts.push(<span key="last">{text.slice(lastIndex)}</span>)
  }

  return <>{parts}</>
}
