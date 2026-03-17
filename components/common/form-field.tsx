import { cn } from '@/lib/utils'

interface FormFieldProps {
  label: string
  children: React.ReactNode
  className?: string
}

export function FormField({ label, children, className }: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
    </div>
  )
}
