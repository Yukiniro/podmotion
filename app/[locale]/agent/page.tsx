'use client'

import { useSearchParams } from 'next/navigation'

import { AgentContainer } from '@/components/agent'

export default function AgentPage() {
  const searchParams = useSearchParams()
  const initialInput = searchParams.get('q') ?? undefined

  return <AgentContainer initialInput={initialInput} />
}
