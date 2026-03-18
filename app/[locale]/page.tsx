'use client'

import { HomePage } from '@/components/home-page'
import { useRouter } from '@/i18n/navigation'

export default function Page() {
  const router = useRouter()

  const handleNavigate = (input: string) => {
    router.push(`/agent?q=${encodeURIComponent(input)}`)
  }

  return <HomePage onNavigate={handleNavigate} />
}
