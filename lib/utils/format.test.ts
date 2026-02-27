import { describe, expect, it } from 'vitest'

import { formatTime } from './format'

describe('formatTime', () => {
  it('should format zero seconds', () => {
    expect(formatTime(0)).toBe('00:00')
  })

  it('should format seconds only', () => {
    expect(formatTime(5)).toBe('00:05')
    expect(formatTime(45)).toBe('00:45')
  })

  it('should format minutes and seconds', () => {
    expect(formatTime(60)).toBe('01:00')
    expect(formatTime(90)).toBe('01:30')
    expect(formatTime(125)).toBe('02:05')
  })

  it('should format large durations', () => {
    expect(formatTime(750)).toBe('12:30')
    expect(formatTime(3600)).toBe('60:00')
  })

  it('should floor fractional seconds', () => {
    expect(formatTime(5.7)).toBe('00:05')
    expect(formatTime(61.99)).toBe('01:01')
  })
})
