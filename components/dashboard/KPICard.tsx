import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface KPICardProps {
  label: string
  value: string
  delta?: string
  deltaUp?: boolean
  icon: LucideIcon
  iconColor?: string
  description?: string
}

export function KPICard({
  label,
  value,
  delta,
  deltaUp,
  icon: Icon,
  iconColor = 'text-indigo-400',
  description,
}: KPICardProps) {
  return (
    <Card className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-widest text-white/35">
          {label}
        </span>
        <div className={cn('rounded-md bg-white/[0.04] p-1.5', iconColor)}>
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>

      {/* Value */}
      <div className="flex items-end gap-2">
        <span className="animate-count text-3xl font-semibold tabular-nums tracking-tight text-white">
          {value}
        </span>
        {delta && (
          <span
            className={cn(
              'mb-0.5 text-xs font-medium',
              deltaUp ? 'text-emerald-400' : 'text-red-400'
            )}
          >
            {deltaUp ? '↑' : '↓'} {delta}
          </span>
        )}
      </div>

      {description && (
        <p className="text-xs text-white/25">{description}</p>
      )}
    </Card>
  )
}
