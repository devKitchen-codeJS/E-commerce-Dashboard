'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import type { FunnelStep } from '@/types/events'

interface FunnelChartProps {
  data: FunnelStep[]
}

const COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff']

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload as FunnelStep
  return (
    <div className="rounded-lg border border-white/10 bg-[#0d1117] px-3 py-2 text-xs shadow-xl">
      <p className="font-medium text-white">{d.name}</p>
      <p className="mt-0.5 text-white/50">
        {d.count.toLocaleString()} events &middot; {d.percentage}%
      </p>
    </div>
  )
}

export function FunnelChart({ data }: FunnelChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversion Funnel</CardTitle>
      </CardHeader>

      {/* Step labels + drop-off */}
      <div className="mb-4 flex items-center gap-1">
        {data.map((step, i) => (
          <div key={step.name} className="flex items-center gap-1">
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-medium text-white/60">
                {step.percentage}%
              </span>
              <div
                className="mt-1 h-1 rounded-full bg-indigo-500/40"
                style={{ width: 48 + (step.percentage / 100) * 20 }}
              />
            </div>
            {i < data.length - 1 && (
              <span className="text-white/15">→</span>
            )}
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barCategoryGap="25%">
          <XAxis
            dataKey="name"
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
