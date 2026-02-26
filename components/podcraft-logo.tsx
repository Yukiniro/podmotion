'use client'

import { Mic2 } from 'lucide-react'

export function PodCraftLogo() {
  return (
    <div className="flex items-center gap-2">
      <Mic2 className="h-5 w-5 text-foreground" />
      <span className="text-base font-semibold tracking-tight text-foreground">PodCraft</span>
    </div>
  )
}
