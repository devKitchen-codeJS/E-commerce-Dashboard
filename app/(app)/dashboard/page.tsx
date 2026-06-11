'use client'

import { useMemo } from 'react'
import { Users, DollarSign, TrendingUp, Activity } from 'lucide-react'

import { useRealtimeEvents }  from '@/lib/hooks/useRealtimeEvents'
import { useEventGenerator }  from '@/lib/hooks/useEventGenerator'
import { calculateKPIs, calculateFunnel, calculateTopProducts } from '@/lib/eventGenerator'
import { formatCurrency }     from '@/lib/utils'

import { KPICard }       from '@/components/dashboard/KPICard'
import { EventFeed }     from '@/components/dashboard/EventFeed'
import { FunnelChart }   from '@/components/dashboard/FunnelChart'
import { TopProducts }   from '@/components/dashboard/TopProducts'
import { ActivityChart } from '@/components/dashboard/ActivityChart'
import { GeneratorBar }  from '@/components/dashboard/GeneratorBar'

export default function DashboardPage() {
  const { events, connected }              = useRealtimeEvents(10)
  const { running, count, error, toggle }  = useEventGenerator()

  const kpis     = useMemo(() => calculateKPIs(events),          [events])
  const funnel   = useMemo(() => calculateFunnel(events),        [events])
  const products = useMemo(() => calculateTopProducts(events),   [events])

  return (
    <div className="flex flex-col gap-5 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white/90">Dashboard</h1>
          <p className="text-xs text-white/30">Last 10 minutes of activity</p>
        </div>
      </div>

      <GeneratorBar running={running} count={count} error={error} onToggle={toggle} />

      <div className="grid grid-cols-4 gap-4">
        <KPICard label="Active Users"     value={kpis.activeUsers.toString()}         icon={Users}       iconColor="text-blue-400"    description="Unique sessions (last 5 min)" />
        <KPICard label="Revenue"          value={formatCurrency(kpis.revenue)}        icon={DollarSign}  iconColor="text-emerald-400" description="From purchases this window" />
        <KPICard label="Conversion Rate"  value={`${kpis.conversionRate}%`}           icon={TrendingUp}  iconColor="text-indigo-400"  description="Purchases / Page views" />
        <KPICard label="Events / min"     value={kpis.eventsPerMinute.toString()}     icon={Activity}    iconColor="text-amber-400"   description="Events in the last 60 seconds" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <EventFeed events={events} connected={connected} />
        </div>
        <TopProducts products={products.map((p) => ({ ...p, name: p.name ?? p.product_id }))} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FunnelChart data={funnel} />
        <ActivityChart events={events} />
      </div>
    </div>
  )
}
