import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { getCached, setCache } from './cache'
import { fetchTranscript, TranscriptPendingError } from './transcript'

vi.mock('./cache', () => ({
  getCached: vi.fn(),
  setCache: vi.fn(),
}))

const mockGetCached = vi.mocked(getCached)
const mockSetCache = vi.mocked(setCache)

describe('fetchTranscript', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    globalThis.fetch = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return cached result when available', async () => {
    const cached = {
      content: 'cached transcript',
      lang: 'en',
      availableLangs: ['en'],
      cachedAt: Date.now(),
    }
    mockGetCached.mockResolvedValue(cached)

    const result = await fetchTranscript('https://youtu.be/abc')

    expect(result.content).toBe('cached transcript')
    expect(globalThis.fetch).not.toHaveBeenCalled()
  })

  it('should fetch from API when cache is empty', async () => {
    mockGetCached.mockResolvedValue(null)
    const apiResult = {
      content: 'api transcript',
      lang: 'en',
      availableLangs: ['en', 'zh'],
    }
    vi.mocked(globalThis.fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(apiResult),
    } as Response)

    const result = await fetchTranscript('https://youtu.be/abc')

    expect(result.content).toBe('api transcript')
    expect(result.lang).toBe('en')
    expect(mockSetCache).toHaveBeenCalledWith(
      'transcript:https://youtu.be/abc',
      expect.objectContaining({ content: 'api transcript', cachedAt: expect.any(Number) })
    )
  })

  it('should throw TranscriptPendingError when job is pending', async () => {
    mockGetCached.mockResolvedValue(null)
    vi.mocked(globalThis.fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ jobId: 'job-123' }),
    } as Response)

    await expect(fetchTranscript('https://youtu.be/abc')).rejects.toThrow(TranscriptPendingError)
  })

  it('should throw on non-ok response', async () => {
    mockGetCached.mockResolvedValue(null)
    vi.mocked(globalThis.fetch).mockResolvedValue({
      ok: false,
      status: 500,
    } as Response)

    await expect(fetchTranscript('https://youtu.be/abc')).rejects.toThrow('Transcript fetch failed')
  })

  it('should pass abort signal to fetch', async () => {
    mockGetCached.mockResolvedValue(null)
    vi.mocked(globalThis.fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ content: 'text', lang: 'en', availableLangs: [] }),
    } as Response)

    const controller = new AbortController()
    await fetchTranscript('https://youtu.be/abc', controller.signal)

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ signal: controller.signal })
    )
  })
})
