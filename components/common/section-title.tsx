import { cn } from '@/lib/utils'

interface SectionTitleProps {
  children: React.ReactNode
  className?: string
}

export function SectionTitle({ children, className }: SectionTitleProps) {
  return (
    <h3 className={cn('text-xs font-medium uppercase tracking-wider text-muted-foreground', className)}>
      {children}
    </h3>
  )
}
