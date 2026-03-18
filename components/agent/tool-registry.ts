import type * as React from 'react'

import {
  AudioRenderer,
  CoverImageRenderer,
  ExtractContentRenderer,
  ScriptRenderer,
  SummaryRenderer,
  VoiceRecommendationRenderer,
} from './tool-renderers'

const TOOL_RENDERERS: Record<string, React.ComponentType<{ output: unknown }>> = {
  extractContent: ExtractContentRenderer as React.ComponentType<{ output: unknown }>,
  generateSummary: SummaryRenderer as React.ComponentType<{ output: unknown }>,
  generateScript: ScriptRenderer as React.ComponentType<{ output: unknown }>,
  suggestVoices: VoiceRecommendationRenderer as React.ComponentType<{ output: unknown }>,
  generateCoverImage: CoverImageRenderer as React.ComponentType<{ output: unknown }>,
  generateAudio: AudioRenderer as React.ComponentType<{ output: unknown }>,
}

const TOOL_LABELS: Record<string, string> = {
  extractContent: 'Extracting content',
  generateSummary: 'Generating summary',
  generateScript: 'Writing podcast script',
  suggestVoices: 'Suggesting voices',
  generateCoverImage: 'Creating cover image',
  generateAudio: 'Generating audio',
}

export function getToolRenderer(toolName: string) {
  return TOOL_RENDERERS[toolName]
}

export function getToolLabel(toolName: string): string {
  return TOOL_LABELS[toolName] || toolName
}
