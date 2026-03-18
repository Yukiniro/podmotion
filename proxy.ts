import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'

import { routing } from './i18n/routing'
import { generateInviteToken } from './lib/utils/invite'

const intlMiddleware = createMiddleware(routing)

const localePattern = routing.locales.join('|')
const invitePageRegex = new RegExp(`^\\/(${localePattern})\\/invite(\\/|$)`)
const localeRegex = new RegExp(`^\\/(${localePattern})`)

let cachedToken: string | null = null
let cachedCode: string | null = null

async function getExpectedToken(inviteCode: string) {
  if (cachedCode === inviteCode && cachedToken) return cachedToken
  cachedToken = await generateInviteToken(inviteCode)
  cachedCode = inviteCode
  return cachedToken
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const inviteCode = process.env.INVITE_CODE

  if (inviteCode) {
    // 跳过邀请码页面，避免无限重定向
    const isInvitePage = invitePageRegex.test(pathname) || pathname === '/invite'

    if (!isInvitePage) {
      const cookie = request.cookies.get('invite_verified')?.value
      const expectedToken = await getExpectedToken(inviteCode)

      if (cookie !== expectedToken) {
        const localeMatch = pathname.match(localeRegex)
        const locale = localeMatch ? localeMatch[1] : routing.defaultLocale
        const url = request.nextUrl.clone()
        url.pathname = `/${locale}/invite`
        return NextResponse.redirect(url)
      }
    }
  }

  return intlMiddleware(request)
}

export const config = {
  // 匹配所有路径，除了以下：
  matcher: [
    // 排除 API 路由
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}
