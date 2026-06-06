import { cn } from '@/lib/utils'

interface PulseDotProps {
  color?: 'green' | 'blue' | 'amber' | 'red'
  className?: string
}

export function PulseDot({ color = 'green', className }: PulseDotProps) {
  const colors = {
    green: 'bg-emerald-400',
    blue:  'bg-blue-400',
    amber: 'bg-amber-400',
    red:   'bg-red-400',
  }

  return (
    <span className={cn('relative inline-flex h-2 w-2', className)}>
      <span
        className={cn(
          'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
          colors[color]
        )}
      />
      <span className={cn('relative inline-flex h-2 w-2 rounded-full', colors[color])} />
    </span>
  )
}
