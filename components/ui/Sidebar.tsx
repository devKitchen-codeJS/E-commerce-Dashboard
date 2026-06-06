'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, Activity, Sparkles, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PulseDot } from '@/components/ui/PulseDot'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard',   icon: BarChart3 },
  { href: '/events',    label: 'Live Events', icon: Activity  },
  { href: '/insights',  label: 'AI Insights', icon: Sparkles  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-56 flex-col border-r border-white/[0.06] bg-white/[0.02] px-3 py-4">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-2.5 px-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 ring-1 ring-indigo-500/30">
          <Zap className="h-3.5 w-3.5 text-indigo-400" />
        </div>
        <span className="text-sm font-semibold tracking-tight text-white/90">
          pulse<span className="text-indigo-400">.</span>analytics
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5">
        <p className="mb-1 px-2 text-[10px] font-medium uppercase tracking-widest text-white/25">
          Navigation
        </p>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-all',
                active
                  ? 'bg-white/[0.07] text-white'
                  : 'text-white/40 hover:bg-white/[0.04] hover:text-white/70'
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
              {label === 'Live Events' && (
                <PulseDot className="ml-auto" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom status */}
      <div className="mt-auto rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
        <div className="flex items-center gap-2">
          <PulseDot color="green" />
          <span className="text-xs text-white/40">Simulator active</span>
        </div>
      </div>
    </aside>
  )
}
