import { cn } from '@/lib/utils'

interface AppHeaderProps {
  children: React.ReactNode
  className?: string
}

export function AppHeader({ children, className }: AppHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 flex items-center justify-between border-b border-border/50 bg-background/80 px-6 py-4 backdrop-blur-xl',
        className
      )}
    >
      {children}
    </header>
  )
}
