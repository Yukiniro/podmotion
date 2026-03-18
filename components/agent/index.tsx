'use client'

import type { PromptInputMessage } from '@/components/ai-elements/prompt-input'

import { useTranslations } from 'next-intl'

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation'
import { AppHeader } from '@/components/common/app-header'
import { PodmotionLogo } from '@/components/podmotion-logo'
import { useAgentChat } from '@/hooks/use-agent-chat'

import { AgentEmptyState } from './agent-empty-state'
import { AgentInput } from './agent-input'
import { AgentMessage } from './agent-message'

export function AgentContainer() {
  const tc = useTranslations('common')
  const { messages, sendMessage, status, stop } = useAgentChat()

  const hasMessages = messages.length > 0

  const handleSubmit = (msg: PromptInputMessage) => {
    sendMessage({ text: msg.text, files: msg.files })
  }

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage({ text: suggestion })
  }

  return (
    <div className="flex h-screen flex-col">
      <AppHeader>
        <PodmotionLogo />
        <span className="text-sm text-muted-foreground">{tc('aiAssistant')}</span>
      </AppHeader>

      {hasMessages ? (
        <Conversation className="flex-1">
          <ConversationContent>
            {messages.map((message) => (
              <AgentMessage key={message.id} message={message} />
            ))}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      ) : (
        <div className="flex-1 overflow-hidden">
          <AgentEmptyState onSuggestionClick={handleSuggestionClick} />
        </div>
      )}

      <div className="border-t p-4">
        <AgentInput status={status} onSubmit={handleSubmit} onStop={stop} />
      </div>
    </div>
  )
}
