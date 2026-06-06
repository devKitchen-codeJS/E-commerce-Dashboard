import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  glass?: boolean
}

export function Card({ children, className, glass, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-white/[0.06] bg-white/[0.03] p-5',
        glass && 'backdrop-blur-sm bg-white/[0.05]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-4 flex items-center justify-between', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-xs font-medium uppercase tracking-widest text-white/40', className)} {...props}>
      {children}
    </h3>
  )
}
