'use client'

import { useMemo } from 'react'
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import type { AnalyticsEvent } from '@/types/events'

interface ActivityChartProps {
  events: AnalyticsEvent[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-white/10 bg-[#0d1117] px-2 py-1.5 text-xs">
      <span className="text-white/60">{payload[0].payload.label}</span>
      <span className="ml-2 font-medium text-white">{payload[0].value} events</span>
    </div>
  )
}

export function ActivityChart({ events }: ActivityChartProps) {
  const data = useMemo(() => {
    // Bucket events into 30-second windows over the last 10 minutes
    const now = Date.now()
    const WINDOW = 10 * 60 * 1000
    const BUCKET = 30 * 1000
    const buckets = Math.floor(WINDOW / BUCKET)

    return Array.from({ length: buckets }, (_, i) => {
      const bucketStart = now - WINDOW + i * BUCKET
      const bucketEnd   = bucketStart + BUCKET
      const count = events.filter((e) => {
        const t = new Date(e.timestamp).getTime()
        return t >= bucketStart && t < bucketEnd
      }).length

      const mins = Math.floor((now - bucketStart) / 60000)
      return {
        label: mins > 0 ? `${mins}m ago` : 'now',
        count,
      }
    })
  }, [events])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity (last 10 min)</CardTitle>
      </CardHeader>

      <ResponsiveContainer width="100%" height={120}>
        <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="activityGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="label"
            tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 9 }}
            axisLine={false}
            tickLine={false}
            interval={4}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#6366f1"
            strokeWidth={1.5}
            fill="url(#activityGrad)"
            dot={false}
            activeDot={{ r: 3, fill: '#6366f1' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  )
}
