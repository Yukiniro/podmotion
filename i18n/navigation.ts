import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

// 创建国际化导航工具
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing)
