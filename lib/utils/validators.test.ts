import { describe, expect, it } from 'vitest'

import { isValidYoutubeUrl } from './validators'

describe('isValidYoutubeUrl', () => {
  it('should accept standard youtube watch URLs', () => {
    expect(isValidYoutubeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(true)
    expect(isValidYoutubeUrl('http://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(true)
    expect(isValidYoutubeUrl('https://youtube.com/watch?v=dQw4w9WgXcQ')).toBe(true)
  })

  it('should accept short youtu.be URLs', () => {
    expect(isValidYoutubeUrl('https://youtu.be/dQw4w9WgXcQ')).toBe(true)
    expect(isValidYoutubeUrl('http://youtu.be/abc123')).toBe(true)
  })

  it('should accept youtube shorts URLs', () => {
    expect(isValidYoutubeUrl('https://www.youtube.com/shorts/abc123')).toBe(true)
    expect(isValidYoutubeUrl('https://youtube.com/shorts/xyz789')).toBe(true)
  })

  it('should accept URLs without protocol', () => {
    expect(isValidYoutubeUrl('www.youtube.com/watch?v=abc123')).toBe(true)
    expect(isValidYoutubeUrl('youtube.com/watch?v=abc123')).toBe(true)
    expect(isValidYoutubeUrl('youtu.be/abc123')).toBe(true)
  })

  it('should trim whitespace', () => {
    expect(isValidYoutubeUrl('  https://youtu.be/abc123  ')).toBe(true)
  })

  it('should reject non-youtube URLs', () => {
    expect(isValidYoutubeUrl('https://vimeo.com/123456')).toBe(false)
    expect(isValidYoutubeUrl('https://google.com')).toBe(false)
    expect(isValidYoutubeUrl('not a url')).toBe(false)
    expect(isValidYoutubeUrl('')).toBe(false)
  })

  it('should reject youtube URLs without video path', () => {
    expect(isValidYoutubeUrl('https://www.youtube.com/')).toBe(false)
    expect(isValidYoutubeUrl('https://www.youtube.com/channel/abc')).toBe(false)
  })
})
