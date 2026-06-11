'use client'

import { Pause, Play, Zap } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PulseDot } from '@/components/ui/PulseDot'

interface GeneratorBarProps {
  running: boolean
  count: number
  error: string | null
  onToggle: () => void
}

export function GeneratorBar({ running, count, error, onToggle }: GeneratorBarProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5">
      <div className="flex items-center gap-2">
        <Zap className="h-3.5 w-3.5 text-indigo-400" />
        <span className="text-xs font-medium text-white/50">Event Simulator</span>
      </div>

      <div className="h-3 w-px bg-white/10" />

      <div className="flex items-center gap-1.5">
        <PulseDot color={running ? 'green' : 'amber'} />
        <span className="text-xs text-white/35">
          {running ? 'generating' : 'paused'}
        </span>
      </div>

      <span className="text-xs tabular-nums text-white/25">
        {count.toLocaleString()} events sent
      </span>

      {error && (
        <span className="text-xs text-red-400">{error}</span>
      )}

      <div className="ml-auto">
        <Button variant="outline" size="sm" onClick={onToggle}>
          {running
            ? <><Pause className="h-3 w-3" /> Pause</>
            : <><Play className="h-3 w-3" /> Resume</>
          }
        </Button>
      </div>
    </div>
  )
}
