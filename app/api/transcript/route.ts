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
    const result = await supadata.transcript({
      url,
      text: true,
      mode: 'auto',
    })

    if ('jobId' in result) {
      return Response.json({ jobId: result.jobId, status: 'processing' }, { status: 202 })
    }

    return Response.json({
      content: result.content,
      lang: result.lang,
      availableLangs: result.availableLangs,
    })
  } catch (error) {
    console.error('[transcript] Error:', error)
    return Response.json({ error: 'Failed to fetch transcript' }, { status: 500 })
  }
}
