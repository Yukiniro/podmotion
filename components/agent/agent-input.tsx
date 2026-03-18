'use client'

import type { ChatStatus } from 'ai'

import type { PromptInputMessage } from '@/components/ai-elements/prompt-input'
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from '@/components/ai-elements/prompt-input'

interface AgentInputProps {
  status: ChatStatus
  onSubmit: (message: PromptInputMessage) => void
  onStop: () => void
}

export function AgentInput({ status, onSubmit, onStop }: AgentInputProps) {
  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text.trim() && message.files.length === 0) return
    onSubmit(message)
  }

  return (
    <PromptInput onSubmit={handleSubmit} accept="text/plain,.txt,.md" multiple>
      <PromptInputTextarea placeholder="Paste a YouTube link, web URL, or type your content..." />
      <PromptInputFooter>
        <PromptInputActionMenu>
          <PromptInputActionMenuTrigger />
          <PromptInputActionMenuContent>
            <PromptInputActionAddAttachments label="Attach text file" />
          </PromptInputActionMenuContent>
        </PromptInputActionMenu>
        <PromptInputSubmit status={status} onStop={onStop} />
      </PromptInputFooter>
    </PromptInput>
  )
}
