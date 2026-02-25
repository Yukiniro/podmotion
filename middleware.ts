import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // 匹配所有路径，除了以下：
  matcher: [
    // 排除 API 路由
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}
