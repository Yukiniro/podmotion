export const LOCALE_LANGUAGE_MAP: Record<string, string> = {
  en: 'English',
  zh: 'Chinese',
}

export const AVAILABLE_EMOTIONS = [
  'happy',
  'excited',
  'angry',
  'sad',
  'surprised',
  'gentle',
  'humorous',
  'serious',
] as const

export const AVAILABLE_INTENSITIES = ['slight', 'moderate', 'strong', 'very-strong'] as const

export function resolveLanguage(locale: string): string {
  return LOCALE_LANGUAGE_MAP[locale] || 'English'
}
