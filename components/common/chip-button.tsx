'use client'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const chipButtonVariants = cva(
  'transition-colors duration-150 ease-out',
  {
    variants: {
      size: {
        sm: 'rounded-lg px-1.5 py-0.5 text-[11px]',
        md: 'rounded-lg px-2 py-0.5 text-[11px]',
        lg: 'rounded-2xl px-3.5 py-1.5 text-sm',
      },
      active: {
        true: 'bg-foreground text-background',
        false: 'bg-muted text-muted-foreground hover:text-foreground',
      },
    },
    defaultVariants: {
      size: 'md',
      active: false,
    },
  }
)

interface ChipButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    Omit<VariantProps<typeof chipButtonVariants>, 'active'> {
  active?: boolean
}

export function ChipButton({ className, size, active = false, ...props }: ChipButtonProps) {
  return (
    <button className={cn(chipButtonVariants({ size, active }), className)} {...props} />
  )
}
