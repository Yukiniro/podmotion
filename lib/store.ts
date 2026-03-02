'use client'

// Simple state store for Podmotion multi-page flow
export type AppPage = 'home' | 'preview' | 'workspace'

export type PodcastStyle = 'popular-science' | 'news' | 'interview' | 'casual' | 'narrative'

export interface StyleOption {
  id: PodcastStyle
  label: string
  description: string
  defaultSpeakers: 1 | 2
  supportedSpeakers: (1 | 2)[]
}

export const STYLE_OPTIONS: StyleOption[] = [
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
  {
    id: 'interview',
    label: 'Deep Interview',
    description: 'In-depth Q&A dialogue',
    defaultSpeakers: 2,
    supportedSpeakers: [2],
  },
  {
    id: 'casual',
    label: 'Casual Chat',
    description: 'Relaxed conversation style',
    defaultSpeakers: 2,
    supportedSpeakers: [1, 2],
  },
  {
    id: 'narrative',
    label: 'Storytelling',
    description: 'Immersive narrative',
    defaultSpeakers: 1,
    supportedSpeakers: [1],
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
