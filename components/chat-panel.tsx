'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Loader2, MessageSquare, Send, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { memo, useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'

interface ChatPanelProps {
  onClose: () => void
}

const transport = new DefaultChatTransport({ api: '/api/chat' })

function ChatPanelInner({ onClose }: ChatPanelProps) {
  const t = useTranslations('workspace')
  const { messages, sendMessage, status } = useChat({ transport })
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const isProcessing = status === 'submitted' || status === 'streaming'

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim() || isProcessing) return
    sendMessage({ text: input })
    setInput('')
  }

  return (
    <div className="flex w-[360px] shrink-0 flex-col border-l border-border">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{t('aiAssistant')}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={onClose}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="h-px bg-border" />

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-3 p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-start">
              <div className="max-w-[88%] rounded-lg bg-muted px-3 py-2 text-sm leading-relaxed text-foreground">
                <p>
                  {t('chatWelcome', {
                    defaultMessage:
                      "Hello! I'm your podcast AI assistant. You can ask me about the video content, optimize scripts, add emotion tags, or adjust dialogue rhythm.",
                  })}
                </p>
              </div>
            </div>
          ) : null}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                  msg.role === 'user' ? 'bg-foreground text-background' : 'bg-muted text-foreground'
                }`}
              >
                {msg.parts.map((part) => {
                  if (part.type === 'text') {
                    return part.text.split('\n').map((line, lineIdx) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <p key={`${msg.id}-${lineIdx}`} className={lineIdx > 0 ? 'mt-1' : ''}>
                        {line}
                      </p>
                    ))
                  }
                  return null
                })}
              </div>
            </div>
          ))}
          {status === 'submitted' ? (
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {t('thinking', { defaultMessage: 'Thinking...' })}
                </span>
              </div>
            </div>
          ) : null}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="border-t border-border p-3">
        <div className="flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder={t('askAnything')}
            className="max-h-[100px] min-h-[36px] resize-none border-border bg-muted text-sm placeholder:text-muted-foreground"
            rows={1}
          />
          <Button
            size="icon"
            className="h-9 w-9 shrink-0 bg-foreground text-background hover:bg-foreground/90"
            onClick={handleSend}
            disabled={!input.trim() || isProcessing}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export const ChatPanel = memo(ChatPanelInner)
