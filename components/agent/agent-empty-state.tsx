'use client'

import { BotMessageSquareIcon } from 'lucide-react'
import { Suggestion, Suggestions } from '@/components/ai-elements/suggestion'

const SUGGESTIONS = [
  'Create a podcast from a YouTube video',
  'Turn this web article into a podcast',
  'Write a science podcast about space exploration',
  'Generate a news podcast about AI trends',
]

interface AgentEmptyStateProps {
  onSuggestionClick?: (suggestion: string) => void
}

export function AgentEmptyState({ onSuggestionClick }: AgentEmptyStateProps) {
  return (
    <div className="flex size-full flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="rounded-full bg-primary/10 p-4">
        <BotMessageSquareIcon className="h-8 w-8 text-primary" />
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Podmotion AI</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Provide a YouTube link, web URL, text file, or plain text — and I&apos;ll turn it into a
          podcast for you.
        </p>
      </div>

      {onSuggestionClick && (
        <Suggestions>
          {SUGGESTIONS.map((s) => (
            <Suggestion key={s} suggestion={s} onClick={onSuggestionClick} />
          ))}
        </Suggestions>
      )}
    </div>
  )
}
