import { cn } from '@/lib/utils'
import type { EventType } from '@/types/events'
import { eventBadgeColor } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'event'
  eventType?: EventType
}

export function Badge({ children, className, variant = 'default', eventType }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider',
        variant === 'default' && 'border-white/10 bg-white/5 text-white/50',
        variant === 'event' && eventType && eventBadgeColor(eventType),
        className
      )}
    >
      {children}
    </span>
  )
}
