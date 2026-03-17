import { getCached, setCache } from './cache'

export interface ScrapeResult {
  content: string
  title: string
  domain: string
}

export async function fetchScrape(url: string, signal?: AbortSignal): Promise<ScrapeResult> {
  const cacheKey = `scrape:${url}`

  const cached = await getCached<ScrapeResult & { cachedAt: number }>(cacheKey)
  if (cached?.content) return cached

  const res = await fetch(`/api/scrape?url=${encodeURIComponent(url)}`, { signal })
  if (!res.ok) throw new Error('Web page scrape failed')

  const data = await res.json()

  const result: ScrapeResult = {
    content: data.content,
    title: data.title,
    domain: data.domain,
  }

  await setCache(cacheKey, { ...result, cachedAt: Date.now() })
  return result
}
