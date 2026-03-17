import type { InputMode } from '@/lib/store'

export function isValidYoutubeUrl(url: string): boolean {
  const pattern = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)/
  return pattern.test(url.trim())
}

export function isValidUrl(url: string): boolean {
  try {
    const withProtocol = url.match(/^https?:\/\//) ? url : `https://${url}`
    const parsed = new URL(withProtocol)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export function classifyInput(input: string): InputMode {
  const trimmed = input.trim()
  if (isValidYoutubeUrl(trimmed)) return 'youtube'
  if (isValidUrl(trimmed)) return 'web-url'
  return 'text'
}
