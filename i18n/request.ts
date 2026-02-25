import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  // 获取请求的语言
  let locale = await requestLocale

  // 验证语言是否支持
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    // 动态导入翻译文件
    messages: (await import(`../languages/${locale}.json`)).default,
  }
})
