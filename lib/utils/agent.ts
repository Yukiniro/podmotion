export function buildCoverImagePrompt(summary: string, style: string, title?: string): string {
  const styleDescriptions: Record<string, string> = {
    casual: 'relaxed, friendly, and approachable',
    'popular-science': 'educational, curious, and modern',
    news: 'professional, authoritative, and clean',
  }

  const styleDesc = styleDescriptions[style] || styleDescriptions.casual
  const titlePart = title ? `\nTitle text to include: "${title}"` : ''

  return `Create a modern, minimalist podcast cover image.
Theme: ${styleDesc} podcast about the following topic.
Topic summary: ${summary.slice(0, 500)}${titlePart}

Design requirements:
- Clean, professional composition suitable for podcast platforms
- Bold typography if including text
- Vibrant but not overwhelming color palette
- Square format (1:1 aspect ratio)
- No human faces or photographs
- Abstract or geometric design elements preferred`
}
