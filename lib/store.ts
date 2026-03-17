'use client'

// Simple state store for Podmotion multi-page flow
export type AppPage = 'home' | 'preview' | 'workspace'

export type InputMode = 'youtube' | 'web-url' | 'text'

export type PodcastStyle = 'popular-science' | 'news' | 'casual'

export interface StyleOption {
  id: PodcastStyle
  label: string
  description: string
  defaultSpeakers: 1 | 2
  supportedSpeakers: (1 | 2)[]
}

export const STYLE_OPTIONS: StyleOption[] = [
  {
    id: 'casual',
    label: 'Casual Chat',
    description: 'Relaxed conversation style',
    defaultSpeakers: 2,
    supportedSpeakers: [1, 2],
  },
  {
    id: 'popular-science',
    label: 'Popular Science',
    description: 'Easy-to-understand explanations',
    defaultSpeakers: 1,
    supportedSpeakers: [1, 2],
  },
  {
    id: 'news',
    label: 'News Brief',
    description: 'Formal, objective reporting',
    defaultSpeakers: 1,
    supportedSpeakers: [1, 2],
  },
]

export type EmotionType =
  | 'happy'
  | 'excited'
  | 'angry'
  | 'sad'
  | 'surprised'
  | 'gentle'
  | 'humorous'
  | 'serious'
export type IntensityType = 'slight' | 'moderate' | 'strong' | 'very-strong'

export interface EmotionMark {
  start: number
  end: number
  emotion: EmotionType
  intensity: IntensityType
}

export interface ScriptParagraph {
  id: string
  speaker: 'A' | 'B'
  text: string
  emotions: EmotionMark[]
  audioUrl?: string
  audioDuration?: number
}

export interface VoiceOption {
  voice_id: string
  voice_name: string
  language: string
  gender: 'male' | 'female'
  description?: string[]
  preview_url?: string
}

export const EMOTION_COLORS: Record<EmotionType, string> = {
  happy: '#FFF3CD',
  excited: '#FFD6D6',
  angry: '#F8D7DA',
  sad: '#D6E9F8',
  surprised: '#E8D5F5',
  gentle: '#D5F5E3',
  humorous: '#FFF0D6',
  serious: '#E2E3E5',
}

export const EMOTION_LABELS: Record<EmotionType, string> = {
  happy: 'Happy',
  excited: 'Excited',
  angry: 'Angry',
  sad: 'Sad',
  surprised: 'Surprised',
  gentle: 'Gentle',
  humorous: 'Humorous',
  serious: 'Serious',
}

export const INTENSITY_LABELS: Record<IntensityType, string> = {
  slight: 'Slight',
  moderate: 'Moderate',
  strong: 'Strong',
  'very-strong': 'Very Strong',
}
