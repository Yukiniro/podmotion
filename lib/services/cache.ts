import { storage } from '@/lib/storage'

export async function getCached<T>(key: string): Promise<T | null> {
  return storage.getItem<T>(key)
}

export async function setCache<T extends Record<string, unknown>>(
  key: string,
  data: T
): Promise<void> {
  await storage.setItem(key, JSON.stringify(data))
}

export async function removeCache(key: string): Promise<void> {
  await storage.removeItem(key)
}
