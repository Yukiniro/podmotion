import { generateInviteToken } from '@/lib/utils/invite'

export async function POST(req: Request) {
  const inviteCode = process.env.INVITE_CODE
  if (!inviteCode) {
    return Response.json({ success: true })
  }

  const { code } = (await req.json()) as { code: string }

  if (!code || code !== inviteCode) {
    return Response.json({ error: 'Invalid invitation code' }, { status: 401 })
  }

  const token = await generateInviteToken(inviteCode)
  const maxAge = 30 * 24 * 60 * 60
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''

  const response = Response.json({ success: true })
  response.headers.set(
    'Set-Cookie',
    `invite_verified=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`,
  )

  return response
}
