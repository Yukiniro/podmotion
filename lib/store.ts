'use client'

// Simple state store for PodCraft multi-page flow
export type AppPage = 'home' | 'preview' | 'workspace' | 'export'

export interface VoiceOption {
  id: string
  name: string
  gender: 'male' | 'female'
  description: string
}

export const VOICE_OPTIONS: VoiceOption[] = [
  {
    id: 'male-mature',
    name: 'Mature & Steady',
    gender: 'male',
    description: 'Deep, authoritative male voice',
  },
  {
    id: 'male-young',
    name: 'Youthful & Energetic',
    gender: 'male',
    description: 'Bright, dynamic male voice',
  },
  {
    id: 'male-warm',
    name: 'Warm & Magnetic',
    gender: 'male',
    description: 'Rich, engaging male voice',
  },
  {
    id: 'female-elegant',
    name: 'Intellectual & Elegant',
    gender: 'female',
    description: 'Refined, polished female voice',
  },
  {
    id: 'female-sweet',
    name: 'Lively & Sweet',
    gender: 'female',
    description: 'Warm, cheerful female voice',
  },
  {
    id: 'female-strong',
    name: 'Composed & Grand',
    gender: 'female',
    description: 'Powerful, confident female voice',
  },
]

export type PodcastStyle = 'popular-science' | 'news' | 'interview' | 'casual' | 'narrative'

export interface StyleOption {
  id: PodcastStyle
  label: string
  description: string
  defaultSpeakers: 1 | 2
}

export const STYLE_OPTIONS: StyleOption[] = [
  {
    id: 'popular-science',
    label: 'Popular Science',
    description: 'Easy-to-understand explanations',
    defaultSpeakers: 1,
  },
  {
    id: 'news',
    label: 'News Brief',
    description: 'Formal, objective reporting',
    defaultSpeakers: 1,
  },
  {
    id: 'interview',
    label: 'Deep Interview',
    description: 'In-depth Q&A dialogue',
    defaultSpeakers: 2,
  },
  {
    id: 'casual',
    label: 'Casual Chat',
    description: 'Relaxed conversation style',
    defaultSpeakers: 2,
  },
  {
    id: 'narrative',
    label: 'Storytelling',
    description: 'Immersive narrative',
    defaultSpeakers: 1,
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
  audioStatus: 'none' | 'generating' | 'generated' | 'stale' | 'error'
  audioDuration?: number
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  hasAction?: boolean
  actionLabel?: string
  actionApplied?: boolean
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
