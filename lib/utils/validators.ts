export function isValidYoutubeUrl(url: string): boolean {
  const pattern = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)/
  return pattern.test(url.trim())
}
