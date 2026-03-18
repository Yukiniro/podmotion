'use client'

import type { UIMessage } from 'ai'

import { Message, MessageContent, MessageResponse } from '@/components/ai-elements/message'
import { Tool, ToolContent, ToolHeader } from '@/components/ai-elements/tool'

import { getToolLabel, getToolRenderer } from './tool-registry'

interface AgentMessageProps {
  message: UIMessage
}

// Minimal shape we need from any tool part at runtime
interface AnyToolPart {
  type: string
  state:
    | 'input-streaming'
    | 'input-available'
    | 'approval-requested'
    | 'approval-responded'
    | 'output-available'
    | 'output-error'
    | 'output-denied'
  output?: unknown
  errorText?: string
}

export function AgentMessage({ message }: AgentMessageProps) {
  return (
    <Message from={message.role}>
      <MessageContent>
        {message.parts.map((part, index) => {
          // Plain text — rendered with markdown support
          if (part.type === 'text') {
            return <MessageResponse key={`text-${index}`}>{part.text}</MessageResponse>
          }

          // Tool call parts — 'tool-extractContent', 'tool-generateScript', etc.
          // Note: 'dynamic-tool' does NOT start with 'tool-', so we're always in the static branch
          if (part.type.startsWith('tool-')) {
            const toolName = part.type.replace(/^tool-/, '')
            const label = getToolLabel(toolName)
            const ToolRenderer = getToolRenderer(toolName)
            const toolPart = part as unknown as AnyToolPart
            const isOutputAvailable = toolPart.state === 'output-available'

            return (
              <Tool key={`tool-${index}`} defaultOpen={isOutputAvailable}>
                {/* All our tools are static named tools — type is 'tool-{name}', never 'dynamic-tool' */}
                <ToolHeader
                  type={toolPart.type as `tool-${string}`}
                  state={toolPart.state}
                  title={label}
                />
                {isOutputAvailable && ToolRenderer && toolPart.output !== undefined && (
                  <ToolContent>
                    <ToolRenderer output={toolPart.output} />
                  </ToolContent>
                )}
              </Tool>
            )
          }

          return null
        })}
      </MessageContent>
    </Message>
  )
}
