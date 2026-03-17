import process from 'node:process'
import { Supadata } from '@supadata/js'

const supadata = new Supadata({ apiKey: process.env.SUPADATA_API_KEY! })

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get('url')

  if (!url) {
    return Response.json({ error: 'Missing url parameter' }, { status: 400 })
  }

  try {
    const result = await supadata.web.scrape(url)

    if (!result.content) {
      return Response.json({ error: 'No content extracted from URL' }, { status: 422 })
    }

    const domain = new URL(result.url || url).hostname

    return Response.json({
      content: result.content,
      title: result.name || '',
      domain,
    })
  } catch (error) {
    console.error('[scrape] Error:', error)
    return Response.json({ error: 'Failed to scrape web page' }, { status: 500 })
  }
}
