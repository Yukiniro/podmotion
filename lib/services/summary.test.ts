import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { streamSummary } from './summary'

describe('streamSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    globalThis.fetch = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should stream chunks and call onChunk with accumulated text', async () => {
    const chunks = [new TextEncoder().encode('Hello '), new TextEncoder().encode('world')]
    let readIndex = 0

    const mockReader = {
      read: vi.fn(() => {
        if (readIndex < chunks.length) {
          return Promise.resolve({ done: false, value: chunks[readIndex++] })
        }
        return Promise.resolve({ done: true, value: undefined })
      }),
    }

    vi.mocked(globalThis.fetch).mockResolvedValue({
      ok: true,
      body: { getReader: () => mockReader },
    } as unknown as Response)

    const onChunk = vi.fn()
    const result = await streamSummary('some transcript', 'en', { onChunk })

    expect(result).toBe('Hello world')
    expect(onChunk).toHaveBeenCalledTimes(2)
    expect(onChunk).toHaveBeenNthCalledWith(1, 'Hello ')
    expect(onChunk).toHaveBeenNthCalledWith(2, 'Hello world')
  })

  it('should throw on non-ok response', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValue({
      ok: false,
      status: 500,
    } as Response)

    await expect(streamSummary('transcript', 'en', { onChunk: vi.fn() })).rejects.toThrow(
      'Summary request failed'
    )
  })

  it('should throw when response body is null', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValue({
      ok: true,
      body: null,
    } as Response)

    await expect(streamSummary('transcript', 'en', { onChunk: vi.fn() })).rejects.toThrow(
      'No response body'
    )
  })

  it('should send correct request body', async () => {
    const mockReader = {
      read: vi.fn().mockResolvedValue({ done: true, value: undefined }),
    }

    vi.mocked(globalThis.fetch).mockResolvedValue({
      ok: true,
      body: { getReader: () => mockReader },
    } as unknown as Response)

    await streamSummary('my transcript', 'zh', { onChunk: vi.fn() })

    expect(globalThis.fetch).toHaveBeenCalledWith('/api/summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript: 'my transcript', lang: 'zh' }),
      signal: undefined,
    })
  })

  it('should pass abort signal to fetch', async () => {
    const mockReader = {
      read: vi.fn().mockResolvedValue({ done: true, value: undefined }),
    }

    vi.mocked(globalThis.fetch).mockResolvedValue({
      ok: true,
      body: { getReader: () => mockReader },
    } as unknown as Response)

    const controller = new AbortController()
    await streamSummary('transcript', 'en', {
      signal: controller.signal,
      onChunk: vi.fn(),
    })

    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/summary',
      expect.objectContaining({ signal: controller.signal })
    )
  })
})
